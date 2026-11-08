// ============================================================================
// Zero-Dependency Micro QR Matrix Generator (Byte mode, L/M/Q/H Error Correction)
// ============================================================================

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// Finder pattern coordinates (Top-Left, Top-Right, Bottom-Left)
export function isFinderPattern(row: number, col: number, moduleCount: number): boolean {
  if (row < 7 && col < 7) return true; // Top-Left
  if (row < 7 && col >= moduleCount - 7) return true; // Top-Right
  if (row >= moduleCount - 7 && col < 7) return true; // Bottom-Left
  return false;
}

// Check if point is inside the center cutout area for the logo badge
export function isCenterCutout(
  row: number,
  col: number,
  moduleCount: number,
  cutoutRatio: number = 0.28
): boolean {
  const center = (moduleCount - 1) / 2;
  const radius = (moduleCount * cutoutRatio) / 2;
  const dist = Math.hypot(row - center, col - center);
  return dist <= radius + 0.5;
}

// Lightweight Reed-Solomon GF(256) and QR Table generator
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
})();

function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function polyMul(p1: Uint8Array<any>, p2: Uint8Array<any>): Uint8Array<any> {
  const res = new Uint8Array(p1.length + p2.length - 1);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      res[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return res;
}

function rsGeneratorPoly(degree: number): Uint8Array<any> {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    poly = polyMul(poly, new Uint8Array([1, GF256_EXP[i]]));
  }
  return poly;
}

function rsCalculateEc(data: Uint8Array<any>, ecCount: number): Uint8Array<any> {
  const gen = rsGeneratorPoly(ecCount);
  const msg = new Uint8Array(data.length + ecCount);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

// Version table constants for QR 1-6 (suitable for URLs, handles, invoices)
interface VersionInfo {
  version: number;
  totalWords: number;
  ecWords: Record<ErrorCorrectionLevel, number>;
  blocks: Record<ErrorCorrectionLevel, number>;
}

const VERSIONS: VersionInfo[] = [
  { version: 1, totalWords: 26, ecWords: { L: 7, M: 10, Q: 13, H: 17 }, blocks: { L: 1, M: 1, Q: 1, H: 1 } },
  { version: 2, totalWords: 44, ecWords: { L: 10, M: 16, Q: 22, H: 28 }, blocks: { L: 1, M: 1, Q: 1, H: 1 } },
  { version: 3, totalWords: 70, ecWords: { L: 15, M: 26, Q: 36, H: 44 }, blocks: { L: 1, M: 1, Q: 2, H: 2 } },
  { version: 4, totalWords: 100, ecWords: { L: 20, M: 36, Q: 52, H: 64 }, blocks: { L: 1, M: 2, Q: 2, H: 4 } },
  { version: 5, totalWords: 134, ecWords: { L: 26, M: 48, Q: 72, H: 88 }, blocks: { L: 1, M: 2, Q: 4, H: 4 } },
  { version: 6, totalWords: 172, ecWords: { L: 36, M: 64, Q: 96, H: 112 }, blocks: { L: 2, M: 4, Q: 4, H: 4 } },
];

export function generateQrMatrix(
  text: string,
  level: ErrorCorrectionLevel = "Q"
): { matrix: boolean[][]; moduleCount: number } {
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(text);

  // Pick suitable version
  let pickedVersion = VERSIONS[0];
  for (const v of VERSIONS) {
    const dataCap = v.totalWords - v.ecWords[level];
    if (rawBytes.length + 3 <= dataCap) {
      pickedVersion = v;
      break;
    }
    pickedVersion = v;
  }

  const ver = pickedVersion.version;
  const moduleCount = 17 + ver * 4;
  const matrix: boolean[][] = Array.from({ length: moduleCount }, () => Array(moduleCount).fill(false));
  const isFunction: boolean[][] = Array.from({ length: moduleCount }, () => Array(moduleCount).fill(false));

  // 1. Finder patterns
  const setFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        isFunction[top + r][left + c] = true;
        matrix[top + r][left + c] =
          r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      }
    }
    // Separators
    for (let i = 0; i < 8; i++) {
      if (top + 7 < moduleCount && left + i < moduleCount) isFunction[top + 7][left + i] = true;
      if (top + i < moduleCount && left + 7 < moduleCount) isFunction[top + i][left + 7] = true;
      if (top - 1 >= 0 && left + i < moduleCount) isFunction[top - 1][left + i] = true;
      if (top + i < moduleCount && left - 1 >= 0) isFunction[top + i][left - 1] = true;
    }
  };
  setFinder(0, 0);
  setFinder(0, moduleCount - 7);
  setFinder(moduleCount - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    isFunction[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    isFunction[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Dark module & format placeholders
  isFunction[moduleCount - 8][8] = true;
  matrix[moduleCount - 8][8] = true;
  for (let i = 0; i < 9; i++) {
    isFunction[8][i] = true;
    isFunction[i][8] = true;
    if (i < 8) {
      isFunction[8][moduleCount - 1 - i] = true;
      isFunction[moduleCount - 1 - i][8] = true;
    }
  }

  // 4. Data encoding (Byte Mode: 0100)
  const totalDataBytes = pickedVersion.totalWords - pickedVersion.ecWords[level];
  const bitBuf: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bitBuf.push((val >> i) & 1);
  };
  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(rawBytes.length, 8); // Character count (ver 1-9)
  for (const b of rawBytes) pushBits(b, 8);

  // Terminator
  for (let i = 0; i < 4 && bitBuf.length < totalDataBytes * 8; i++) bitBuf.push(0);
  while (bitBuf.length % 8 !== 0) bitBuf.push(0);

  // Pad bytes (0xEC, 0x11)
  const pad = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuf.length < totalDataBytes * 8) {
    pushBits(pad[padIdx % 2], 8);
    padIdx++;
  }

  // Convert to byte array
  const dataBytes = new Uint8Array(totalDataBytes);
  for (let i = 0; i < totalDataBytes; i++) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) byteVal = (byteVal << 1) | bitBuf[i * 8 + b];
    dataBytes[i] = byteVal;
  }

  // Reed Solomon error correction
  const ecCount = pickedVersion.ecWords[level];
  const ecBytes = rsCalculateEc(dataBytes, ecCount);

  // Interleave and create full codeword stream
  const fullCodewords = new Uint8Array(totalDataBytes + ecCount);
  fullCodewords.set(dataBytes, 0);
  fullCodewords.set(ecBytes, totalDataBytes);

  // Convert codewords to bitstream
  const fullBits: number[] = [];
  for (const byte of fullCodewords) {
    for (let i = 7; i >= 0; i--) fullBits.push((byte >> i) & 1);
  }

  // 5. Place bits in matrix
  let bitIdx = 0;
  let direction = -1; // Going up
  let col = moduleCount - 1;

  while (col > 0) {
    if (col === 6) col--; // Skip vertical timing column
    const rowRange = direction === -1
      ? Array.from({ length: moduleCount }, (_, i) => moduleCount - 1 - i)
      : Array.from({ length: moduleCount }, (_, i) => i);

    for (const row of rowRange) {
      for (const c of [col, col - 1]) {
        if (!isFunction[row][c]) {
          const bit = bitIdx < fullBits.length ? fullBits[bitIdx++] : 0;
          // Apply standard Mask 0: (row + col) % 2 == 0
          const mask = (row + c) % 2 === 0;
          matrix[row][c] = (bit ^ (mask ? 1 : 0)) === 1;
        }
      }
    }
    col -= 2;
    direction = -direction;
  }

  // Format info for Mask 0 and selected level
  // Mask 0 bits with BCH (15, 5)
  const formatBitsMap: Record<ErrorCorrectionLevel, number> = {
    L: 0b111011111000100,
    M: 0b101010000010010,
    Q: 0b011010101011111,
    H: 0b001011010001001,
  };
  const fBits = formatBitsMap[level];
  for (let i = 0; i < 15; i++) {
    const bit = ((fBits >> (14 - i)) & 1) === 1;
    // Around top-left
    if (i < 6) matrix[8][i] = bit;
    else if (i === 6) matrix[8][7] = bit;
    else if (i === 7) matrix[8][8] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else matrix[14 - i][8] = bit;

    // Around other finders
    if (i < 8) matrix[moduleCount - 1 - i][8] = bit;
    else matrix[8][moduleCount - 15 + i] = bit;
  }

  return { matrix, moduleCount };
}

// ============================================================================
// Standard Compliant QR Matrix Generator (sbuiSDK)
// Uses ISO/IEC 18004 standard generator with Reed-Solomon EC & Alignment patterns
// ============================================================================

import QRCodeLib from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// Check if cell is within the 7x7 finder pattern or its 1-module separator zone
export function isFinderPattern(row: number, col: number, moduleCount: number): boolean {
  // Top-Left (7x7 finder + 1 separator = 8x8 zone)
  if (row < 8 && col < 8) return true;
  // Top-Right
  if (row < 8 && col >= moduleCount - 8) return true;
  // Bottom-Left
  if (row >= moduleCount - 8 && col < 8) return true;
  return false;
}

// Check if point is inside the center cutout area for the logo badge
export function isCenterCutout(
  row: number,
  col: number,
  moduleCount: number,
  cutoutRatio: number = 0.22
): boolean {
  if (cutoutRatio <= 0) return false;
  const center = (moduleCount - 1) / 2;
  const radius = (moduleCount * cutoutRatio) / 2;
  const dist = Math.hypot(row - center, col - center);
  return dist <= radius;
}

export function generateQrMatrix(
  text: string,
  level: ErrorCorrectionLevel = "Q"
): { matrix: boolean[][]; moduleCount: number } {
  try {
    const qr = QRCodeLib.create(text || "https://saviorbill.dev", {
      errorCorrectionLevel: level,
    });
    const size = qr.modules.size;
    const matrix: boolean[][] = [];

    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        row.push(Boolean(qr.modules.get(r, c)));
      }
      matrix.push(row);
    }

    return { matrix, moduleCount: size };
  } catch (err) {
    console.warn("QR generation with level", level, "failed, falling back to L:", err);
    const qr = QRCodeLib.create(text || "https://saviorbill.dev", {
      errorCorrectionLevel: "L",
    });
    const size = qr.modules.size;
    const matrix: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        row.push(Boolean(qr.modules.get(r, c)));
      }
      matrix.push(row);
    }
    return { matrix, moduleCount: size };
  }
}

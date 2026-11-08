// ============================================================================
// QRCode: Liquid Rounded Connected Vector QR Code Component (sbuiSDK)
// Pixel-perfect connected capsules, rounded squircle finders & center logo cutout
// ============================================================================

import React, { useMemo } from "react";
import { generateQrMatrix, isFinderPattern, isCenterCutout, ErrorCorrectionLevel } from "./qrMatrix";
import "./QRCode.scss";

export interface QRCodeProps {
  value: string;
  size?: number;
  plateRadius?: number;
  logo?: "UNVI" | "UNVIDark" | "UNVILight" | string;
  logoSize?: number;
  errorCorrection?: ErrorCorrectionLevel;
  theme?: "default" | "dark" | "light" | "brand";
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  backgroundColor?: string;
}

// Built-in UNVI vector mark
const UNVI_SVG_PATH =
  "M844 0C943.411 0 1024 80.5887 1024 180V844C1024 943.411 943.411 1024 844 1024H180C80.5887 1024 0 943.411 0 844V180C0 80.5887 80.5887 0 180 0H844ZM720.307 199.756C693.646 215.752 693.646 215.752 693.646 266.185V558.779L513.247 689.414L332.846 558.779V455.693H156V650.312C156 656.533 156 683.193 196.88 709.854L505.248 913.359V822.715C505.248 817.383 499.027 805.83 494.584 803.164L253.754 650.312C253.754 650.312 235.092 639.648 235.092 612.988V524.121C235.092 524.102 235.102 515.234 244.423 515.234C253.744 515.234 253.754 524.102 253.754 524.121V604.102C253.754 630.762 272.416 641.426 272.416 641.426L513.246 794.277L754.076 641.426C754.076 641.426 772.738 630.762 772.738 604.102V266.406C772.738 266.387 772.748 257.52 782.069 257.52C791.39 257.52 791.4 266.387 791.4 266.406V612.988C791.4 639.648 772.738 650.312 772.738 650.312L531.908 803.164C527.465 805.83 521.244 817.383 521.245 822.715L521.244 913.359L829.614 709.854C870.492 683.193 870.492 656.533 870.492 650.312V110L720.307 199.756ZM156 436.143H332.847V374.824C332.847 348.164 305.297 337.5 274.193 326.836C243.09 316.172 237.758 301.509 237.758 273.516V161.543L156 110V436.143Z";

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 260,
  plateRadius = 28,
  logo = "UNVIDark",
  logoSize,
  errorCorrection = "Q",
  theme = "default",
  className = "",
  style,
  color,
  backgroundColor,
}) => {
  const { matrix, moduleCount } = useMemo(() => {
    return generateQrMatrix(value || "https://saviorbill.dev", errorCorrection);
  }, [value, errorCorrection]);

  const padding = 18;
  const qrInnerSize = size - padding * 2;
  const cellSize = qrInnerSize / moduleCount;

  // Center cutout geometry
  const badgeDiameter = logoSize || Math.max(46, size * 0.28);
  const badgeRadius = badgeDiameter / 2;
  const centerCoord = size / 2;

  // Render corner finders as smooth squircle frames and rounded eyes
  const renderFinder = (x: number, y: number, key: string) => {
    const finderSize = 7 * cellSize;
    const outerRadius = cellSize * 2.2;
    const innerRadius = cellSize * 1.4;
    const eyeSize = 3.2 * cellSize;
    const eyeOffset = 1.9 * cellSize;

    return (
      <g key={key} className="sbui-qr-finder">
        {/* Outer squircle frame */}
        <rect
          x={x}
          y={y}
          width={finderSize}
          height={finderSize}
          rx={outerRadius}
          ry={outerRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth={cellSize * 0.98}
        />
        {/* Inner solid squircle eye */}
        <rect
          x={x + eyeOffset}
          y={y + eyeOffset}
          width={eyeSize}
          height={eyeSize}
          rx={innerRadius}
          ry={innerRadius}
          fill="currentColor"
        />
      </g>
    );
  };

  // Render connected liquid modules
  // Each module connects to adjacent active modules, rounding outer convex corners
  const liquidPaths: string[] = [];
  const rad = cellSize * 0.44;

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!matrix[r][c]) continue;
      if (isFinderPattern(r, c, moduleCount)) continue;
      if (isCenterCutout(r, c, moduleCount, (badgeDiameter + 10) / qrInnerSize)) continue;

      const x0 = padding + c * cellSize;
      const y0 = padding + r * cellSize;
      const x1 = x0 + cellSize;
      const y1 = y0 + cellSize;

      const hasTop = r > 0 && matrix[r - 1][c] && !isFinderPattern(r - 1, c, moduleCount);
      const hasBottom = r < moduleCount - 1 && matrix[r + 1][c] && !isFinderPattern(r + 1, c, moduleCount);
      const hasLeft = c > 0 && matrix[r][c - 1] && !isFinderPattern(r, c - 1, moduleCount);
      const hasRight = c < moduleCount - 1 && matrix[r][c + 1] && !isFinderPattern(r, c + 1, moduleCount);

      const roundTL = !hasTop && !hasLeft;
      const roundTR = !hasTop && !hasRight;
      const roundBR = !hasBottom && !hasRight;
      const roundBL = !hasBottom && !hasLeft;

      let d = `M ${x0 + (roundTL ? rad : 0)} ${y0}`;
      d += ` L ${x1 - (roundTR ? rad : 0)} ${y0}`;
      if (roundTR) d += ` A ${rad} ${rad} 0 0 1 ${x1} ${y0 + rad}`;
      d += ` L ${x1} ${y1 - (roundBR ? rad : 0)}`;
      if (roundBR) d += ` A ${rad} ${rad} 0 0 1 ${x1 - rad} ${y1}`;
      d += ` L ${x0 + (roundBL ? rad : 0)} ${y1}`;
      if (roundBL) d += ` A ${rad} ${rad} 0 0 1 ${x0} ${y1 - rad}`;
      d += ` L ${x0} ${y0 + (roundTL ? rad : 0)}`;
      if (roundTL) d += ` A ${rad} ${rad} 0 0 1 ${x0 + rad} ${y0}`;
      d += ` Z`;

      liquidPaths.push(d);
    }
  }

  const themeClass =
    theme === "dark"
      ? "sbui-qr-theme-dark"
      : theme === "brand"
      ? "sbui-qr-theme-brand"
      : theme === "light"
      ? "sbui-qr-theme-light"
      : "";

  const containerStyle: React.CSSProperties = {
    ...style,
    ...(color ? ({ "--sbui-qr-fg": color } as React.CSSProperties) : {}),
    ...(backgroundColor ? ({ "--sbui-qr-bg": backgroundColor } as React.CSSProperties) : {}),
    ...(plateRadius ? ({ "--sbui-qr-plate-radius": `${plateRadius}px` } as React.CSSProperties) : {}),
  };

  const logoIconSize = badgeDiameter * 0.7;
  const logoOffset = centerCoord - logoIconSize / 2;

  return (
    <div className={`sbui-qr-container ${themeClass} ${className}`.trim()} style={containerStyle}>
      <div className="sbui-qr-plate" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Left Finder */}
          {renderFinder(padding, padding, "tl")}
          {/* Top-Right Finder */}
          {renderFinder(padding + (moduleCount - 7) * cellSize, padding, "tr")}
          {/* Bottom-Left Finder */}
          {renderFinder(padding, padding + (moduleCount - 7) * cellSize, "bl")}

          {/* Connected Liquid Rounded Modules */}
          <path d={liquidPaths.join(" ")} fill="currentColor" className="sbui-qr-liquid-path" />

          {/* Central Logo Badge */}
          {logo && (
            <g className="sbui-qr-logo-group">
              {/* Disc Cutout */}
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={badgeRadius}
                fill="var(--sbui-qr-badge-bg, #000000)"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))"
              />
              {/* Logo Vector */}
              <g transform={`translate(${logoOffset}, ${logoOffset}) scale(${logoIconSize / 1024})`}>
                <path d={UNVI_SVG_PATH} fill="var(--sbui-qr-badge-fg, #ffffff)" />
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

// Aliases
export const LiquidQR = QRCode;
export default QRCode;

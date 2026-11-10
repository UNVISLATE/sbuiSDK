// ============================================================================
// QRCode: High-Precision Liquid Vector QR Code Component (sbuiSDK)
// Fully compliant with ISO/IEC 18004, instant optical recognition, 1:1:3:1:1 finders
// ============================================================================

import React, { useMemo } from "react";
import { generateQrMatrix, isFinderPattern, isCenterCutout, type ErrorCorrectionLevel } from "./qrMatrix";
import "./QRCode.css";

export interface QRCodeProps {
  value: string;
  size?: number;
  plateRadius?: number;
  logo?: "UNVI" | "UNVIDark" | "UNVILight" | string | boolean | null;
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
  size = 240,
  plateRadius = 20,
  logo = "UNVIDark",
  logoSize,
  errorCorrection = "Q",
  theme = "default",
  className = "",
  style,
  color,
  backgroundColor,
}) => {
  const hasLogo = Boolean(logo && logo !== "none");
  const effectiveEc: ErrorCorrectionLevel = hasLogo ? errorCorrection || "Q" : errorCorrection || "M";

  const { matrix, moduleCount } = useMemo(() => {
    return generateQrMatrix(value || "https://saviorbill.dev", effectiveEc);
  }, [value, effectiveEc]);

  // Standard quiet zone: 3-4 modules
  const paddingModules = 3;
  const totalModules = moduleCount + paddingModules * 2;
  const cellSize = size / totalModules;
  const padding = paddingModules * cellSize;

  // Center logo cutout geometry
  const badgeDiameter = logoSize || Math.min(size * 0.22, 46);
  const cutoutRatio = hasLogo ? (badgeDiameter + cellSize * 1.5) / (moduleCount * cellSize) : 0;
  const centerCoord = size / 2;

  const effectiveBg = backgroundColor || (theme === "dark" ? "#18181b" : "#ffffff");
  const effectiveFg = color || (theme === "dark" ? "#ffffff" : "#09090b");

  // Render corner finders with exact 1:1:3:1:1 module geometry
  const renderFinder = (topRow: number, leftCol: number, key: string) => {
    const x = padding + leftCol * cellSize;
    const y = padding + topRow * cellSize;
    const finderSize = 7 * cellSize;
    const outerRadius = cellSize * 1.5;
    const innerRadius = cellSize * 0.9;
    const eyeRadius = cellSize * 0.75;

    return (
      <g key={key} className="sbui-qr-finder">
        {/* Outer 7x7 module frame */}
        <rect
          x={x}
          y={y}
          width={finderSize}
          height={finderSize}
          rx={outerRadius}
          ry={outerRadius}
          fill="currentColor"
        />
        {/* Cutout 5x5 module ring in background color */}
        <rect
          x={x + cellSize}
          y={y + cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          rx={innerRadius}
          ry={innerRadius}
          fill={effectiveBg}
        />
        {/* Inner 3x3 module solid eye */}
        <rect
          x={x + 2 * cellSize}
          y={y + 2 * cellSize}
          width={3 * cellSize}
          height={3 * cellSize}
          rx={eyeRadius}
          ry={eyeRadius}
          fill="currentColor"
        />
      </g>
    );
  };

  // Connected liquid module path generation
  const liquidPaths: string[] = [];
  const rad = cellSize * 0.35;

  const isActive = (r: number, c: number) => {
    if (r < 0 || r >= moduleCount || c < 0 || c >= moduleCount) return false;
    if (isFinderPattern(r, c, moduleCount)) return false;
    if (hasLogo && isCenterCutout(r, c, moduleCount, cutoutRatio)) return false;
    return matrix[r][c];
  };

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!isActive(r, c)) continue;

      const x0 = padding + c * cellSize;
      const y0 = padding + r * cellSize;
      const x1 = x0 + cellSize;
      const y1 = y0 + cellSize;

      const hasTop = isActive(r - 1, c);
      const hasBottom = isActive(r + 1, c);
      const hasLeft = isActive(r, c - 1);
      const hasRight = isActive(r, c + 1);

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
    color: effectiveFg,
    ...style,
    "--sbui-qr-fg": effectiveFg,
    "--sbui-qr-bg": effectiveBg,
    "--sbui-qr-plate-radius": `${plateRadius}px`,
  } as React.CSSProperties;

  const logoIconSize = badgeDiameter * 0.65;
  const logoOffset = centerCoord - logoIconSize / 2;

  return (
    <div className={`sbui-qr-container ${themeClass} ${className}`.trim()} style={containerStyle}>
      <div className="sbui-qr-plate">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          {/* Background fill */}
          <rect width={size} height={size} fill={effectiveBg} />

          {/* Three Standard 1:1:3:1:1 Corner Finders */}
          {renderFinder(0, 0, "finder-tl")}
          {renderFinder(0, moduleCount - 7, "finder-tr")}
          {renderFinder(moduleCount - 7, 0, "finder-bl")}

          {/* Single Merged Liquid Data Modules Path for 60fps Performance */}
          {liquidPaths.length > 0 && (
            <path d={liquidPaths.join(" ")} fill="currentColor" />
          )}

          {/* Center Logo Badge Cutout & Mark */}
          {hasLogo && (
            <g className="sbui-qr-center-logo">
              {/* Outer white shield around the badge */}
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={badgeDiameter / 2 + cellSize * 0.5}
                fill={effectiveBg}
              />
              {/* Badge circle */}
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={badgeDiameter / 2}
                fill="var(--sbui-qr-badge-bg, #09090b)"
              />
              {/* Vector Logo Icon */}
              <g
                transform={`translate(${logoOffset}, ${logoOffset}) scale(${logoIconSize / 1024})`}
                fill="var(--sbui-qr-badge-fg, #ffffff)"
              >
                <path d={UNVI_SVG_PATH} />
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default QRCode;

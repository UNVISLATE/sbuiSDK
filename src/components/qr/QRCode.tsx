// ============================================================================
// QRCode: Liquid Rounded Vector QR Code Component (sbuiSDK)
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
  "M310 433H111L111 652C111 659 111 689 157.001 719L504 948L504 846C504 840 497 827 492 824L221 652C221 652 200 640 200 610V510C200 510 200 500 210.5 500C221 500 221 510 221 510V600C221 630 242 642 242 642L513 814L784 642C784 642 805 630 805 600V220C805 220 805 210 815.5 210C826 210 826 220 826 220V610C826 640 805 652 805 652L534 824C529 827 522 840 522.001 846L522 948L869.001 719C915 689 915 659 915 652V44L746 145C716 163 716 163 716 219.75V549L513.001 696L310 549V433ZM310.001 342C310.001 312 279 300 244 288C209 276 203 259.5 203 228V102L111 44V411H310.001V342Z";

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

  const padding = 20;
  const qrInnerSize = size - padding * 2;
  const cellSize = qrInnerSize / moduleCount;

  // Center cutout geometry
  const badgeDiameter = logoSize || Math.max(44, size * 0.26);

  // Render corner finders as smooth squircle frames and rounded eyes
  const renderFinder = (x: number, y: number, key: string) => {
    const finderSize = 7 * cellSize;
    const outerRadius = cellSize * 1.8;
    const innerRadius = cellSize * 1.0;
    const eyeSize = 3 * cellSize;
    const eyeOffset = 2 * cellSize;

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
          strokeWidth={cellSize * 0.95}
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

  // Render data dots (rounded squircle capsules/dots)
  const dataDots: React.ReactNode[] = [];
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (!matrix[r][c]) continue;
      if (isFinderPattern(r, c, moduleCount)) continue;
      if (isCenterCutout(r, c, moduleCount, (badgeDiameter + 10) / qrInnerSize)) continue;

      const cx = padding + c * cellSize + cellSize / 2;
      const cy = padding + r * cellSize + cellSize / 2;
      const dotRadius = cellSize * 0.44;

      dataDots.push(
        <circle
          key={`dot-${r}-${c}`}
          cx={cx}
          cy={cy}
          r={dotRadius}
          fill="currentColor"
          className="sbui-qr-dot"
        />
      );
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

          {/* Liquid Rounded Data Modules */}
          <g className="sbui-qr-modules" fill="currentColor">
            {dataDots}
          </g>
        </svg>

        {/* Central Logo Badge */}
        {logo && (
          <div
            className="sbui-qr-logo-badge"
            style={{
              width: badgeDiameter,
              height: badgeDiameter,
            }}
          >
            {logo === "UNVI" || logo === "UNVIDark" || logo === "UNVILight" ? (
              <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={UNVI_SVG_PATH} fill="currentColor" />
              </svg>
            ) : logo.startsWith("<svg") ? (
              <div dangerouslySetInnerHTML={{ __html: logo }} />
            ) : (
              <img src={logo} alt="Logo" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Aliases
export const LiquidQR = QRCode;
export default QRCode;

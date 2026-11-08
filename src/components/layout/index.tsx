// ============================================================================
// Layout Components: Row, Column, Card, Grid, Divider (sbuiSDK)
// ============================================================================

import React from "react";
import "./Layout.scss";

export interface RowProps {
  children?: React.ReactNode;
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = 12,
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  style,
}) => {
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;
  return (
    <div
      className={`sbui-row align-${align} justify-${justify} ${wrap ? "is-wrap" : ""} ${className}`.trim()}
      style={{ gap: gapValue, ...style }}
    >
      {children}
    </div>
  );
};

export interface ColumnProps {
  children?: React.ReactNode;
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  className?: string;
  style?: React.CSSProperties;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  gap = 12,
  align = "stretch",
  justify = "start",
  className = "",
  style,
}) => {
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;
  return (
    <div
      className={`sbui-column align-${align} justify-${justify} ${className}`.trim()}
      style={{ gap: gapValue, ...style }}
    >
      {children}
    </div>
  );
};

export interface CardProps {
  children?: React.ReactNode;
  header?: string;
  padding?: number | string;
  variant?: "default" | "elevated" | "outline" | "ghost";
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  padding = 20,
  variant = "default",
  className = "",
  style,
}) => {
  const padValue = typeof padding === "number" ? `${padding}px` : padding;
  return (
    <div
      className={`sbui-card variant-${variant} ${className}`.trim()}
      style={{ padding: padValue, ...style }}
    >
      {header && <div className="sbui-card-header">{header}</div>}
      {children}
    </div>
  );
};

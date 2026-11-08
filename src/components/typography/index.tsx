// ============================================================================
// Typography & Status Components (sbuiSDK)
// ============================================================================

import React from "react";
import "./Typography.css";

export interface TextProps {
  children?: React.ReactNode;
  content?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "code" | "muted";
  align?: "left" | "center" | "right";
  bold?: boolean;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  children,
  content,
  variant = "body",
  align = "left",
  bold = false,
  color,
  className = "",
  style,
}) => {
  const textContent = content ?? children;
  const classes = `sbui-text variant-${variant} align-${align} ${bold ? "is-bold" : ""} ${className}`.trim();

  const customStyle: React.CSSProperties = {
    ...style,
    ...(color ? { color } : {}),
  };

  switch (variant) {
    case "h1": return <h1 className={classes} style={customStyle}>{textContent}</h1>;
    case "h2": return <h2 className={classes} style={customStyle}>{textContent}</h2>;
    case "h3": return <h3 className={classes} style={customStyle}>{textContent}</h3>;
    case "h4": return <h4 className={classes} style={customStyle}>{textContent}</h4>;
    case "code": return <code className={classes} style={customStyle}>{textContent}</code>;
    case "caption": return <small className={classes} style={customStyle}>{textContent}</small>;
    default: return <p className={classes} style={customStyle}>{textContent}</p>;
  }
};

export interface BadgeProps {
  content?: string;
  children?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  content,
  children,
  variant = "primary",
  size = "md",
  className = "",
  style,
}) => {
  return (
    <span className={`sbui-badge variant-${variant} size-${size} ${className}`.trim()} style={style}>
      {content ?? children}
    </span>
  );
};

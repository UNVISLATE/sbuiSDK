// ============================================================================
// Dialog / Modal Component (sbuiSDK)
// ============================================================================

import React, { useEffect } from "react";
import "./Dialog.scss";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sbui-dialog-backdrop" onClick={onClose}>
      <div
        className={`sbui-dialog-card ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="sbui-dialog-close-btn"
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>

        <div className="sbui-dialog-header">
          <h3 className="sbui-dialog-title">{title}</h3>
          {description && <p className="sbui-dialog-desc">{description}</p>}
        </div>

        <div className="sbui-dialog-body">{children}</div>

        {footer && <div className="sbui-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Dialog;

// ============================================================================
// Custom Select / Dropdown Component (sbuiSDK)
// ============================================================================

import React, { useState, useRef, useEffect } from "react";
import "./Select.css";

export interface FormSelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface SelectProps {
  options: FormSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Выберите вариант...",
  className = "",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`sbui-select-wrapper ${className}`} style={style}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--sbui-fg-muted)",
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      )}

      <div
        className={`sbui-select-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="sbui-select-value">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span>{selectedOption?.label || placeholder}</span>
        </div>
        <div className={`sbui-select-chevron ${isOpen ? "is-open" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="sbui-select-popover">
          {options.map((opt) => {
            const isSelected = opt.value === (value || selectedOption?.value);
            return (
              <div
                key={opt.value}
                className={`sbui-select-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {opt.icon && <span>{opt.icon}</span>}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <span className="sbui-option-check">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;

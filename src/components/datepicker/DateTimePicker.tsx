// ============================================================================
// DateTimePicker: Fluid Animated Date & Time Picker (sbuiSDK)
// ============================================================================

import React, { useState, useRef, useEffect, useMemo } from "react";
import "./DateTimePicker.scss";

export interface DateTimePickerProps {
  value?: string | Date;
  onChange?: (date: string) => void;
  mode?: "date" | "time" | "datetime";
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  showPresets?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode = "datetime",
  label,
  placeholder = "Выберите дату и время...",
  minDate,
  maxDate,
  showPresets = true,
  className = "",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = useMemo(() => (value ? new Date(value) : new Date()), [value]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [hours, setHours] = useState<number>(initialDate.getHours());
  const [minutes, setMinutes] = useState<number>(initialDate.getMinutes());

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Navigate months
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    // Adjust to Monday as 0
    const startOffset = (firstDay + 6) % 7;
    const daysInCurrent = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const days: { date: Date; isOtherMonth: boolean; dayNum: number }[] = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(viewYear, viewMonth - 1, daysInPrev - i),
        isOtherMonth: true,
        dayNum: daysInPrev - i,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrent; d++) {
      days.push({
        date: new Date(viewYear, viewMonth, d),
        isOtherMonth: false,
        dayNum: d,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(viewYear, viewMonth + 1, d),
        isOtherMonth: true,
        dayNum: d,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handleSelectDay = (d: Date) => {
    const newDate = new Date(d);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
    onChange?.(newDate.toISOString());
    if (mode === "date") {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (selectedDate) {
      const updated = new Date(selectedDate);
      updated.setHours(newHours);
      updated.setMinutes(newMinutes);
      setSelectedDate(updated);
      onChange?.(updated.toISOString());
    }
  };

  const applyPreset = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    target.setHours(hours);
    target.setMinutes(minutes);
    setSelectedDate(target);
    setViewMonth(target.getMonth());
    setViewYear(target.getFullYear());
    onChange?.(target.toISOString());
    if (mode === "date") setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!selectedDate) return placeholder;
    const pad = (n: number) => String(n).padStart(2, "0");
    const dStr = `${pad(selectedDate.getDate())}.${pad(selectedDate.getMonth() + 1)}.${selectedDate.getFullYear()}`;
    if (mode === "date") return dStr;
    const tStr = `${pad(selectedDate.getHours())}:${pad(selectedDate.getMinutes())}`;
    if (mode === "time") return tStr;
    return `${dStr} ${tStr}`;
  };

  const isToday = (d: Date) => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const isSelected = (d: Date) => {
    if (!selectedDate) return false;
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className={`sbui-datepicker-wrapper ${className}`} style={style}>
      {label && <label className="sbui-label" style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "var(--sbui-fg-muted)" }}>{label}</label>}

      <div
        className={`sbui-datepicker-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatDisplay()}</span>
        <div className="sbui-datepicker-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="sbui-datepicker-dropdown">
          {/* Header */}
          <div className="sbui-datepicker-header">
            <span className="sbui-datepicker-month-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="sbui-datepicker-nav-buttons">
              <button type="button" onClick={prevMonth} aria-label="Предыдущий месяц">
                &lsaquo;
              </button>
              <button type="button" onClick={nextMonth} aria-label="Следующий месяц">
                &rsaquo;
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="sbui-datepicker-weekdays">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="sbui-datepicker-grid">
            {calendarDays.map((cell, idx) => {
              const selected = isSelected(cell.date);
              const today = isToday(cell.date);
              const disabled =
                (minDate && cell.date < minDate) || (maxDate && cell.date > maxDate);

              return (
                <button
                  type="button"
                  key={idx}
                  disabled={disabled}
                  onClick={() => handleSelectDay(cell.date)}
                  className={`sbui-datepicker-cell ${cell.isOtherMonth ? "is-other-month" : ""} ${today ? "is-today" : ""} ${selected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}
                >
                  {cell.dayNum}
                </button>
              );
            })}
          </div>

          {/* Time Picker Section */}
          {(mode === "datetime" || mode === "time") && (
            <div className="sbui-datepicker-time-section">
              <span className="sbui-time-label">Время</span>
              <div className="sbui-time-inputs">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={String(hours).padStart(2, "0")}
                  onChange={(e) => {
                    const h = Math.max(0, Math.min(23, Number(e.target.value) || 0));
                    handleTimeChange(h, minutes);
                  }}
                />
                <span>:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={String(minutes).padStart(2, "0")}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                    handleTimeChange(hours, m);
                  }}
                />
              </div>
            </div>
          )}

          {/* Presets */}
          {showPresets && (
            <div className="sbui-datepicker-presets">
              <button type="button" onClick={() => applyPreset(0)}>Сегодня</button>
              <button type="button" onClick={() => applyPreset(1)}>Завтра</button>
              <button type="button" onClick={() => applyPreset(7)}>+7 дней</button>
              <button type="button" onClick={() => applyPreset(30)}>+30 дней</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

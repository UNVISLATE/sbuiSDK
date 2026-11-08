// ============================================================================
// SchemaRenderer: Server-Driven UI AST Recursive Renderer (sbuiSDK)
// ============================================================================

import React from "react";
import { SchemaNode } from "../../types/schema";
import { QRCode } from "../qr";
import { DateTimePicker } from "../datepicker/DateTimePicker";
import { Row, Column, Card } from "../layout";
import { Text, Badge } from "../typography";
import { Select } from "../form/Select";

export interface SchemaRendererProps {
  node: SchemaNode;
  formData?: Record<string, unknown>;
  onFormChange?: (field: string, value: unknown) => void;
  onAction?: (action: string, payload?: unknown) => void;
}

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  node,
  formData = {},
  onFormChange,
  onAction,
}) => {
  if (!node || typeof node !== "object") return null;

  // 1. Evaluate depends_on condition
  if (node.depends_on) {
    const parentVal = formData[node.depends_on.field];
    if (node.depends_on.equals !== undefined && String(parentVal ?? "") !== String(node.depends_on.equals)) {
      return null;
    }
    if (node.depends_on.in !== undefined && !node.depends_on.in.some((item) => String(item) === String(parentVal))) {
      return null;
    }
  }

  // 2. Render matching component
  switch (node.type) {
    case "row":
      return (
        <Row
          gap={node.gap}
          align={node.align}
          justify={node.justify}
          wrap={node.wrap}
          className={node.className}
          style={node.style}
        >
          {(node.children || []).map((child, idx) => (
            <SchemaRenderer
              key={child.id || idx}
              node={child}
              formData={formData}
              onFormChange={onFormChange}
              onAction={onAction}
            />
          ))}
        </Row>
      );

    case "column":
      return (
        <Column
          gap={node.gap}
          align={node.align}
          justify={node.justify}
          className={node.className}
          style={node.style}
        >
          {(node.children || []).map((child, idx) => (
            <SchemaRenderer
              key={child.id || idx}
              node={child}
              formData={formData}
              onFormChange={onFormChange}
              onAction={onAction}
            />
          ))}
        </Column>
      );

    case "card":
      return (
        <Card
          header={node.header}
          padding={node.padding}
          variant={node.variant}
          className={node.className}
          style={node.style}
        >
          {(node.children || []).map((child, idx) => (
            <SchemaRenderer
              key={child.id || idx}
              node={child}
              formData={formData}
              onFormChange={onFormChange}
              onAction={onAction}
            />
          ))}
        </Card>
      );

    case "grid": {
      const gridCols =
        typeof node.columns === "number"
          ? `repeat(${node.columns}, minmax(0, 1fr))`
          : node.columns || "repeat(2, minmax(0, 1fr))";
      const gapVal = typeof node.gap === "number" ? `${node.gap}px` : node.gap || "12px";
      return (
        <div
          className={`sbui-grid ${node.className || ""}`.trim()}
          style={{ display: "grid", gridTemplateColumns: gridCols, gap: gapVal, ...node.style }}
        >
          {(node.children || []).map((child, idx) => (
            <SchemaRenderer
              key={child.id || idx}
              node={child}
              formData={formData}
              onFormChange={onFormChange}
              onAction={onAction}
            />
          ))}
        </div>
      );
    }

    case "divider":
      return (
        <div
          className={`sbui-divider ${node.orientation || "horizontal"} ${node.className || ""}`.trim()}
          style={node.style}
        />
      );

    case "space": {
      const sizeVal = typeof node.size === "number" ? `${node.size}px` : node.size || "16px";
      return <div style={{ height: sizeVal, width: sizeVal }} />;
    }

    case "text":
      return (
        <Text
          content={node.content}
          variant={node.variant}
          align={node.align}
          bold={node.bold}
          color={node.color}
          className={node.className}
          style={node.style}
        />
      );

    case "badge":
      return (
        <Badge
          content={node.content}
          variant={node.variant}
          size={node.size}
          className={node.className}
          style={node.style}
        />
      );

    case "alert":
      return (
        <div
          className={`sbui-alert sbui-alert-${(node as any).variant || "info"} ${node.className || ""}`.trim()}
          style={{
            padding: "12px 14px",
            borderRadius: "10px",
            fontSize: "13px",
            lineHeight: "1.4",
            background: "rgba(0, 144, 128, 0.08)",
            border: "1px solid rgba(0, 144, 128, 0.3)",
            color: "#e4e4e7",
            ...node.style,
          }}
        >
          {(node as any).content || (node as any).title}
        </div>
      );

    case "qr":
      return (
        <QRCode
          value={node.value}
          size={node.size}
          logo={node.logo}
          logoSize={node.logoSize}
          plateRadius={node.plateRadius}
          color={node.color}
          backgroundColor={node.backgroundColor}
          className={node.className}
          style={node.style}
        />
      );

    case "datepicker":
      return (
        <DateTimePicker
          value={(formData[node.name] as string) || (node.defaultValue as string)}
          onChange={(val) => onFormChange?.(node.name, val)}
          label={node.label}
          mode={node.mode as "date" | "time" | "datetime"}
          minDate={node.minDate ? new Date(node.minDate) : undefined}
          maxDate={node.maxDate ? new Date(node.maxDate) : undefined}
          showPresets={node.showPresets}
          className={node.className}
          style={node.style}
        />
      );

    case "input":
    case "password": {
      const fieldVal = (formData[node.name] as string) ?? node.defaultValue ?? "";
      return (
        <div className={`sbui-input-group ${node.className || ""}`.trim()} style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", ...node.style }}>
          {node.label && (
            <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--sbui-fg-muted, #a1a1aa)" }}>
              {node.label}
              {node.required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
            </label>
          )}
          <input
            type={node.type === "password" ? "password" : "text"}
            value={fieldVal}
            placeholder={node.placeholder}
            onChange={(e) => onFormChange?.(node.name, e.target.value)}
            style={{
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "10px",
              background: "var(--sbui-card-bg, #141417)",
              border: "1px solid var(--sbui-border, #27272a)",
              color: "var(--sbui-fg, #f4f4f5)",
              outline: "none",
              transition: "border-color 0.15s ease",
            }}
          />
          {node.help && <span style={{ fontSize: "11px", color: "var(--sbui-fg-subtle, #71717a)" }}>{node.help}</span>}
        </div>
      );
    }

    case "number": {
      const numVal = (formData[(node as any).name] as string | number) ?? (node as any).defaultValue ?? "";
      return (
        <div className={`sbui-input-group ${node.className || ""}`.trim()} style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", ...node.style }}>
          {(node as any).label && (
            <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--sbui-fg-muted, #a1a1aa)" }}>
              {(node as any).label}
              {(node as any).required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
            </label>
          )}
          <input
            type="number"
            value={numVal}
            min={(node as any).min}
            max={(node as any).max}
            step={(node as any).step}
            placeholder={(node as any).placeholder}
            onChange={(e) => onFormChange?.((node as any).name, e.target.value ? Number(e.target.value) : "")}
            style={{
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "10px",
              background: "var(--sbui-card-bg, #141417)",
              border: "1px solid var(--sbui-border, #27272a)",
              color: "var(--sbui-fg, #f4f4f5)",
              outline: "none",
            }}
          />
          {(node as any).help && <span style={{ fontSize: "11px", color: "var(--sbui-fg-subtle, #71717a)" }}>{(node as any).help}</span>}
        </div>
      );
    }

    case "toggle": {
      const isChecked = Boolean(formData[node.name] ?? node.default ?? false);
      return (
        <div className={`sbui-toggle-group ${node.className || ""}`.trim()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", ...node.style }}>
          <div>
            {node.label && <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--sbui-fg, #f4f4f5)" }}>{node.label}</div>}
            {node.help && <div style={{ fontSize: "11px", color: "var(--sbui-fg-subtle, #71717a)" }}>{node.help}</div>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={() => onFormChange?.(node.name, !isChecked)}
            style={{
              width: "40px",
              height: "22px",
              borderRadius: "9999px",
              background: isChecked ? "var(--sbui-primary, #009080)" : "var(--sbui-surface-elevated, #27272a)",
              border: "none",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#ffffff",
                position: "absolute",
                top: "3px",
                left: isChecked ? "21px" : "3px",
                transition: "left 0.2s ease",
              }}
            />
          </button>
        </div>
      );
    }

    case "select": {
      const selectVal = String(formData[node.name] ?? node.default ?? "");
      const opts = (node.options || []).map((o) => ({
        value: String(o.value),
        label: o.label,
        description: o.description,
      }));
      return (
        <Select
          options={opts}
          value={selectVal}
          onChange={(val) => onFormChange?.(node.name, val)}
          label={node.label}
          placeholder={node.placeholder}
          className={node.className}
          style={node.style}
        />
      );
    }

    case "button":
      return (
        <button
          type="button"
          className={`sbui-btn variant-${node.variant || "primary"} ${node.className || ""}`.trim()}
          style={node.style}
          onClick={() => onAction?.(node.action || "submit", { url: node.url, dialogId: node.dialogId })}
        >
          {node.label}
        </button>
      );

    default:
      return null;
  }
};

/**
 * ManifestLivePreview: Interactive preview container for Server-Driven UI manifests.
 * Accepts either:
 * - A full ScriptManifest object ({ client_order_form, settings_form, layout, ... })
 * - A SchemaNode tree
 * - A JSON string
 */
export const ManifestLivePreview: React.FC<{
  manifest: unknown;
  previewType?: "client_order_form" | "settings_form" | "layout";
  className?: string;
}> = ({ manifest, previewType = "client_order_form", className = "" }) => {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({});

  const parsed = React.useMemo(() => {
    if (!manifest) return null;
    if (typeof manifest === "string") {
      try {
        return JSON.parse(manifest);
      } catch {
        return null;
      }
    }
    return manifest as Record<string, any>;
  }, [manifest]);

  if (!parsed) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "var(--sbui-fg-muted, #a1a1aa)", fontSize: "13px" }}>
        Манифест пуст или содержит некорректный JSON
      </div>
    );
  }

  // If node has 'type' property directly, render it as SchemaNode
  if (parsed.type && typeof parsed.type === "string") {
    return (
      <div className={`sbui-live-preview ${className}`} style={{ padding: "16px" }}>
        <SchemaRenderer
          node={parsed as SchemaNode}
          formData={formData}
          onFormChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
        />
      </div>
    );
  }

  // If manifest has layout
  if (parsed.layout && typeof parsed.layout === "object") {
    return (
      <div className={`sbui-live-preview ${className}`} style={{ padding: "16px" }}>
        <SchemaRenderer
          node={parsed.layout}
          formData={formData}
          onFormChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
        />
      </div>
    );
  }

  // If manifest defines form fields (client_order_form or settings_form)
  const fields = (previewType === "settings_form" ? parsed.settings_form : parsed.client_order_form) || parsed.client_order_form || parsed.settings_form;

  if (Array.isArray(fields) && fields.length > 0) {
    return (
      <div className={`sbui-live-preview ${className}`} style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
        {parsed.name && (
          <div style={{ borderBottom: "1px solid var(--sbui-border, #27272a)", paddingBottom: "12px" }}>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--sbui-fg, #f4f4f5)" }}>{parsed.name}</div>
            {parsed.description && <div style={{ fontSize: "12px", color: "var(--sbui-fg-muted, #a1a1aa)", marginTop: "4px" }}>{parsed.description}</div>}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {fields.map((f: any, idx: number) => {
            const fieldNode: any = {
              id: f.id || `f_${idx}`,
              name: f.id,
              label: f.label || f.id,
              placeholder: f.placeholder,
              help: f.description,
              required: f.required,
              defaultValue: f.default,
              depends_on: f.depends_on,
            };

            if (f.type === "select") {
              fieldNode.type = "select";
              fieldNode.options = (f.options || []).map((o: any) => ({
                value: o.value,
                label: o.label + (o.price_delta ? ` (+${o.price_delta})` : ""),
              }));
            } else if (f.type === "toggle" || f.type === "checkbox") {
              fieldNode.type = "toggle";
            } else if (f.type === "number" || f.type === "range") {
              fieldNode.type = "number";
              fieldNode.min = f.min;
              fieldNode.max = f.max;
              fieldNode.step = f.step;
            } else if (f.type === "datetime") {
              fieldNode.type = "datepicker";
            } else {
              fieldNode.type = f.type === "password" ? "password" : "input";
            }

            return (
              <SchemaRenderer
                key={fieldNode.id}
                node={fieldNode}
                formData={formData}
                onFormChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", textAlign: "center", color: "var(--sbui-fg-muted, #a1a1aa)", fontSize: "13px" }}>
      В манифесте нет полей для отображения ({previewType})
    </div>
  );
};

export default SchemaRenderer;

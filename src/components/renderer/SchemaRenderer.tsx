// ============================================================================
// SchemaRenderer: Server-Driven UI AST Recursive Renderer (sbuiSDK)
// ============================================================================

import React from "react";
import { SchemaNode } from "../../types/schema";
import { QRCode } from "../qr";
import { DateTimePicker } from "../datepicker/DateTimePicker";
import { Row, Column, Card } from "../layout";
import { Text, Badge } from "../typography";

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
  // 1. Evaluate depends_on condition
  if (node.depends_on) {
    const parentVal = formData[node.depends_on.field];
    if (node.depends_on.equals !== undefined && parentVal !== node.depends_on.equals) {
      return null;
    }
    if (node.depends_on.in !== undefined && !node.depends_on.in.includes(parentVal)) {
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
          {node.children.map((child, idx) => (
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
          {node.children.map((child, idx) => (
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
          {node.children.map((child, idx) => (
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
          value={(formData[node.name] as string) || node.defaultValue as string}
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

export default SchemaRenderer;

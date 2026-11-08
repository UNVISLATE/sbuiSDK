// ============================================================================
// Server-Driven UI AST Schema Definitions (sbuiSDK)
// ============================================================================

export type ComponentType =
  // Layout Primitives
  | "row"
  | "column"
  | "card"
  | "grid"
  | "divider"
  | "space"
  // Typography & Status
  | "text"
  | "badge"
  | "alert"
  // Specialized Widgets
  | "qr"
  | "datepicker"
  // Form Controls
  | "input"
  | "password"
  | "toggle"
  | "select"
  | "number"
  | "button"
  // Interactive Containers
  | "dialog";

export interface BaseNode {
  type: ComponentType;
  id?: string;
  className?: string;
  style?: Record<string, string | number>;
  depends_on?: {
    field: string;
    equals?: unknown;
    in?: unknown[];
  };
}

// Layout Nodes
export interface RowNode extends BaseNode {
  type: "row";
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  children: SchemaNode[];
}

export interface ColumnNode extends BaseNode {
  type: "column";
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  children: SchemaNode[];
}

export interface CardNode extends BaseNode {
  type: "card";
  variant?: "default" | "elevated" | "outline" | "ghost";
  padding?: number | string;
  header?: string;
  footer?: SchemaNode;
  children: SchemaNode[];
}

export interface GridNode extends BaseNode {
  type: "grid";
  columns?: number | string;
  gap?: number | string;
  children: SchemaNode[];
}

export interface DividerNode extends BaseNode {
  type: "divider";
  spacing?: number | string;
  orientation?: "horizontal" | "vertical";
}

export interface SpaceNode extends BaseNode {
  type: "space";
  size?: number | string;
}

// Typography Nodes
export interface TextNode extends BaseNode {
  type: "text";
  content: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "code" | "muted";
  align?: "left" | "center" | "right";
  bold?: boolean;
  color?: string;
}

export interface BadgeNode extends BaseNode {
  type: "badge";
  content: string;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
}

// QR Widget Node
export interface QRNode extends BaseNode {
  type: "qr";
  value: string;
  size?: number;
  logo?: "UNVI" | "UNVIDark" | "UNVILight" | string;
  logoSize?: number;
  plateRadius?: number;
  style?: "liquid" | "rounded" | "classic";
  errorCorrection?: "L" | "M" | "Q" | "H";
  color?: string;
  backgroundColor?: string;
}

// DatePicker Node
export interface DatePickerNode extends BaseNode {
  type: "datepicker";
  name: string;
  label?: string;
  mode?: "date" | "time" | "datetime" | "range";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string | [string, string];
  showPresets?: boolean;
  required?: boolean;
  help?: string;
}

// Form Control Nodes
export interface InputNode extends BaseNode {
  type: "input" | "password";
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  help?: string;
  validation?: {
    regex?: string;
    regex_error?: string;
    min_length?: number;
    max_length?: number;
  };
}

export interface ToggleNode extends BaseNode {
  type: "toggle";
  name: string;
  label?: string;
  default?: boolean;
  help?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
}

export interface SelectNode extends BaseNode {
  type: "select";
  name: string;
  label?: string;
  options: SelectOption[];
  default?: string | number;
  placeholder?: string;
  help?: string;
}

export interface ButtonNode extends BaseNode {
  type: "button";
  label: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  action?: "submit" | "reset" | "link" | "dialog_open";
  url?: string;
  dialogId?: string;
}

// Dialog Node
export interface DialogNode extends BaseNode {
  type: "dialog";
  dialogId: string;
  title: string;
  description?: string;
  trigger?: SchemaNode;
  children: SchemaNode[];
  actions?: SchemaNode[];
}

export type SchemaNode =
  | RowNode
  | ColumnNode
  | CardNode
  | GridNode
  | DividerNode
  | SpaceNode
  | TextNode
  | BadgeNode
  | QRNode
  | DatePickerNode
  | InputNode
  | ToggleNode
  | SelectNode
  | ButtonNode
  | DialogNode;

export interface RootManifestSchema {
  version: "1.0";
  title?: string;
  layout: SchemaNode;
}

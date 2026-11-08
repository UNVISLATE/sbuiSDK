# @unvislate/sbui-sdk

> **Server-Driven UI SDK, Liquid Rounded Vector QR Generator, and Fluid Date/Time Picker for SaviorBill & Modern Web Frontends.**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)

---

## Features

- **Liquid Rounded Vector QR Code Generator (`QRCode`):**
  - Smooth connected data dots (`squircle modules`) with rounded corners instead of harsh square pixels.
  - Styled rounded finder patterns (outer squircle frame + inner squircle eye).
  - Safe central cutout area with backdrop disc for vector logos (`UNVIDark.svg`, `UNVILight.svg`, or custom SVG/PNG).
  - Pure vector SVG output (scalable to any resolution) and Canvas/PNG export.
  - Zero external dependencies for QR matrix generation.

- **Fluid Animated Date & Time Picker (`DateTimePicker`):**
  - Pure SCSS styling with hardware-accelerated micro-animations (`cubic-bezier` spring curves).
  - Quick presets: "Сегодня", "Завтра", "+7 дней", "+30 дней".
  - Interactive hour & minute stepper (5-minute step).
  - Standard ISO 8601 string output.

- **Server-Driven UI Engine (`SchemaRenderer`):**
  - Declarative layout AST nodes: `row`, `column`, `card`, `grid`, `space`, `divider`.
  - Typography & status nodes: `text` (h1-h4, body, caption, code), `badge`.
  - Conditional visibility (`depends_on: { field: "...", equals: true }`).
  - Seamless form integration with zero client-side rebuilds.

- **Design System & Theming:**
  - Full CSS Variables & SCSS tokens (`--sbui-*`) for effortless theme overrides.
  - Native dark (Stealth) and light theme support.

---

## Installation

```bash
# npm
npm install @unvislate/sbui-sdk

# pnpm
pnpm add @unvislate/sbui-sdk

# yarn
yarn add @unvislate/sbui-sdk
```

Or reference locally in offline monorepos:
```json
{
  "dependencies": {
    "@unvislate/sbui-sdk": "file:../sbuiSDK"
  }
}
```

---

## Quick Start

### 1. Liquid Rounded QR Code

```tsx
import React from "react";
import { QRCode } from "@unvislate/sbui-sdk";
import "@unvislate/sbui-sdk/styles.css";

export const PaymentCard = () => {
  return (
    <div className="card">
      <QRCode
        value="https://saviorbill.dev"
        size={240}
        plateRadius={28}
        logo="UNVIDark"
      />
    </div>
  );
};
```

### 2. DateTime Picker

```tsx
import React, { useState } from "react";
import { DateTimePicker } from "@unvislate/sbui-sdk";

export const ScheduleForm = () => {
  const [date, setDate] = useState<string>("");

  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      mode="datetime"
      label="Дата активации услуги"
    />
  );
};
```

### 3. Server-Driven UI (JSON Manifest)

```tsx
import React from "react";
import { SchemaRenderer, SchemaNode } from "@unvislate/sbui-sdk";

const manifest: SchemaNode = {
  type: "card",
  header: "Детали заказа",
  children: [
    {
      type: "row",
      gap: 16,
      align: "center",
      children: [
        { type: "qr", value: "https://saviorbill.dev", size: 160 },
        {
          type: "column",
          gap: 6,
          children: [
            { type: "text", variant: "h3", content: "WireGuard VPN" },
            { type: "badge", variant: "success", content: "Активен" }
          ]
        }
      ]
    }
  ]
};

export const OrderView = () => <SchemaRenderer node={manifest} />;
```

---

## Author & License

- **Author:** [UNVISLATE](https://github.com/UNVISLATE)
- **License:** Apache License 2.0 (see [LICENSE](LICENSE))

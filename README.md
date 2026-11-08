# sbuiSDK (`@unvislate/sbui-sdk`)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)

UI component library and Server-Driven UI (SDUI) engine built for [**SaviorBill**](https://github.com/UNVISLATE/SaviorBill) — a modern self-hosted billing, store and subscription platform.

`sbuiSDK` provides standalone UI components and a declarative schema renderer for dialog-based storefronts, checkout flows, and dynamic service forms without requiring frontend rebuilds.

---

## What's Included

- **Liquid Connected QR (`QRCode`):**
  Smooth rounded capsule modules with 1:1:3:1:1 squircle finder patterns, safe central logo disc, and Level H error correction (100% camera scannable).
- **Interactive Form Controls:**
  Hardware-accelerated `DateTimePicker` with quick presets, and reactive custom `Select` popover dropdowns.
- **Server-Driven UI (`SchemaRenderer`):**
  Renders declarative JSON/Lua UI layouts (`card`, `row`, `column`, `grid`, `badge`, `text`) driven directly by backend manifests.
- **Dark Stealth Theme:**
  Designed with SaviorBill's deep dark stealth palette (`#09090b` / `#141417`) and signature teal accents (`#009080`), customizable via CSS variables.

---

## Installation

```bash
npm install @unvislate/sbui-sdk
```

Or link locally in offline monorepos:
```json
{
  "dependencies": {
    "@unvislate/sbui-sdk": "file:../vendor/sbuiSDK"
  }
}
```

---

## Quick Example

### Liquid QR Code

```tsx
import React from "react";
import { QRCode } from "@unvislate/sbui-sdk";
import "@unvislate/sbui-sdk/styles.css";

export const SubscriptionCard = () => (
  <QRCode
    value="https://sub.saviorvpn.net/api/v1/sub/sbu_7f9a2d81c0e3b4?token=sec_live_9a8f"
    size={240}
    plateRadius={28}
    logo="UNVIDark"
  />
);
```

### Server-Driven UI Manifest

```tsx
import React from "react";
import { SchemaRenderer, SchemaNode } from "@unvislate/sbui-sdk";

const orderManifest: SchemaNode = {
  type: "card",
  header: "Подписка Xray Core",
  children: [
    { type: "text", variant: "body", content: "Subscription URL для импорта в Hiddify и Sing-box" },
    { type: "badge", variant: "success", content: "Активна" }
  ]
};

export const OrderView = () => <SchemaRenderer node={orderManifest} />;
```

---

## Used in SaviorBill

This SDK is developed and maintained as part of the [SaviorBill](https://github.com/UNVISLATE/SaviorBill) ecosystem. It is included as a git submodule (`vendor/sbuiSDK`) to guarantee 100% offline, self-contained builds of the admin UI and storefront.

---

## License

[Apache License 2.0](LICENSE) © 2026 [UNVISLATE](https://github.com/UNVISLATE)

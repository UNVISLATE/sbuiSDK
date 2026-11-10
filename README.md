# sbuiSDK

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)

UI component library and Server-Driven UI (SDUI) renderer built for the [**SaviorBill**](https://github.com/UNVISLATE/SaviorBill) ecosystem (`adminui` and [`SBPersonalAccountClient`](https://github.com/UNVISLATE/SBPersonalAccountClient)).

---

## Included Modules

- **Liquid Vector QR (`QRCode`):** SVG QR renderer with rounded capsule modules, squircle finder patterns, optional central logo plate, and Level H error correction.
- **Form Controls (`DateTimePicker`, `Select`):** date/time picker with presets and custom popover select controls.
- **Server-Driven UI (`SchemaRenderer`, `ManifestLivePreview`):** declarative renderer for JSON/Lua UI manifests (`card`, `row`, `column`, `grid`, `text`, `badge`, `button`, `copy_field`, `qr`, `code`, `markdown`, `divider`, `spacer`) driven directly by backend service manifests.
- **Layout, Typography & Dialog Primitives:** composable containers (`Box`, `Stack`, `Card`, `Grid`), `Modal`, and `Text` with CSS-variable theming.

---

## Usage in SaviorBill Workspace

`sbuiSDK` is wired into both SaviorBill repositories (`SaviorBill/vendor/sbuiSDK` and `SBPersonalAccountClient/vendor/sbuiSDK`) as a git submodule so Vite/TypeScript resolve it directly from source without private registries or extra build steps.

When cloning host repositories, fetch submodules recursively:

```bash
git clone --recurse-submodules https://github.com/UNVISLATE/SaviorBill.git
```

### Example: Liquid QR Code

```tsx
import QRCode from "../vendor/sbuiSDK/src/components/qr";

export function SubscriptionQR({ url }: { url: string }) {
  return (
    <QRCode
      value={url}
      size={220}
      plateRadius={24}
      logo="UNVIDark"
      theme="brand"
    />
  );
}
```

### Example: Server-Driven UI Manifest

```tsx
import { SchemaRenderer, type SchemaNode } from "../vendor/sbuiSDK/src";

const manifest: SchemaNode = {
  type: "card",
  children: [
    { type: "badge", variant: "success", content: "VLESS Reality" },
    { type: "copy_field", label: "Subscription URL", value: "{{public_data.subscription_url}}" },
  ],
};

export function ServiceView({ data }: { data: Record<string, unknown> }) {
  return <SchemaRenderer node={manifest} data={data} />;
}
```

---

## Development

```bash
npm ci
npm run typecheck
npm run build
```

---

## License

Licensed under the **Apache License 2.0** — see [`LICENSE`](LICENSE).

Copyright © 2026 [UNVISLATE](https://github.com/UNVISLATE)

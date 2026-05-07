# TailPrint Astro Samples — Design Spec

**Date:** 2026-05-07
**Status:** Approved
**Version:** 1.0.0

---

## 1. Goal

Build static preview samples for the TailPrint design system at `samples/tailprint/` using Astro. Output is pure static HTML/CSS with one minimal inline JS theme script — no framework dependencies.

---

## 2. Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Astro (latest stable) | Static output, zero JS by default |
| Styling | Tailwind CSS 3.x via `@astrojs/tailwind` | Required by TailPrint |
| Language | TypeScript | Type-safe mock data |
| Fonts | `@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono` | No Google Fonts network call |
| Interactivity | Inline `<script>` only | Theme switcher, Modal toggle — no framework island |
| Output | `astro build` → `dist/` static HTML | Host anywhere |

---

## 3. Project Structure

```
samples/tailprint/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   └── images/               ← picsum photos saved locally
└── src/
    ├── layouts/
    │   └── Shell.astro        ← sidebar + header + main slot, theme init script
    ├── components/
    │   └── ui/
    │       ├── Badge.astro
    │       ├── Button.astro
    │       ├── Callout.astro
    │       ├── Card.astro
    │       ├── Input.astro
    │       ├── Modal.astro
    │       ├── ProgressBar.astro
    │       ├── Select.astro
    │       ├── Sidebar.astro
    │       ├── Sparkline.astro
    │       ├── StatBlock.astro
    │       ├── Table.astro
    │       ├── Tabs.astro
    │       ├── Toggle.astro
    │       └── TopHeader.astro
    ├── data/
    │   ├── iot-nodes.ts
    │   ├── inventory.ts
    │   ├── finance.ts
    │   ├── invoices.ts
    │   └── warehouse.ts
    ├── lib/
    │   └── theme-init.ts      ← anti-flash script string
    └── pages/
        ├── index.astro        ← Dashboard
        ├── iot.astro
        ├── inventory.astro
        ├── finance.astro
        ├── warehouse.astro
        ├── invoice.astro
        └── settings.astro
```

---

## 4. Shell Layout

`Shell.astro` owns all global concerns:

```
<head>
  ├── Font imports (@fontsource)
  ├── Tailwind base
  └── <script is:inline> → reads localStorage → sets html[data-theme, data-tenant] before paint

<body class="flex h-screen bg-tp-bg font-tp-sans">
  ├── <Sidebar activePage={activePage} />
  └── <div class="flex-1 flex flex-col overflow-hidden">
      ├── <TopHeader title={title} />
      └── <main class="flex-1 overflow-auto p-4">
              <slot />
          </main>
```

**Props:** `title: string`, `activePage: string`

---

## 5. Theme System

### Anti-Flash Script (Shell.astro `<head>`)

```js
// runs synchronously before body renders
const t = localStorage.getItem('tp-theme');
const n = localStorage.getItem('tp-tenant');
if (t) document.documentElement.dataset.theme = t;
if (n) document.documentElement.dataset.tenant = n;
```

### TopHeader Theme Switcher

Two `<select>` elements in TopHeader:
- **Theme:** `Light` / `Dark` → sets `html.dataset.theme`, writes `localStorage.setItem('tp-theme', value)`
- **Tenant:** `AcmeCorp` / `NovaTech` → sets `html.dataset.tenant`, writes `localStorage.setItem('tp-tenant', value)`

Inline `onchange` handlers — no separate script file needed.

---

## 6. Pages

| Route | File | Key TailPrint Components | Data Source |
|-------|------|--------------------------|-------------|
| `/` | `index.astro` | StatBlock ×4, Card grid, Callout, Badge, Sparkline | Aggregated |
| `/iot` | `iot.astro` | Table (48 rows), Badge, Toggle, ProgressBar, Callout | `iot-nodes.ts` |
| `/inventory` | `inventory.astro` | Table (200 SKUs), Input, Select, Badge | `inventory.ts` |
| `/finance` | `finance.astro` | Table (60 entries), Tabs, Breadcrumb, Badge | `finance.ts` |
| `/warehouse` | `warehouse.astro` | Card grid (3 floors), ProgressBar, Badge, StatBlock | `warehouse.ts` |
| `/invoice` | `invoice.astro` | Table (30), Badge, Modal, Tabs | `invoices.ts` |
| `/settings` | `settings.astro` | Toggle, Input, Select, Card, theme switcher demo | Hardcoded |

---

## 7. Mock Data

| File | Records | Key Fields |
|------|---------|-----------|
| `iot-nodes.ts` | 48 nodes | id, warehouse, sensor type, status, temp, humidity, vibration, power, last_seen |
| `inventory.ts` | 200 SKUs | sku, name, qty, reorder_point, unit_cost, warehouse, zone, bin, category |
| `finance.ts` | 60 entries | date, description, cost_center, type, debit, credit, balance |
| `invoices.ts` | 30 invoices | id, client, amount, due_date, issued_date, status, line_items |
| `warehouse.ts` | 3 floors × 12 zones × 8 bins | floor, zone, bin, capacity, fill_pct, sku_count, status, last_activity |

**Tenants:** AcmeCorp (manufacturing, amber accent) · NovaTech (logistics, purple accent)

**Images:** picsum saved to `public/images/` — 10 avatars (32×32), 8 products (48×48), 3 warehouse thumbnails (200×120)

---

## 8. UI Components

All in `src/components/ui/` as `.astro` files — props-driven, zero client JS except Modal.

| Component | Props | Notes |
|-----------|-------|-------|
| Badge | `status: 'online'\|'offline'\|'warning'\|'error'` | Color from status |
| Button | `intent: 'primary'\|'default'`, `label: string` | h-7, shadow-tp-button |
| Callout | `intent: 'success'\|'danger'\|'warning'\|'info'`, `message: string` | Left border accent |
| Card | `label: string`, `slot` | shadow-tp-card, rounded-tp |
| Input | `placeholder?: string`, `value?: string` | h-[30px], shadow-tp-input |
| Modal | `id: string`, `title: string`, `slot` | Toggle via inline script, no framework |
| ProgressBar | `value: number` (0–100) | h-2, bg-tp-primary fill |
| Select | `options: {label,value}[]` | h-[30px], matches input height |
| Sparkline | `values: number[]` | CSS bar chart, no chart lib |
| StatBlock | `label: string`, `value: string`, `delta?: string`, `trend?: 'up'\|'down'` | Large mono number |
| Table | `columns: string[]`, `slot` (tbody rows) | border-collapse, sticky header |
| Tabs | `tabs: {label,href}[]`, `active: string` | Underline active, transition-none |
| Toggle | `id: string`, `label: string`, `checked?: boolean` | Binary on/off |

---

## 9. Density Target

- **25 rows × 8 columns** visible at 1080p without scroll
- Row height: `py-1` (not `py-3`)
- Cell font: `text-tp-base` (13px) + `font-tp-mono tabular-nums` for numeric
- Header height: `h-8`

---

## 10. Anti-Patterns (enforced)

- No `rounded-lg` anywhere — always `rounded-tp` (3px)
- No animation on sidebar nav — `transition-none`
- No `text-base` (16px) in cells — `text-tp-base` (13px)
- No BlueprintJS import
- No React/Vue/Svelte islands
- No chart library — sparklines via CSS only
- No `tabular-nums` omission on numeric columns

---

## 11. Build Output

```bash
cd samples/tailprint
npm run build    # → dist/ (pure static HTML)
npm run preview  # → local preview server
npm run dev      # → hot reload dev server
```

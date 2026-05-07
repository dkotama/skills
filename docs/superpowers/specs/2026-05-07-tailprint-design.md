# TailPrint Design System — Full Specification

**Date:** 2026-05-07  
**Status:** Approved  
**Version:** 1.0.0

---

## 1. What Is TailPrint

TailPrint is a Tailwind CSS design system that replicates the visual DNA of BlueprintJS — high-density, professional, industrial aesthetic — without any BlueprintJS dependency. Target audience: professional ERP, IoT monitoring, accounting, and warehouse management interfaces.

**Core aesthetic pillars:**
- 3px corner radius (never `rounded-lg`)
- Inset box shadows for inputs, buttons, cards
- Compact vertical rhythm (28–30px control height)
- Muted Blueprint color palette
- Tabular numerals for all data cells
- Zero animation / `transition-none` on nav items

---

## 2. Repository Structure

```
tailprint/
├── design-guideline/               ← AI-consumable design system docs (framework-agnostic)
│   ├── SKILLS.md                   ← AI entry point: full system index + current version
│   ├── CHANGELOG.md
│   ├── version.json
│   ├── 00-overview.md
│   ├── 01-tokens.md
│   ├── 02-typography.md
│   ├── 03-theming.md
│   ├── 04-layout.md
│   └── components/
│       ├── table.md
│       ├── sidebar.md
│       ├── button.md
│       ├── callout.md
│       ├── input.md
│       ├── select.md
│       ├── badge.md
│       ├── card.md
│       ├── stat-block.md
│       ├── modal.md
│       ├── tabs.md
│       ├── breadcrumb.md
│       ├── checkbox.md
│       ├── toggle.md
│       ├── progress-bar.md
│       ├── skeleton.md
│       ├── timeline.md
│       ├── tooltip.md
│       ├── top-header.md
│       └── sparkline-hint.md
│
├── samples/                        ← Next.js app (human reference only)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── public/
│   │   └── images/                 ← picsum photos saved locally
│   ├── app/
│   │   ├── layout.tsx              ← root shell: sidebar + header
│   │   ├── page.tsx                ← dashboard / overview
│   │   ├── iot/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── finance/page.tsx
│   │   ├── warehouse/page.tsx
│   │   ├── settings/page.tsx
│   │   └── invoice/page.tsx
│   ├── components/
│   │   └── ui/                     ← TailPrint component implementations
│   ├── data/                       ← TypeScript mock data files
│   │   ├── tenants.ts
│   │   ├── iot-nodes.ts
│   │   ├── inventory.ts
│   │   ├── finance.ts
│   │   ├── invoices.ts
│   │   └── warehouse.ts
│   └── lib/
│       └── theme.ts                ← theme context + CSS var injector
│
├── docs/
│   └── superpowers/specs/          ← this file
├── initial_design.md
└── README.md
```

**Rule:** `design-guideline/` is fully agnostic — zero references to `samples/`. Docs are portable across any framework.

---

## 3. Design Guideline — AI-Friendly Doc Format

### 3.1 SKILLS.md (AI Entry Point)

`design-guideline/SKILLS.md` is the single file an AI assistant loads to gain full TailPrint context. Structure:

```markdown
# TailPrint Skills Reference
version: 1.0.0 | status: stable | tailwind: 3.x

## What is TailPrint
[one paragraph summary]

## Token Quick Reference
[full token table — names, values, usage]

## Component Index
| Component     | File                        | Status  | Since |
|---------------|-----------------------------|---------|-------|
| table         | components/table.md         | stable  | 1.0.0 |
| ...

## Typography
[font stack, size scale]

## Theming
[CSS var system summary, tenant override pattern]

## Layout
[holy grail pattern, breakpoints]

## Anti-Patterns (Global)
[things never to do in TailPrint]
```

### 3.2 Component Doc Schema

Every component doc uses this exact frontmatter + section structure:

```markdown
---
component: <name>
category: data-display | navigation | input | feedback | overlay
tailprint-version: 1.0.0
since: 1.0.0
status: stable | beta | deprecated
deprecated-in: ~
replaced-by: ~
---

## Purpose
One sentence: what it does, when to reach for it.

## When to Use
- bullet list

## When NOT to Use
- bullet list

## Anatomy
ASCII diagram or labeled description of parts.

## Class Recipe
| Variant | Tailwind Classes |
|---------|-----------------|
| ...     | `exact classes` |

## Tokens Used
- `token-name` → `value` — why this token here

## States
| State   | Additional Classes |
|---------|--------------------|
| hover   | ...                |
| active  | ...                |
| focus   | ...                |
| disabled| ...                |

## Anti-Patterns
- DON'T: ... (reason)
- DON'T: ...

## Accessibility Notes
- ...
```

---

## 4. Token System

### 4.1 Layer 1 — Static Tokens (tailwind.config.js)

Fixed Blueprint values. Never change per tenant or theme.

```javascript
theme: {
  extend: {
    colors: {
      'tp-bg':      '#f5f8fa',
      'tp-dark':    '#182026',
      'tp-gray':    '#5c7080',
      'tp-border':  '#d8e1e8',
      'tp-primary': 'var(--tp-accent)',      // maps to CSS var
      'tp-success': '#0f9960',
      'tp-danger':  '#db3737',
      'tp-warning': '#d9822b',
    },
    boxShadow: {
      'tp-input':  'inset 0 0 0 1px rgba(16,22,26,0.15), inset 0 1px 1px rgba(16,22,26,0.2)',
      'tp-button': 'inset 0 0 0 1px rgba(16,22,26,0.2), inset 0 -1px 0 rgba(16,22,26,0.1)',
      'tp-card':   '0 0 0 1px rgba(16,22,26,0.15), 0 1px 1px rgba(16,22,26,0.2)',
      'tp-active': 'inset 0 1px 2px rgba(16,22,26,0.2)',
    },
    borderRadius: {
      'tp': '3px',
    },
    fontFamily: {
      'tp-sans': ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      'tp-mono': ['"IBM Plex Mono"', 'monospace'],
    },
    fontSize: {
      'tp-xs':   ['11px', { lineHeight: '16px' }],
      'tp-sm':   ['12px', { lineHeight: '16px' }],
      'tp-base': ['13px', { lineHeight: '20px' }],
      'tp-ui':   ['14px', { lineHeight: '20px' }],
    },
  }
}
```

### 4.2 Layer 2 — CSS Variables (Tenant + Theme Overridable)

```css
:root {
  --tp-accent:       #137cbd;
  --tp-accent-dark:  #106ba3;
  --tp-accent-text:  #ffffff;
  --tp-surface:      #f5f8fa;
  --tp-sidebar-bg:   #30404d;
  --tp-sidebar-text: #f5f8fa;
}

[data-theme="dark"] {
  --tp-surface:      #293742;
  --tp-sidebar-bg:   #1c252b;
  --tp-accent:       #2b95d6;
}

[data-tenant="novatech"] {
  --tp-accent:       #7b3fa0;
  --tp-accent-dark:  #6b2fa0;
  --tp-sidebar-bg:   #2d1f38;
}

[data-tenant="acmecorp"] {
  --tp-accent:       #bf7326;
  --tp-accent-dark:  #a05a20;
  --tp-sidebar-bg:   #3d2b1f;
}
```

**Rule:** Tenant swap = `<html data-tenant="novatech">`. Dark mode = `<html data-theme="dark">`. Both can combine: `<html data-tenant="novatech" data-theme="dark">`.

---

## 5. Typography

**Primary font:** IBM Plex Sans — UI labels, headings, body text  
**Monospace font:** IBM Plex Mono — numeric data cells, IDs, sensor readings, code  
**Loading:** `next/font/google` — zero layout shift

**Type scale:**
| Name     | Size | Line Height | Usage |
|----------|------|-------------|-------|
| tp-xs    | 11px | 16px        | Table headers, labels, badges |
| tp-sm    | 12px | 16px        | Secondary text, metadata |
| tp-base  | 13px | 20px        | Table cells, body text |
| tp-ui    | 14px | 20px        | Inputs, dropdowns, modals |

**Data cells always use `font-tp-mono tabular-nums`.**

---

## 6. Component Inventory

### 6.1 Data Display (5 components)
- **table** — primary ledger/list view, `border-collapse`, sticky headers
- **badge** — status pill: online/offline/warning/error
- **card** — KPI container, metric + label + trend
- **stat-block** — large number + label + delta, for dashboard KPIs
- **timeline** — audit log, event feed, vertical connector

### 6.2 Navigation (4 components)
- **sidebar** — dark collapsible nav, domain sections, active state
- **top-header** — tenant name, breadcrumb area, user avatar, theme toggle
- **breadcrumb** — slash-separated path for deep drill-down
- **tabs** — horizontal sub-view switcher, underline active style

### 6.3 Input & Forms (5 components)
- **input** — 30px height, inset shadow, focus ring
- **select** — same height as input, custom chevron, no browser default
- **checkbox** — compact, 14px target area, used for batch row selection
- **toggle** — binary on/off, node enable/disable, feature flags
- **date-range-hint** — class recipe only, no JS; documents the pattern

### 6.4 Feedback (4 components)
- **callout** — full-width banner, left border accent, 4 intents
- **progress-bar** — warehouse fill %, upload status, capacity warning
- **skeleton** — loading placeholder for tables and cards
- **sparkline-hint** — trend direction via CSS bars, no chart library

### 6.5 Overlay (3 components)
- **modal** — confirm dialogs, quick-edit forms, `tp-card` shadow
- **tooltip** — hover label for truncated cells, column headers
- **drawer-hint** — slide-in detail panel pattern, class recipe only

**Total: 21 components**

---

## 7. Versioning

### 7.1 Semantic Versioning Rules
- **Major** — breaking token changes (renamed token, removed component, value change that affects layouts)
- **Minor** — new components, new token additions, new theme vars
- **Patch** — doc corrections, anti-pattern additions, accessibility notes

### 7.2 version.json
```json
{
  "version": "1.0.0",
  "released": "2026-05-07",
  "tailwind": "3.x",
  "status": "stable",
  "components": 21
}
```

### 7.3 Component Status Lifecycle
```
beta → stable → deprecated → removed
```
`deprecated` components stay fully documented with `replaced-by` field. Removed components exist in CHANGELOG only.

---

## 8. Sample App

### 8.1 Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.x
- **Language:** TypeScript
- **Font:** `next/font/google` — IBM Plex Sans + IBM Plex Mono
- **State:** React Context for theme only. No other state library.
- **No chart library.** Data density via tables and CSS-only sparklines.

### 8.2 Pages (7)

| Route | Page | Key TailPrint Components |
|-------|------|--------------------------|
| `/` | Dashboard | stat-block, card, callout, badge, sparkline-hint |
| `/iot` | IoT Node Monitor | table (48 rows), badge, callout, toggle, progress-bar |
| `/inventory` | Stock Ledger | table (200 SKUs), input, select, checkbox, badge |
| `/finance` | GL Journal | table (60-day), tabs, breadcrumb, badge |
| `/warehouse` | Warehouse Map | card grid, progress-bar, badge, stat-block |
| `/invoice` | Invoice / AR | table, badge, modal, tabs |
| `/settings` | Tenant Settings | toggle, input, select, card, theme switcher |

### 8.3 Mock Data

**Tenants (2):**
- `AcmeCorp` — manufacturing, accent `#bf7326` (amber)
- `NovaTech` — logistics, accent `#7b3fa0` (purple)

**IoT Nodes (48):**
- 3 warehouses × 16 sensors each
- Statuses: `online` (32), `warning` (10), `offline` (6)
- Readings: temperature, humidity, vibration, power draw
- Last-seen timestamps, alert thresholds

**Inventory (200 SKUs):**
- 4 warehouses, 8 categories
- Fields: SKU, name, qty on hand, reorder point, unit cost, warehouse, zone, bin
- ~15% below reorder threshold (triggers badge)

**Finance / GL Journal (60 days):**
- 3 cost centers: Manufacturing, Logistics, Admin
- Entry types: purchase, sales, payroll, depreciation
- Debit/credit columns, running balance, period totals

**Invoices (30):**
- Statuses: `paid` (14), `overdue` (8), `draft` (5), `pending` (3)
- Fields: invoice #, client, amount, due date, issued date, status, line items

**Warehouse (3 floors × 12 zones × 8 bins):**
- Per-bin: capacity, fill %, SKU count, last activity
- Zone status: active / maintenance / locked

**Images (picsum):**
- 10 user avatars: `picsum.photos/32/32?random=1..10`
- 8 product images: `picsum.photos/48/48?random=11..18`
- 3 warehouse thumbnails: `picsum.photos/200/120?random=21..23`
- All saved to `samples/public/images/`

### 8.4 Theme Switcher (Settings Page)
- Dropdown: Light / Dark
- Dropdown: Tenant (AcmeCorp / NovaTech)
- Persisted to `localStorage`
- Applied as `data-theme` + `data-tenant` on `<html>` via `lib/theme.ts`

---

## 9. Layout System

**Holy Grail — root shell (`app/layout.tsx`):**
```
┌─────────────────────────────────────────────┐
│ Sidebar (w-52, flex-shrink-0)               │
│ ┌─────────────────────────────────────────┐ │
│ │ Top Header (h-10, border-b)             │ │
│ ├─────────────────────────────────────────┤ │
│ │                                         │ │
│ │ Main Content (flex-1, overflow-auto)    │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Wrapper: `flex h-screen bg-tp-bg font-tp-sans`

**Density target:** 25 rows × 8 columns visible at 1080p without scroll.

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Data density | 25 rows × 8 cols at 1080p, no scroll |
| Zero-JS layouts | All layout components use zero `useClient` |
| Visual fidelity | <5% variance vs @blueprintjs/core visually |
| AI usability | AI can build a new TailPrint page from SKILLS.md alone |
| Theme swap | Full tenant re-theme via one `data-tenant` attribute |
| Font load | Zero layout shift via `next/font` |

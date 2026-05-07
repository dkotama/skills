# TailPrint Astro Samples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully static Astro site at `samples/tailprint/` showcasing all TailPrint design system components across 7 realistic ERP/IoT pages.

**Architecture:** Astro 4.x with @astrojs/tailwind, pure static output (`astro build`). All pages are `.astro` server-rendered to HTML. Theme switching uses a single `is:inline` script in `<head>` to read `localStorage` before paint (zero flash). No React/Vue/Svelte islands.

**Tech Stack:** Astro 4.x, Tailwind CSS 3.4.x, TypeScript 5.x, @fontsource (IBM Plex Sans + Mono), zero JS framework dependencies.

---

## File Map

```
samples/tailprint/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   └── images/               ← picsum avatars + products (downloaded in Task 19)
└── src/
    ├── styles/
    │   └── global.css         ← Tailwind directives + CSS vars (tenant/dark tokens)
    ├── layouts/
    │   └── Shell.astro        ← anti-flash script, fonts, sidebar, header, slot
    ├── components/
    │   └── ui/
    │       ├── Sidebar.astro
    │       ├── TopHeader.astro
    │       ├── Badge.astro
    │       ├── Callout.astro
    │       ├── Card.astro
    │       ├── StatBlock.astro
    │       ├── Button.astro
    │       ├── Input.astro
    │       ├── Select.astro
    │       ├── Toggle.astro
    │       ├── ProgressBar.astro
    │       ├── Sparkline.astro
    │       ├── Tabs.astro
    │       ├── Table.astro
    │       └── Modal.astro
    ├── data/
    │   ├── iot-nodes.ts
    │   ├── inventory.ts
    │   ├── finance.ts
    │   ├── invoices.ts
    │   └── warehouse.ts
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

## Task 1: Project Scaffold

**Files:**
- Create: `samples/tailprint/package.json`
- Create: `samples/tailprint/astro.config.mjs`
- Create: `samples/tailprint/tailwind.config.mjs`
- Create: `samples/tailprint/tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "tailprint-samples",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/tailwind": "^5.1.0",
    "@fontsource/ibm-plex-sans": "^5.1.0",
    "@fontsource/ibm-plex-mono": "^5.1.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
});
```

- [ ] **Step 3: Create tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tp-bg':      '#f5f8fa',
        'tp-dark':    '#182026',
        'tp-gray':    '#5c7080',
        'tp-border':  '#d8e1e8',
        'tp-primary': 'var(--tp-accent)',
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
      borderRadius: { 'tp': '3px' },
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
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 5: Install dependencies**

```bash
cd samples/tailprint && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Verify Astro works**

```bash
cd samples/tailprint && npm run check
```

Expected: no TypeScript errors (no src files yet, so just config validation).

- [ ] **Step 7: Commit**

```bash
git add samples/tailprint/package.json samples/tailprint/astro.config.mjs samples/tailprint/tailwind.config.mjs samples/tailprint/tsconfig.json samples/tailprint/package-lock.json
git commit -m "feat(samples): scaffold Astro project with TailPrint Tailwind config"
```

---

## Task 2: Global CSS + Fonts

**Files:**
- Create: `samples/tailprint/src/styles/global.css`

- [ ] **Step 1: Create src/styles/global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Font faces ── */
@import '@fontsource/ibm-plex-sans/400.css';
@import '@fontsource/ibm-plex-sans/500.css';
@import '@fontsource/ibm-plex-sans/600.css';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/600.css';

/* ── Layer 2 tokens: theme + tenant overridable ── */
:root {
  --tp-accent:       #137cbd;
  --tp-accent-dark:  #106ba3;
  --tp-accent-text:  #ffffff;
  --tp-surface:      #f5f8fa;
  --tp-sidebar-bg:   #30404d;
  --tp-sidebar-text: #f5f8fa;
}

[data-theme="dark"] {
  --tp-surface:    #293742;
  --tp-sidebar-bg: #1c252b;
  --tp-accent:     #2b95d6;
}

[data-tenant="novatech"] {
  --tp-accent:      #7b3fa0;
  --tp-accent-dark: #6b2fa0;
  --tp-sidebar-bg:  #2d1f38;
}

[data-tenant="acmecorp"] {
  --tp-accent:      #bf7326;
  --tp-accent-dark: #a05a20;
  --tp-sidebar-bg:  #3d2b1f;
}
```

- [ ] **Step 2: Commit**

```bash
git add samples/tailprint/src/styles/global.css
git commit -m "feat(samples): add global CSS with TailPrint CSS variable tokens"
```

---

## Task 3: Shell Layout

**Files:**
- Create: `samples/tailprint/src/layouts/Shell.astro`

`Shell.astro` is the root layout. It inlines the anti-flash theme script synchronously before the body paints, imports global CSS, and renders Sidebar + TopHeader with a main content slot.

- [ ] **Step 1: Create src/layouts/Shell.astro**

```astro
---
import '../styles/global.css';
import Sidebar from '../components/ui/Sidebar.astro';
import TopHeader from '../components/ui/TopHeader.astro';

interface Props {
  title: string;
  activePage: string;
}

const { title, activePage } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — TailPrint</title>
    <!-- Anti-flash: reads localStorage before body paint -->
    <script is:inline>
      (function () {
        var t = localStorage.getItem('tp-theme');
        var n = localStorage.getItem('tp-tenant');
        if (t) document.documentElement.dataset.theme = t;
        if (n) document.documentElement.dataset.tenant = n;
      })();
    </script>
  </head>
  <body class="flex h-screen bg-tp-bg font-tp-sans overflow-hidden">
    <Sidebar activePage={activePage} />
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopHeader title={title} />
      <main class="flex-1 overflow-auto p-4">
        <slot />
      </main>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add samples/tailprint/src/layouts/Shell.astro
git commit -m "feat(samples): add Shell layout with anti-flash theme init script"
```

---

## Task 4: Sidebar + TopHeader Components

**Files:**
- Create: `samples/tailprint/src/components/ui/Sidebar.astro`
- Create: `samples/tailprint/src/components/ui/TopHeader.astro`

- [ ] **Step 1: Create src/components/ui/Sidebar.astro**

```astro
---
interface Props {
  activePage: string;
}
const { activePage } = Astro.props;

const navItems = [
  { label: 'Dashboard',   href: '/',          key: 'dashboard' },
  { label: 'IoT Monitor', href: '/iot',        key: 'iot' },
  { label: 'Inventory',   href: '/inventory',  key: 'inventory' },
  { label: 'Finance',     href: '/finance',    key: 'finance' },
  { label: 'Warehouse',   href: '/warehouse',  key: 'warehouse' },
  { label: 'Invoice / AR',href: '/invoice',    key: 'invoice' },
  { label: 'Settings',    href: '/settings',   key: 'settings' },
];
---
<nav
  class="w-52 h-screen flex flex-col flex-shrink-0 overflow-hidden"
  style="background-color: var(--tp-sidebar-bg); color: var(--tp-sidebar-text);"
>
  <div class="h-10 flex items-center px-4 border-b border-white/10 font-semibold text-tp-base flex-shrink-0">
    TailPrint
  </div>
  <div class="flex-1 overflow-y-auto py-2">
    {navItems.map(item => (
      <a
        href={item.href}
        class={`flex items-center px-3 py-1.5 text-tp-base transition-none ${
          activePage === item.key
            ? 'bg-tp-primary text-white'
            : 'hover:bg-white/10'
        }`}
      >
        {item.label}
      </a>
    ))}
  </div>
</nav>
```

- [ ] **Step 2: Create src/components/ui/TopHeader.astro**

The TopHeader renders breadcrumb, theme/tenant selects (with inline onchange), and a user avatar. A `<script>` block syncs select values to the current `html` dataset on load.

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<header class="h-10 bg-white border-b border-tp-border flex items-center px-4 gap-3 flex-shrink-0">
  <span class="text-tp-gray text-tp-sm">{title}</span>
  <div class="flex-1"></div>

  <select
    id="tp-theme-select"
    class="h-[30px] px-2 bg-white shadow-tp-input rounded-tp text-tp-sm outline-none cursor-pointer"
    onchange="document.documentElement.dataset.theme = this.value; localStorage.setItem('tp-theme', this.value);"
  >
    <option value="">Light</option>
    <option value="dark">Dark</option>
  </select>

  <select
    id="tp-tenant-select"
    class="h-[30px] px-2 bg-white shadow-tp-input rounded-tp text-tp-sm outline-none cursor-pointer"
    onchange="document.documentElement.dataset.tenant = this.value; localStorage.setItem('tp-tenant', this.value);"
  >
    <option value="">Default</option>
    <option value="acmecorp">AcmeCorp</option>
    <option value="novatech">NovaTech</option>
  </select>

  <img src="/images/avatar-1.jpg" class="w-6 h-6 rounded-full object-cover" alt="User avatar" />
</header>

<script>
  // Sync selects to current html dataset after anti-flash script runs
  const themeSelect = document.getElementById('tp-theme-select') as HTMLSelectElement | null;
  const tenantSelect = document.getElementById('tp-tenant-select') as HTMLSelectElement | null;
  if (themeSelect) themeSelect.value = document.documentElement.dataset.theme ?? '';
  if (tenantSelect) tenantSelect.value = document.documentElement.dataset.tenant ?? '';
</script>
```

- [ ] **Step 3: Create a minimal placeholder index page so the build is valid**

```astro
---
// src/pages/index.astro — placeholder, replaced fully in Task 12
import Shell from '../layouts/Shell.astro';
---
<Shell title="Dashboard" activePage="dashboard">
  <p class="text-tp-base text-tp-gray">Dashboard coming soon.</p>
</Shell>
```

- [ ] **Step 4: Run build to verify shell renders**

```bash
cd samples/tailprint && npm run build
```

Expected: `dist/index.html` created, no errors.

- [ ] **Step 5: Commit**

```bash
git add samples/tailprint/src/components/ui/Sidebar.astro samples/tailprint/src/components/ui/TopHeader.astro samples/tailprint/src/pages/index.astro
git commit -m "feat(samples): add Sidebar, TopHeader, and placeholder index page"
```

---

## Task 5: Badge, Callout, Card, StatBlock

**Files:**
- Create: `samples/tailprint/src/components/ui/Badge.astro`
- Create: `samples/tailprint/src/components/ui/Callout.astro`
- Create: `samples/tailprint/src/components/ui/Card.astro`
- Create: `samples/tailprint/src/components/ui/StatBlock.astro`

- [ ] **Step 1: Create Badge.astro**

```astro
---
interface Props {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
}
const { status, label } = Astro.props;
const styles: Record<string, string> = {
  online:  'bg-[#d5eae2] text-tp-success',
  offline: 'bg-[#fbeae5] text-tp-danger',
  warning: 'bg-[#fef3e2] text-tp-warning',
  error:   'bg-[#fbeae5] text-tp-danger',
};
---
<span class={`inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold ${styles[status]}`}>
  {label ?? status}
</span>
```

- [ ] **Step 2: Create Callout.astro**

```astro
---
interface Props {
  intent: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}
const { intent, message } = Astro.props;
const styles: Record<string, string> = {
  success: 'bg-[#d5eae2] text-tp-success border-tp-success',
  danger:  'bg-[#fbeae5] text-tp-danger border-tp-danger',
  warning: 'bg-[#fef3e2] text-tp-warning border-tp-warning',
  info:    'bg-[#e8f4fb] text-[#137cbd] border-[#137cbd]',
};
---
<div class={`p-3 rounded-tp border-l-4 text-tp-base ${styles[intent]}`}>
  {message}
</div>
```

- [ ] **Step 3: Create Card.astro**

```astro
---
interface Props {
  label?: string;
}
const { label } = Astro.props;
---
<div class="shadow-tp-card rounded-tp bg-white p-4">
  {label && (
    <div class="text-tp-xs text-tp-gray uppercase tracking-wider mb-2 font-semibold">{label}</div>
  )}
  <slot />
</div>
```

- [ ] **Step 4: Create StatBlock.astro**

```astro
---
interface Props {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
}
const { label, value, delta, trend } = Astro.props;
const trendClass = trend === 'up' ? 'text-tp-success' : 'text-tp-danger';
const arrow = trend === 'up' ? '↑' : '↓';
---
<div class="shadow-tp-card rounded-tp bg-white p-4">
  <div class="text-tp-xs text-tp-gray uppercase tracking-wider mb-1 font-semibold">{label}</div>
  <div class="text-2xl font-semibold font-tp-mono tabular-nums text-tp-dark">{value}</div>
  {delta && (
    <div class={`text-tp-xs mt-1 ${trendClass}`}>{arrow} {delta}</div>
  )}
</div>
```

- [ ] **Step 5: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes, no errors.

- [ ] **Step 6: Commit**

```bash
git add samples/tailprint/src/components/ui/Badge.astro samples/tailprint/src/components/ui/Callout.astro samples/tailprint/src/components/ui/Card.astro samples/tailprint/src/components/ui/StatBlock.astro
git commit -m "feat(samples): add Badge, Callout, Card, StatBlock components"
```

---

## Task 6: Button, Input, Select, Toggle

**Files:**
- Create: `samples/tailprint/src/components/ui/Button.astro`
- Create: `samples/tailprint/src/components/ui/Input.astro`
- Create: `samples/tailprint/src/components/ui/Select.astro`
- Create: `samples/tailprint/src/components/ui/Toggle.astro`

- [ ] **Step 1: Create Button.astro**

```astro
---
interface Props {
  intent?: 'primary' | 'default';
  label: string;
  type?: 'button' | 'submit';
}
const { intent = 'default', label, type = 'button' } = Astro.props;
const cls = intent === 'primary'
  ? 'bg-tp-primary text-white active:shadow-tp-active'
  : 'bg-white text-tp-dark active:bg-[#d8e1e8] active:shadow-tp-active';
---
<button type={type} class={`h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium ${cls}`}>
  {label}
</button>
```

- [ ] **Step 2: Create Input.astro**

```astro
---
interface Props {
  placeholder?: string;
  value?: string;
  name?: string;
  type?: string;
  id?: string;
}
const { placeholder, value, name, type = 'text', id } = Astro.props;
---
<input
  type={type}
  id={id}
  name={name}
  value={value}
  placeholder={placeholder}
  class="h-[30px] px-2.5 bg-white shadow-tp-input rounded-tp text-tp-ui outline-none focus:ring-2 focus:ring-tp-primary/50 w-full"
/>
```

- [ ] **Step 3: Create Select.astro**

```astro
---
interface Props {
  options: { label: string; value: string }[];
  name?: string;
  id?: string;
  value?: string;
}
const { options, name, id, value } = Astro.props;
---
<select
  name={name}
  id={id}
  class="h-[30px] px-2.5 bg-white shadow-tp-input rounded-tp text-tp-ui outline-none focus:ring-2 focus:ring-tp-primary/50 cursor-pointer"
>
  {options.map(o => (
    <option value={o.value} selected={o.value === value}>{o.label}</option>
  ))}
</select>
```

- [ ] **Step 4: Create Toggle.astro**

```astro
---
interface Props {
  id: string;
  label: string;
  checked?: boolean;
}
const { id, label, checked = false } = Astro.props;
---
<label class="flex items-center gap-2 cursor-pointer select-none">
  <div class="relative">
    <input type="checkbox" id={id} checked={checked} class="sr-only peer" />
    <div class="w-8 h-4 bg-[#ebf1f5] rounded-full peer-checked:bg-tp-primary shadow-tp-input"></div>
    <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
  </div>
  <span class="text-tp-base text-tp-dark">{label}</span>
</label>
```

Note: The Toggle `peer-checked:translate-x-4` requires the checkbox and the dot to be siblings. The structure above uses an absolute-positioned dot inside a relative wrapper alongside the hidden checkbox — this works because `peer` targets the sibling `.peer-checked:` on the wrapper, not the dot. However Tailwind's `peer` requires the peer to be a direct sibling. Restructure:

```astro
---
interface Props {
  id: string;
  label: string;
  checked?: boolean;
}
const { id, label, checked = false } = Astro.props;
---
<label class="flex items-center gap-2 cursor-pointer select-none">
  <div class="relative w-8 h-4">
    <input type="checkbox" id={id} checked={checked} class="sr-only peer" />
    <span class="block w-8 h-4 bg-[#ebf1f5] rounded-full peer-checked:bg-tp-primary shadow-tp-input"></span>
    <span class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-150 peer-checked:translate-x-4 shadow-sm pointer-events-none"></span>
  </div>
  <span class="text-tp-base text-tp-dark">{label}</span>
</label>
```

- [ ] **Step 5: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 6: Commit**

```bash
git add samples/tailprint/src/components/ui/Button.astro samples/tailprint/src/components/ui/Input.astro samples/tailprint/src/components/ui/Select.astro samples/tailprint/src/components/ui/Toggle.astro
git commit -m "feat(samples): add Button, Input, Select, Toggle components"
```

---

## Task 7: ProgressBar, Sparkline, Tabs

**Files:**
- Create: `samples/tailprint/src/components/ui/ProgressBar.astro`
- Create: `samples/tailprint/src/components/ui/Sparkline.astro`
- Create: `samples/tailprint/src/components/ui/Tabs.astro`

- [ ] **Step 1: Create ProgressBar.astro**

```astro
---
interface Props {
  value: number; // 0–100
  intent?: 'default' | 'warning' | 'danger';
}
const { value, intent = 'default' } = Astro.props;
const clamped = Math.min(100, Math.max(0, value));
const barClass = intent === 'danger'
  ? 'bg-tp-danger'
  : intent === 'warning'
  ? 'bg-tp-warning'
  : 'bg-tp-primary';
---
<div class="h-2 bg-[#ebf1f5] rounded-tp overflow-hidden">
  <div class={`h-full rounded-tp ${barClass}`} style={`width: ${clamped}%`}></div>
</div>
```

- [ ] **Step 2: Create Sparkline.astro**

Sparkline renders a CSS bar chart — no chart library. Values are 0–100 normalized to bar heights.

```astro
---
interface Props {
  values: number[];
}
const { values } = Astro.props;
const max = Math.max(...values, 1);
---
<div class="flex items-end gap-px h-6">
  {values.map(v => (
    <div
      class="w-1 bg-tp-primary rounded-sm"
      style={`height: ${Math.round((v / max) * 100)}%; opacity: 0.75;`}
    ></div>
  ))}
</div>
```

- [ ] **Step 3: Create Tabs.astro**

```astro
---
interface Props {
  tabs: { label: string; href: string }[];
  active: string;
}
const { tabs, active } = Astro.props;
---
<div class="flex border-b border-tp-border mb-4">
  {tabs.map(tab => (
    <a
      href={tab.href}
      class={`px-4 py-2 text-tp-base transition-none border-b-2 -mb-px ${
        tab.label === active
          ? 'border-tp-primary text-tp-primary font-medium'
          : 'border-transparent text-tp-gray hover:text-tp-dark'
      }`}
    >
      {tab.label}
    </a>
  ))}
</div>
```

- [ ] **Step 4: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 5: Commit**

```bash
git add samples/tailprint/src/components/ui/ProgressBar.astro samples/tailprint/src/components/ui/Sparkline.astro samples/tailprint/src/components/ui/Tabs.astro
git commit -m "feat(samples): add ProgressBar, Sparkline, Tabs components"
```

---

## Task 8: Table + Modal

**Files:**
- Create: `samples/tailprint/src/components/ui/Table.astro`
- Create: `samples/tailprint/src/components/ui/Modal.astro`

- [ ] **Step 1: Create Table.astro**

Table renders the `<thead>` from `columns` prop and exposes a slot for `<tbody>` rows. Rows go directly in the slot as `<tr>` elements.

```astro
---
interface Props {
  columns: string[];
  stickyHeader?: boolean;
}
const { columns, stickyHeader = true } = Astro.props;
---
<div class="overflow-auto rounded-tp shadow-tp-card">
  <table class="w-full border-collapse text-tp-base">
    <thead class={stickyHeader ? 'sticky top-0 z-10' : ''}>
      <tr class="bg-[#ebf1f5]">
        {columns.map(col => (
          <th class="px-2 h-8 text-left text-tp-xs font-semibold text-tp-gray uppercase tracking-wider border-b border-tp-border whitespace-nowrap">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody class="divide-y divide-tp-border bg-white">
      <slot />
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Create Modal.astro**

Modal is hidden by default. Open it by calling `openModal('modal-id')`. The inline script adds a global `openModal`/`closeModal` on first Modal mount.

```astro
---
interface Props {
  id: string;
  title: string;
}
const { id, title } = Astro.props;
---
<div
  id={id}
  class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  role="dialog"
  aria-modal="true"
>
  <div class="bg-white rounded-tp shadow-tp-card w-full max-w-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-tp-ui font-semibold text-tp-dark">{title}</h2>
      <button
        onclick={`document.getElementById('${id}').classList.add('hidden')`}
        class="text-tp-gray hover:text-tp-dark text-xl leading-none"
        aria-label="Close"
      >×</button>
    </div>
    <slot />
  </div>
</div>

<script is:inline>
  if (!window.__tpModalInit) {
    window.__tpModalInit = true;
    window.openModal = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    };
    window.closeModal = function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    };
  }
</script>
```

Usage from pages: `<button onclick="openModal('my-modal')">Open</button>`

- [ ] **Step 3: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 4: Commit**

```bash
git add samples/tailprint/src/components/ui/Table.astro samples/tailprint/src/components/ui/Modal.astro
git commit -m "feat(samples): add Table and Modal components"
```

---

## Task 9: Mock Data — IoT Nodes

**Files:**
- Create: `samples/tailprint/src/data/iot-nodes.ts`

48 nodes: 3 warehouses × 16 sensors. 32 online, 10 warning, 6 offline. Use deterministic formulas (no `Math.random()`) so data is stable across builds.

- [ ] **Step 1: Create src/data/iot-nodes.ts**

```typescript
export type NodeStatus = 'online' | 'warning' | 'offline';
export type SensorType = 'temperature' | 'humidity' | 'vibration' | 'power';

export interface IotNode {
  id: string;
  warehouse: string;
  sensorType: SensorType;
  status: NodeStatus;
  temperature: number;
  humidity: number;
  vibration: number;
  powerDraw: number;
  lastSeen: string;
  alertThreshold: number;
}

const warehouses = ['WH-A', 'WH-B', 'WH-C'];
const sensorTypes: SensorType[] = ['temperature', 'humidity', 'vibration', 'power'];

function nodeStatus(i: number): NodeStatus {
  // 32 online, 10 warning, 6 offline out of 48
  if (i % 8 === 7) return 'offline';   // indices 7,15,23,31,39,47 → 6 offline
  if (i % 5 === 4) return 'warning';   // indices 4,9,14,19,24,29,34,39,44 → minus overlap → ~10
  return 'online';
}

function minutesAgo(i: number): string {
  const mins = (i * 7 + 1) % 120;
  const now = new Date('2026-05-07T10:00:00Z');
  now.setMinutes(now.getMinutes() - mins);
  return now.toISOString().replace('T', ' ').slice(0, 16);
}

export const iotNodes: IotNode[] = Array.from({ length: 48 }, (_, i) => ({
  id: `NODE-${String(i + 1).padStart(3, '0')}`,
  warehouse: warehouses[Math.floor(i / 16)],
  sensorType: sensorTypes[i % 4],
  status: nodeStatus(i),
  temperature: 18 + (i * 13) % 22,
  humidity: 30 + (i * 17) % 50,
  vibration: parseFloat(((i * 3) % 10 / 10).toFixed(2)),
  powerDraw: 100 + (i * 23) % 900,
  lastSeen: minutesAgo(i),
  alertThreshold: 35 + (i % 3) * 5,
}));
```

- [ ] **Step 2: Run type check**

```bash
cd samples/tailprint && npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/data/iot-nodes.ts
git commit -m "feat(samples): add IoT nodes mock data (48 nodes)"
```

---

## Task 10: Mock Data — Inventory

**Files:**
- Create: `samples/tailprint/src/data/inventory.ts`

200 SKUs across 4 warehouses, 8 categories. ~15% below reorder threshold.

- [ ] **Step 1: Create src/data/inventory.ts**

```typescript
export interface InventoryItem {
  sku: string;
  name: string;
  qty: number;
  reorderPoint: number;
  unitCost: number;
  warehouse: string;
  zone: string;
  bin: string;
  category: string;
}

const categories = ['Electronics','Mechanical','Chemical','Textile','Packaging','Tools','Safety','Office'];
const warehouses = ['WH-A','WH-B','WH-C','WH-D'];
const zones = ['Z1','Z2','Z3','Z4','Z5','Z6','Z7','Z8'];
const names = [
  'Resistor 10Ω','Capacitor 100μF','Relay 12V DC','Bearing SKF 6202','Hydraulic Oil 5L',
  'Cotton Roll 50m','Bubble Wrap 100m','Torque Wrench 1/2"','Safety Gloves Cut-5','Copy Paper A4 500',
  'Fuse 10A','LED Driver 24V','Proximity Sensor','V-Belt B52','Acetone 99% 20L',
  'Nylon Thread 1kg','Stretch Film 500m','Hex Key Set 9pc','Earplugs NRR33','Ballpoint Pens 12pk',
];

export const inventory: InventoryItem[] = Array.from({ length: 200 }, (_, i) => {
  const reorderPoint = 20 + (i * 7) % 80;
  // ~15% below reorder: every 7th item has qty < reorderPoint
  const qty = i % 7 === 0
    ? Math.max(1, reorderPoint - 5 - (i % 10))
    : reorderPoint + 10 + (i * 11) % 200;
  return {
    sku: `SKU-${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    qty,
    reorderPoint,
    unitCost: parseFloat((1 + (i * 37 % 49900) / 100).toFixed(2)),
    warehouse: warehouses[i % 4],
    zone: zones[i % 8],
    bin: `B${String((i % 20) + 1).padStart(2, '0')}`,
    category: categories[i % 8],
  };
});
```

- [ ] **Step 2: Run type check**

```bash
cd samples/tailprint && npm run check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/data/inventory.ts
git commit -m "feat(samples): add inventory mock data (200 SKUs)"
```

---

## Task 11: Mock Data — Finance, Invoices, Warehouse

**Files:**
- Create: `samples/tailprint/src/data/finance.ts`
- Create: `samples/tailprint/src/data/invoices.ts`
- Create: `samples/tailprint/src/data/warehouse.ts`

- [ ] **Step 1: Create src/data/finance.ts**

```typescript
export type EntryType = 'purchase' | 'sales' | 'payroll' | 'depreciation';
export type CostCenter = 'Manufacturing' | 'Logistics' | 'Admin';

export interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  costCenter: CostCenter;
  type: EntryType;
  debit: number;
  credit: number;
  balance: number;
}

const costCenters: CostCenter[] = ['Manufacturing', 'Logistics', 'Admin'];
const entryTypes: EntryType[] = ['purchase', 'sales', 'payroll', 'depreciation'];
const descriptions = [
  'Raw materials PO-1042','Product sales batch','Monthly payroll run','Equipment depreciation',
  'Office supplies','Freight invoice','Maintenance contract','Software license renewal',
];

let balance = 120000;
export const financeEntries: FinanceEntry[] = Array.from({ length: 60 }, (_, i) => {
  const type = entryTypes[i % 4];
  const amount = parseFloat((500 + (i * 173) % 9500).toFixed(2));
  const isCredit = type === 'sales';
  const debit = isCredit ? 0 : amount;
  const credit = isCredit ? amount : 0;
  balance = parseFloat((balance - debit + credit).toFixed(2));

  const date = new Date('2026-03-08');
  date.setDate(date.getDate() + i);

  return {
    id: `JE-${String(2000 + i + 1)}`,
    date: date.toISOString().slice(0, 10),
    description: descriptions[i % descriptions.length],
    costCenter: costCenters[i % 3],
    type,
    debit,
    credit,
    balance,
  };
});
```

- [ ] **Step 2: Create src/data/invoices.ts**

```typescript
export type InvoiceStatus = 'paid' | 'overdue' | 'draft' | 'pending';

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  issuedDate: string;
  status: InvoiceStatus;
}

const clients = [
  'Acme Manufacturing','NovaTech Solutions','Pacific Freight','Alpine Industrial',
  'Meridian Supplies','Summit Engineering','Delta Logistics','Harbor Works',
];
const statuses: InvoiceStatus[] = ['paid','paid','paid','paid','paid','overdue','overdue','overdue','draft','pending'];

export const invoices: Invoice[] = Array.from({ length: 30 }, (_, i) => {
  const issued = new Date('2026-02-01');
  issued.setDate(issued.getDate() + i * 2);
  const due = new Date(issued);
  due.setDate(due.getDate() + 30);

  return {
    id: `INV-${String(1000 + i + 1)}`,
    client: clients[i % clients.length],
    amount: parseFloat((500 + (i * 317) % 49500).toFixed(2)),
    dueDate: due.toISOString().slice(0, 10),
    issuedDate: issued.toISOString().slice(0, 10),
    status: statuses[i % statuses.length],
  };
});
```

- [ ] **Step 3: Create src/data/warehouse.ts**

```typescript
export type ZoneStatus = 'active' | 'maintenance' | 'locked';

export interface WarehouseBin {
  bin: string;
  capacity: number;
  fillPct: number;
  skuCount: number;
  lastActivity: string;
}

export interface WarehouseZone {
  zone: string;
  status: ZoneStatus;
  bins: WarehouseBin[];
}

export interface WarehouseFloor {
  floor: string;
  warehouse: string;
  zones: WarehouseZone[];
}

const zoneStatuses: ZoneStatus[] = ['active','active','active','active','maintenance','locked'];

function makeFloor(warehouseIdx: number, floorIdx: number): WarehouseFloor {
  const warehouse = `WH-${['A','B','C'][warehouseIdx]}`;
  const floorLabel = `Floor ${floorIdx + 1}`;
  const baseIdx = warehouseIdx * 36 + floorIdx * 12;

  const zones: WarehouseZone[] = Array.from({ length: 12 }, (_, z) => {
    const globalZ = baseIdx + z;
    return {
      zone: `Z${z + 1}`,
      status: zoneStatuses[globalZ % zoneStatuses.length],
      bins: Array.from({ length: 8 }, (_, b) => {
        const globalB = globalZ * 8 + b;
        const capacity = 100;
        const fillPct = (globalB * 13) % 101;
        const lastDay = new Date('2026-05-07');
        lastDay.setHours(lastDay.getHours() - (globalB % 24));
        return {
          bin: `B${b + 1}`,
          capacity,
          fillPct,
          skuCount: Math.floor(fillPct / 10),
          lastActivity: lastDay.toISOString().replace('T', ' ').slice(0, 16),
        };
      }),
    };
  });

  return { floor: floorLabel, warehouse, zones };
}

export const warehouseFloors: WarehouseFloor[] = [
  makeFloor(0, 0), makeFloor(1, 0), makeFloor(2, 0),
];
```

- [ ] **Step 4: Run type check**

```bash
cd samples/tailprint && npm run check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add samples/tailprint/src/data/finance.ts samples/tailprint/src/data/invoices.ts samples/tailprint/src/data/warehouse.ts
git commit -m "feat(samples): add finance, invoices, warehouse mock data"
```

---

## Task 12: Dashboard Page

**Files:**
- Modify: `samples/tailprint/src/pages/index.astro`

- [ ] **Step 1: Replace index.astro with full Dashboard**

```astro
---
import Shell from '../layouts/Shell.astro';
import StatBlock from '../components/ui/StatBlock.astro';
import Card from '../components/ui/Card.astro';
import Callout from '../components/ui/Callout.astro';
import Badge from '../components/ui/Badge.astro';
import Sparkline from '../components/ui/Sparkline.astro';
import ProgressBar from '../components/ui/ProgressBar.astro';
import { iotNodes } from '../data/iot-nodes';
import { inventory } from '../data/inventory';
import { invoices } from '../data/invoices';
import { warehouseFloors } from '../data/warehouse';

const onlineNodes = iotNodes.filter(n => n.status === 'online').length;
const offlineNodes = iotNodes.filter(n => n.status === 'offline').length;
const lowStock = inventory.filter(i => i.qty < i.reorderPoint).length;
const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
const totalAR = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

const sparkValues = [42, 58, 35, 67, 72, 55, 80, 65, 90, 78, 85, 92];

const recentAlerts = iotNodes.filter(n => n.status !== 'online').slice(0, 6);

const floorSummary = warehouseFloors.map(f => ({
  label: `${f.warehouse} ${f.floor}`,
  fillPct: Math.round(
    f.zones.flatMap(z => z.bins).reduce((s, b) => s + b.fillPct, 0) /
    (f.zones.length * 8)
  ),
}));
---
<Shell title="Dashboard" activePage="dashboard">
  {offlineNodes > 0 && (
    <Callout
      intent="danger"
      message={`${offlineNodes} IoT node${offlineNodes > 1 ? 's' : ''} offline — check sensor status`}
    />
  )}

  <div class="grid grid-cols-4 gap-3 mt-3">
    <StatBlock label="Nodes Online" value={String(onlineNodes)} delta="of 48 total" trend="up" />
    <StatBlock label="Low Stock SKUs" value={String(lowStock)} delta="need reorder" trend="down" />
    <StatBlock label="Overdue Invoices" value={String(overdueInvoices)} delta="require follow-up" trend="down" />
    <StatBlock label="Open AR" value={`$${totalAR.toLocaleString()}`} delta="outstanding" trend="up" />
  </div>

  <div class="grid grid-cols-3 gap-3 mt-3">
    <Card label="Network Activity (12h)">
      <Sparkline values={sparkValues} />
      <div class="text-tp-xs text-tp-gray mt-2">Packets/min — avg {Math.round(sparkValues.reduce((a,b) => a+b)/sparkValues.length)}</div>
    </Card>

    <Card label="Warehouse Fill">
      <div class="space-y-2">
        {floorSummary.map(f => (
          <div>
            <div class="flex justify-between text-tp-xs text-tp-gray mb-0.5">
              <span>{f.label}</span>
              <span class="font-tp-mono tabular-nums">{f.fillPct}%</span>
            </div>
            <ProgressBar value={f.fillPct} intent={f.fillPct > 85 ? 'danger' : f.fillPct > 70 ? 'warning' : 'default'} />
          </div>
        ))}
      </div>
    </Card>

    <Card label="Recent Alerts">
      <div class="space-y-1.5">
        {recentAlerts.map(node => (
          <div class="flex items-center justify-between">
            <span class="text-tp-sm text-tp-dark font-tp-mono">{node.id}</span>
            <div class="flex items-center gap-2">
              <span class="text-tp-xs text-tp-gray">{node.warehouse}</span>
              <Badge status={node.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/index.astro
git commit -m "feat(samples): build Dashboard page with stat blocks, sparkline, alerts"
```

---

## Task 13: IoT Monitor Page

**Files:**
- Create: `samples/tailprint/src/pages/iot.astro`

- [ ] **Step 1: Create src/pages/iot.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Callout from '../components/ui/Callout.astro';
import Toggle from '../components/ui/Toggle.astro';
import ProgressBar from '../components/ui/ProgressBar.astro';
import { iotNodes } from '../data/iot-nodes';

const offlineCount = iotNodes.filter(n => n.status === 'offline').length;
const columns = ['Node ID','Warehouse','Type','Status','Temp °C','Humidity %','Vibration g','Power W','Last Seen'];
---
<Shell title="IoT / Node Monitor" activePage="iot">
  {offlineCount > 0 && (
    <Callout intent="warning" message={`${offlineCount} nodes offline — last ping exceeded 60 min threshold`} />
  )}

  <div class="flex items-center justify-between mt-3 mb-2">
    <h1 class="text-tp-ui font-semibold text-tp-dark">IoT Node Monitor</h1>
    <div class="flex items-center gap-3">
      <Toggle id="toggle-alerts" label="Live alerts" checked={true} />
      <Toggle id="toggle-offline" label="Show offline only" />
    </div>
  </div>

  <Table columns={columns}>
    {iotNodes.map(node => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border">{node.id}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{node.warehouse}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border capitalize">{node.sensorType}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge status={node.status} />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right">{node.temperature}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <ProgressBar value={node.humidity} intent={node.humidity > 80 ? 'warning' : 'default'} />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right">{node.vibration.toFixed(2)}</td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right">{node.powerDraw}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray text-tp-xs">{node.lastSeen}</td>
      </tr>
    ))}
  </Table>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/iot.astro
git commit -m "feat(samples): build IoT Monitor page with 48-row sensor table"
```

---

## Task 14: Inventory Page

**Files:**
- Create: `samples/tailprint/src/pages/inventory.astro`

- [ ] **Step 1: Create src/pages/inventory.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Input from '../components/ui/Input.astro';
import Select from '../components/ui/Select.astro';
import { inventory } from '../data/inventory';

const columns = ['','SKU','Name','Category','Warehouse','Zone','Bin','Qty','Reorder Pt','Unit Cost','Status'];

const categoryOptions = [
  { label: 'All Categories', value: '' },
  ...['Electronics','Mechanical','Chemical','Textile','Packaging','Tools','Safety','Office']
    .map(c => ({ label: c, value: c })),
];

const warehouseOptions = [
  { label: 'All Warehouses', value: '' },
  ...['WH-A','WH-B','WH-C','WH-D'].map(w => ({ label: w, value: w })),
];
---
<Shell title="Inventory / Stock Ledger" activePage="inventory">
  <div class="flex items-center gap-2 mb-3">
    <Input placeholder="Search SKU or name…" />
    <Select options={categoryOptions} />
    <Select options={warehouseOptions} />
  </div>

  <Table columns={columns}>
    {inventory.map(item => {
      const belowReorder = item.qty < item.reorderPoint;
      return (
        <tr class="hover:bg-[#f0f4f7]">
          <td class="px-2 py-1 border-r border-tp-border w-6">
            <input type="checkbox" class="w-3 h-3" />
          </td>
          <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border">{item.sku}</td>
          <td class="px-2 py-1 text-tp-dark border-r border-tp-border whitespace-nowrap">{item.name}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.category}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.warehouse}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.zone}</td>
          <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border">{item.bin}</td>
          <td class={`px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right ${belowReorder ? 'text-tp-danger font-semibold' : 'text-tp-dark'}`}>{item.qty.toLocaleString()}</td>
          <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right text-tp-gray">{item.reorderPoint}</td>
          <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right">${item.unitCost.toFixed(2)}</td>
          <td class="px-2 py-1">
            {belowReorder
              ? <Badge status="warning" label="Low Stock" />
              : <Badge status="online" label="OK" />}
          </td>
        </tr>
      );
    })}
  </Table>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/inventory.astro
git commit -m "feat(samples): build Inventory page with 200-SKU ledger table"
```

---

## Task 15: Finance Page

**Files:**
- Create: `samples/tailprint/src/pages/finance.astro`

- [ ] **Step 1: Create src/pages/finance.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import Tabs from '../components/ui/Tabs.astro';
import Badge from '../components/ui/Badge.astro';
import { financeEntries } from '../data/finance';

const tabs = [
  { label: 'All Entries', href: '/finance' },
  { label: 'Manufacturing', href: '/finance' },
  { label: 'Logistics', href: '/finance' },
  { label: 'Admin', href: '/finance' },
];

const columns = ['Journal ID','Date','Description','Cost Center','Type','Debit','Credit','Balance'];

const totalDebit = financeEntries.reduce((s, e) => s + e.debit, 0);
const totalCredit = financeEntries.reduce((s, e) => s + e.credit, 0);
---
<Shell title="Finance / GL Journal" activePage="finance">
  <div class="flex items-center justify-between mb-3">
    <nav class="text-tp-sm text-tp-gray">
      Finance <span class="mx-1">/</span>
      <span class="text-tp-dark font-medium">GL Journal</span>
    </nav>
    <div class="flex gap-4 text-tp-sm">
      <span class="text-tp-gray">Total Debit: <span class="font-tp-mono tabular-nums text-tp-dark">${totalDebit.toLocaleString()}</span></span>
      <span class="text-tp-gray">Total Credit: <span class="font-tp-mono tabular-nums text-tp-success">${totalCredit.toLocaleString()}</span></span>
    </div>
  </div>

  <Tabs tabs={tabs} active="All Entries" />

  <Table columns={columns}>
    {financeEntries.map(entry => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border">{entry.id}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border">{entry.date}</td>
        <td class="px-2 py-1 text-tp-dark border-r border-tp-border">{entry.description}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{entry.costCenter}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge
            status={entry.type === 'sales' ? 'online' : entry.type === 'payroll' ? 'warning' : 'offline'}
            label={entry.type}
          />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-danger">
          {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '—'}
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-success">
          {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '—'}
        </td>
        <td class={`px-2 py-1 font-tp-mono tabular-nums text-right ${entry.balance < 0 ? 'text-tp-danger' : 'text-tp-dark'}`}>
          ${entry.balance.toLocaleString()}
        </td>
      </tr>
    ))}
  </Table>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/finance.astro
git commit -m "feat(samples): build Finance GL Journal page with tabs and 60-day ledger"
```

---

## Task 16: Warehouse Page

**Files:**
- Create: `samples/tailprint/src/pages/warehouse.astro`

- [ ] **Step 1: Create src/pages/warehouse.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Card from '../components/ui/Card.astro';
import StatBlock from '../components/ui/StatBlock.astro';
import ProgressBar from '../components/ui/ProgressBar.astro';
import Badge from '../components/ui/Badge.astro';
import { warehouseFloors } from '../data/warehouse';

const allBins = warehouseFloors.flatMap(f => f.zones.flatMap(z => z.bins));
const avgFill = Math.round(allBins.reduce((s, b) => s + b.fillPct, 0) / allBins.length);
const totalSKUs = allBins.reduce((s, b) => s + b.skuCount, 0);
const criticalZones = warehouseFloors.flatMap(f => f.zones).filter(z => z.status !== 'active').length;
---
<Shell title="Warehouse / Floor Map" activePage="warehouse">
  <div class="grid grid-cols-4 gap-3 mb-4">
    <StatBlock label="Avg Fill" value={`${avgFill}%`} delta="across all bins" trend={avgFill > 75 ? 'down' : 'up'} />
    <StatBlock label="Total SKUs Stored" value={totalSKUs.toLocaleString()} delta="active bins" trend="up" />
    <StatBlock label="Zones Inactive" value={String(criticalZones)} delta="maintenance / locked" trend="down" />
    <StatBlock label="Floors Monitored" value={String(warehouseFloors.length)} delta="warehouses" trend="up" />
  </div>

  <div class="space-y-4">
    {warehouseFloors.map(floor => (
      <Card label={`${floor.warehouse} — ${floor.floor}`}>
        <div class="grid grid-cols-6 gap-2">
          {floor.zones.slice(0, 12).map(zone => (
            <div class="rounded-tp border border-tp-border p-2">
              <div class="flex items-center justify-between mb-1">
                <span class="text-tp-xs font-semibold text-tp-gray uppercase">{zone.zone}</span>
                <Badge
                  status={zone.status === 'active' ? 'online' : zone.status === 'maintenance' ? 'warning' : 'offline'}
                  label={zone.status}
                />
              </div>
              {zone.bins.slice(0, 4).map(bin => (
                <div class="mb-1">
                  <div class="flex justify-between text-tp-xs text-tp-gray mb-px">
                    <span class="font-tp-mono">{bin.bin}</span>
                    <span class="tabular-nums">{bin.fillPct}%</span>
                  </div>
                  <ProgressBar
                    value={bin.fillPct}
                    intent={bin.fillPct > 90 ? 'danger' : bin.fillPct > 75 ? 'warning' : 'default'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    ))}
  </div>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/warehouse.astro
git commit -m "feat(samples): build Warehouse floor map with zone grid and bin fill"
```

---

## Task 17: Invoice / AR Page

**Files:**
- Create: `samples/tailprint/src/pages/invoice.astro`

- [ ] **Step 1: Create src/pages/invoice.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Tabs from '../components/ui/Tabs.astro';
import Modal from '../components/ui/Modal.astro';
import Button from '../components/ui/Button.astro';
import { invoices } from '../data/invoices';

const tabs = [
  { label: 'All', href: '/invoice' },
  { label: 'Overdue', href: '/invoice' },
  { label: 'Pending', href: '/invoice' },
  { label: 'Paid', href: '/invoice' },
];

const columns = ['Invoice #','Client','Issued','Due Date','Amount','Status',''];

const statusMap: Record<string, 'online' | 'offline' | 'warning' | 'error'> = {
  paid: 'online',
  overdue: 'offline',
  pending: 'warning',
  draft: 'error',
};

const totalOverdue = invoices
  .filter(i => i.status === 'overdue')
  .reduce((s, i) => s + i.amount, 0);
---
<Shell title="Invoice / AR" activePage="invoice">
  <div class="flex items-center justify-between mb-3">
    <div class="text-tp-sm text-tp-gray">
      Overdue AR: <span class="font-tp-mono tabular-nums text-tp-danger font-semibold">${totalOverdue.toLocaleString()}</span>
    </div>
    <Button intent="primary" label="New Invoice" />
  </div>

  <Tabs tabs={tabs} active="All" />

  <Table columns={columns}>
    {invoices.map(inv => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border">{inv.id}</td>
        <td class="px-2 py-1 text-tp-dark border-r border-tp-border">{inv.client}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border">{inv.issuedDate}</td>
        <td class={`px-2 py-1 font-tp-mono border-r border-tp-border ${inv.status === 'overdue' ? 'text-tp-danger font-semibold' : 'text-tp-gray'}`}>{inv.dueDate}</td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-dark">${inv.amount.toLocaleString()}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge status={statusMap[inv.status]} label={inv.status} />
        </td>
        <td class="px-2 py-1">
          <button
            onclick={`openModal('modal-${inv.id}')`}
            class="h-6 px-2 rounded-tp shadow-tp-button text-tp-xs font-medium bg-white text-tp-dark"
          >
            View
          </button>
          <Modal id={`modal-${inv.id}`} title={`${inv.id} — ${inv.client}`}>
            <div class="space-y-2 text-tp-base">
              <div class="flex justify-between"><span class="text-tp-gray">Amount</span><span class="font-tp-mono tabular-nums">${inv.amount.toLocaleString()}</span></div>
              <div class="flex justify-between"><span class="text-tp-gray">Issued</span><span class="font-tp-mono">{inv.issuedDate}</span></div>
              <div class="flex justify-between"><span class="text-tp-gray">Due</span><span class="font-tp-mono">{inv.dueDate}</span></div>
              <div class="flex justify-between"><span class="text-tp-gray">Status</span><Badge status={statusMap[inv.status]} label={inv.status} /></div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button onclick={`closeModal('modal-${inv.id}')`} class="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-white text-tp-dark">Close</button>
              <Button intent="primary" label="Mark Paid" />
            </div>
          </Modal>
        </td>
      </tr>
    ))}
  </Table>
</Shell>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/invoice.astro
git commit -m "feat(samples): build Invoice/AR page with modal detail view"
```

---

## Task 18: Settings Page

**Files:**
- Create: `samples/tailprint/src/pages/settings.astro`

- [ ] **Step 1: Create src/pages/settings.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Card from '../components/ui/Card.astro';
import Toggle from '../components/ui/Toggle.astro';
import Input from '../components/ui/Input.astro';
import Select from '../components/ui/Select.astro';
import Button from '../components/ui/Button.astro';
import Callout from '../components/ui/Callout.astro';

const themeOptions = [
  { label: 'Light', value: '' },
  { label: 'Dark', value: 'dark' },
];
const tenantOptions = [
  { label: 'Default', value: '' },
  { label: 'AcmeCorp (Amber)', value: 'acmecorp' },
  { label: 'NovaTech (Purple)', value: 'novatech' },
];
const timezoneOptions = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Asia/Makassar (WITA)', value: 'Asia/Makassar' },
  { label: 'Asia/Jakarta (WIB)', value: 'Asia/Jakarta' },
  { label: 'America/New_York (EST)', value: 'America/New_York' },
];
---
<Shell title="Settings" activePage="settings">
  <Callout intent="info" message="Settings on this page are demo-only. Changes apply to this browser session via localStorage." />

  <div class="grid grid-cols-2 gap-4 mt-4">
    <Card label="Appearance">
      <div class="space-y-4">
        <div>
          <label class="block text-tp-sm text-tp-gray mb-1">Theme</label>
          <Select
            id="settings-theme"
            options={themeOptions}
          />
        </div>
        <div>
          <label class="block text-tp-sm text-tp-gray mb-1">Tenant / Brand</label>
          <Select
            id="settings-tenant"
            options={tenantOptions}
          />
        </div>
        <Button intent="primary" label="Apply Theme" />
      </div>
    </Card>

    <Card label="General">
      <div class="space-y-4">
        <div>
          <label class="block text-tp-sm text-tp-gray mb-1">Organization Name</label>
          <Input placeholder="Enter org name" value="Acme Manufacturing" />
        </div>
        <div>
          <label class="block text-tp-sm text-tp-gray mb-1">Timezone</label>
          <Select options={timezoneOptions} value="Asia/Makassar" />
        </div>
        <div>
          <label class="block text-tp-sm text-tp-gray mb-1">Admin Email</label>
          <Input type="email" placeholder="admin@example.com" value="admin@acme.com" />
        </div>
      </div>
    </Card>

    <Card label="Notifications">
      <div class="space-y-3">
        <Toggle id="notif-offline" label="Node offline alerts" checked={true} />
        <Toggle id="notif-lowstock" label="Low stock alerts" checked={true} />
        <Toggle id="notif-overdue" label="Overdue invoice reminders" checked={false} />
        <Toggle id="notif-digest" label="Daily digest email" checked={true} />
      </div>
    </Card>

    <Card label="Security">
      <div class="space-y-3">
        <Toggle id="sec-2fa" label="Two-factor authentication" checked={true} />
        <Toggle id="sec-sso" label="SSO / SAML login" checked={false} />
        <Toggle id="sec-audit" label="Audit log retention (90 days)" checked={true} />
        <div class="mt-2">
          <Button label="Rotate API Key" />
        </div>
      </div>
    </Card>
  </div>
</Shell>

<script>
  // Wire Settings page theme/tenant selects to live-update html dataset
  const themeSelect = document.getElementById('settings-theme') as HTMLSelectElement | null;
  const tenantSelect = document.getElementById('settings-tenant') as HTMLSelectElement | null;
  if (themeSelect) {
    themeSelect.value = document.documentElement.dataset.theme ?? '';
    themeSelect.onchange = () => {
      document.documentElement.dataset.theme = themeSelect.value;
      localStorage.setItem('tp-theme', themeSelect.value);
      // Sync header select
      const h = document.getElementById('tp-theme-select') as HTMLSelectElement | null;
      if (h) h.value = themeSelect.value;
    };
  }
  if (tenantSelect) {
    tenantSelect.value = document.documentElement.dataset.tenant ?? '';
    tenantSelect.onchange = () => {
      document.documentElement.dataset.tenant = tenantSelect.value;
      localStorage.setItem('tp-tenant', tenantSelect.value);
      const h = document.getElementById('tp-tenant-select') as HTMLSelectElement | null;
      if (h) h.value = tenantSelect.value;
    };
  }
</script>
```

- [ ] **Step 2: Run build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/settings.astro
git commit -m "feat(samples): build Settings page with live theme/tenant switcher"
```

---

## Task 19: Public Images + Final Build

**Files:**
- Create: `samples/tailprint/public/images/` (downloaded files)

- [ ] **Step 1: Download avatar + product images**

```bash
cd samples/tailprint/public/images

# 10 user avatars (32×32)
for i in $(seq 1 10); do
  curl -sL "https://picsum.photos/seed/avatar${i}/32/32" -o "avatar-${i}.jpg"
done

# 8 product images (48×48)
for i in $(seq 1 8); do
  curl -sL "https://picsum.photos/seed/product${i}/48/48" -o "product-${i}.jpg"
done

# 3 warehouse thumbnails (200×120)
for i in $(seq 1 3); do
  curl -sL "https://picsum.photos/seed/warehouse${i}/200/120" -o "warehouse-${i}.jpg"
done
```

Expected: 21 `.jpg` files in `public/images/`.

- [ ] **Step 2: Verify images downloaded**

```bash
ls samples/tailprint/public/images/*.jpg | wc -l
```

Expected: `21`

- [ ] **Step 3: Run final build**

```bash
cd samples/tailprint && npm run build
```

Expected: build passes, `dist/` contains `index.html`, `iot/index.html`, `inventory/index.html`, `finance/index.html`, `warehouse/index.html`, `invoice/index.html`, `settings/index.html`.

- [ ] **Step 4: Verify all pages exist in dist**

```bash
ls samples/tailprint/dist/*/index.html samples/tailprint/dist/index.html
```

Expected: 7 files listed.

- [ ] **Step 5: Commit**

```bash
git add samples/tailprint/public/images/
git commit -m "feat(samples): add picsum reference images for avatars, products, warehouses"
```

- [ ] **Step 6: Final commit — mark samples complete**

```bash
git add samples/tailprint/
git commit -m "feat(samples): TailPrint Astro samples complete — 7 pages, 15 components, static build"
```

---
name: tailprint-builder
description: Build high-density, professional UI pages using the TailPrint design system — Blueprint aesthetic via Tailwind CSS. Use when the user wants to create ERP, IoT monitoring, accounting, warehouse, or any professional admin interface. Activates on prompts like "build a dashboard with TailPrint", "create a data table page", "ERP-style UI", "Blueprint look without BlueprintJS".
---

# TailPrint Builder

TailPrint delivers the BlueprintJS visual aesthetic using only Tailwind CSS. No BlueprintJS dependency. Target: professional ERP, IoT monitoring, accounting, and warehouse management interfaces.

## Core Aesthetic Rules — Never Break

- Corner radius: `rounded-tp` (3px) — never `rounded-lg`, `rounded-xl`, `rounded-full` on controls
- Control height: `h-[30px]` for inputs/selects, `h-7` for buttons
- Data cells: always `font-tp-mono tabular-nums`
- Nav items: `transition-none` — zero animation
- Shadows: inset-style (`shadow-tp-input`, `shadow-tp-button`, `shadow-tp-card`)
- Font: IBM Plex Sans for UI, IBM Plex Mono for data

## Required Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
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
    }
  }
}
```

## CSS Variables (global.css)

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

Tenant swap: `<html data-tenant="novatech">`. Dark mode: `<html data-theme="dark">`.

## Root Layout (app/layout.tsx)

```tsx
// Holy Grail: sidebar + header + main
<div className="flex h-screen bg-tp-bg font-tp-sans">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <TopHeader />
    <main className="flex-1 overflow-auto p-4">
      {children}
    </main>
  </div>
</div>
```

## Component Recipes

### Sidebar
```tsx
<nav className="w-52 bg-[#30404d] text-[#f5f8fa] h-screen flex flex-col flex-shrink-0">
  <div className="h-10 flex items-center px-4 border-b border-white/10 font-semibold text-tp-base">
    AppName
  </div>
  <div className="flex-1 overflow-y-auto py-2">
    <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-tp-base transition-none hover:bg-[#394b59]">
      Item
    </a>
    {/* Active: */}
    <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-tp-base transition-none bg-tp-primary text-white">
      Active Item
    </a>
  </div>
</nav>
```

### Top Header
```tsx
<header className="h-10 bg-white border-b border-tp-border flex items-center px-4 gap-4 flex-shrink-0">
  <span className="text-tp-gray text-tp-sm">Breadcrumb / Path</span>
  <div className="flex-1" />
  <img src="..." className="w-6 h-6 rounded-full" />
</header>
```

### Data Table
```tsx
<table className="w-full border-collapse text-tp-base">
  <thead>
    <tr className="bg-[#ebf1f5]">
      <th className="px-2 h-8 text-left text-tp-xs font-semibold text-tp-gray uppercase tracking-wider border-b border-tp-border">
        Column
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-tp-border">
    <tr className="hover:bg-[#f0f4f7]">
      <td className="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border">
        Data
      </td>
    </tr>
  </tbody>
</table>
```

### Button (Intent-Based)
```tsx
{/* Primary */}
<button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-tp-primary text-white active:shadow-tp-active">
  Action
</button>
{/* Default */}
<button className="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-white text-tp-dark active:shadow-tp-active active:bg-[#d8e1e8]">
  Action
</button>
```

### Input
```tsx
<input className="h-[30px] px-2.5 bg-white shadow-tp-input rounded-tp text-tp-ui outline-none focus:ring-2 focus:ring-tp-primary/50 w-full" />
```

### Badge (Status)
```tsx
{/* Online */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#d5eae2] text-tp-success">online</span>
{/* Offline */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#fbeae5] text-tp-danger">offline</span>
{/* Warning */}
<span className="inline-flex items-center px-1.5 py-0.5 rounded-tp text-tp-xs font-semibold bg-[#fef3e2] text-tp-warning">warning</span>
```

### Card / Stat Block
```tsx
<div className="shadow-tp-card rounded-tp bg-white p-4">
  <div className="text-tp-sm text-tp-gray uppercase tracking-wider mb-1">Label</div>
  <div className="text-2xl font-semibold font-tp-mono tabular-nums text-tp-dark">1,234</div>
  <div className="text-tp-xs text-tp-success mt-1">↑ 12% vs last period</div>
</div>
```

### Callout
```tsx
{/* Success */}
<div className="bg-[#d5eae2] text-tp-success p-3 rounded-tp border-l-4 border-tp-success text-tp-base">
  Message
</div>
{/* Danger */}
<div className="bg-[#fbeae5] text-tp-danger p-3 rounded-tp border-l-4 border-tp-danger text-tp-base">
  Message
</div>
```

### Progress Bar
```tsx
<div className="h-2 bg-[#ebf1f5] rounded-tp overflow-hidden">
  <div className="h-full bg-tp-primary rounded-tp" style={{ width: '67%' }} />
</div>
```

## Density Target

25 rows × 8 columns visible at 1080p without scrolling. Achieve via:
- `h-8` table headers
- `py-1` table rows (not `py-3`)
- `text-tp-base` (13px) in cells, not 16px+

## Anti-Patterns

- DON'T use `rounded-lg` — breaks Blueprint DNA
- DON'T use animation/transition on sidebar nav items
- DON'T use `text-base` (16px) for table cells — use `text-tp-base` (13px)
- DON'T import BlueprintJS — this system is dependency-free
- DON'T use `useClient` for layout components — keep them server-side
- DON'T skip `tabular-nums` on numeric data — columns will misalign

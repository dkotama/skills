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

---

## Interactive Recipes

### Search + Filter Pattern

Wire an input and selects to filter table rows client-side. Add `data-*` attrs to each `<tr>` at build time, then AND-filter on every event.

**Row markup (Astro template):**
```html
<tr
  data-sku={item.sku.toLowerCase()}
  data-name={item.name.toLowerCase()}
  data-category={item.category}
  data-warehouse={item.warehouse}
>
```

**Filter script (in page `<script>`):**
```typescript
const searchInput = document.getElementById('inv-search') as HTMLInputElement | null;
const categorySelect = document.getElementById('inv-category') as HTMLSelectElement | null;
const warehouseSelect = document.getElementById('inv-warehouse') as HTMLSelectElement | null;
const tbody = document.querySelector('#inv-table tbody');

function applyFilters() {
  const q = searchInput?.value.toLowerCase() ?? '';
  const cat = categorySelect?.value ?? '';
  const wh = warehouseSelect?.value ?? '';

  tbody?.querySelectorAll<HTMLTableRowElement>('tr').forEach(row => {
    const matchQ = !q || (row.dataset.sku ?? '').includes(q) || (row.dataset.name ?? '').includes(q);
    const matchCat = !cat || row.dataset.category === cat;
    const matchWh = !wh || row.dataset.warehouse === wh;
    row.style.display = matchQ && matchCat && matchWh ? '' : 'none';
  });
}

searchInput?.addEventListener('input', applyFilters);
categorySelect?.addEventListener('change', applyFilters);
warehouseSelect?.addEventListener('change', applyFilters);
```

**Rules:**
- Add IDs to Input (`id="inv-search"`) and Selects (`id="inv-category"`, `id="inv-warehouse"`)
- Add `id="inv-table"` to `<Table>` component
- Store filter values lowercase on `data-*` for case-insensitive matching

---

### Sort Table Pattern

Use `initSortableTable` from `src/lib/sort-table.ts`. Mark sortable columns with `ColumnDef` objects and add `data-sort-value` to each sortable `<td>`.

**Column definition (in page frontmatter):**
```typescript
import type { ColumnDef } from '../components/ui/Table.astro';

const columns: (string | ColumnDef)[] = [
  { label: 'SKU',      sortType: 'string' },  // sortable
  'Category',                                   // not sortable
  { label: 'Qty',      sortType: 'number' },  // sortable
  { label: 'Due Date', sortType: 'date' },    // sortable
];
```

**Cell markup (add data-sort-value to sortable tds):**
```html
<td data-sort-value={item.qty}>{item.qty.toLocaleString()}</td>
<td data-sort-value={item.dueDate}>{item.dueDate}</td>
```

**Init (in page `<script>`):**
```typescript
import { initSortableTable } from '../lib/sort-table';
initSortableTable('my-table-id');
```

**Rules:**
- `data-sort-value` must be the raw comparable value (number as number, ISO date string for dates)
- Add `id` prop to `<Table id="my-table-id">` component
- Sort type `'number'` uses `parseFloat`, `'date'` uses `new Date().getTime()`, `'string'` uses `localeCompare`
- Sort cycles asc → desc → asc; clicking a different column resets others

---

### ApexCharts Integration

ApexCharts is loaded once via CDN in `Shell.astro`. Chart data is computed server-side in Astro frontmatter and passed to inline scripts via `define:vars`.

**CDN (already in Shell.astro `<head>`):**
```html
<script is:inline src="https://cdn.jsdelivr.net/npm/apexcharts@3.54.0/dist/apexcharts.min.js"></script>
```

**Data injection pattern (in page):**
```astro
---
// Compute data in frontmatter
const chartData = {
  categories: ['A', 'B', 'C'],
  values: [10, 20, 30],
};
---
<div id="my-chart" class="h-56"></div>

<script is:inline define:vars={{ chartData }}>
  new ApexCharts(document.getElementById('my-chart'), {
    chart: { type: 'bar', height: 224, fontFamily: '"IBM Plex Sans", system-ui', toolbar: { show: false } },
    series: [{ name: 'Value', data: chartData.values }],
    xaxis: { categories: chartData.categories },
    colors: ['#137cbd'],
    grid: { borderColor: '#d8e1e8', strokeDashArray: 3 },
    dataLabels: { enabled: false },
  }).render();
</script>
```

**TailPrint color palette for charts:**
| Token | Hex | Use |
|-------|-----|-----|
| Primary (default) | `#137cbd` | Main series |
| Success | `#0f9960` | Online / credit / positive |
| Danger | `#db3737` | Offline / debit / negative |
| Warning | `#d9822b` | Warning states |
| Gray | `#5c7080` | Neutral / draft |
| Border | `#d8e1e8` | Grid lines |

**Note:** ApexCharts does not support CSS variables in color arrays. Use hex values from the table above. Tenant theme changes do NOT auto-update chart colors — charts use default TailPrint palette regardless of active tenant.

**Chart types used in samples:**
- `bar` (horizontal, `plotOptions.bar.horizontal: true`) — IoT status by warehouse
- `bar` (vertical, grouped) — Inventory by category, Finance cost centers
- `donut` — Invoice AR aging

**Rules:**
- Always use `is:inline` on the chart `<script>` when using `define:vars`
- Never import ApexCharts from npm — CDN only (already loaded globally)
- Compute all data in frontmatter — never fetch in script
- Container div needs explicit height (`h-56` = 224px minimum for readability)

# TailPrint Interactivity & Charts — Design Spec

**Date:** 2026-05-07
**Status:** Approved
**Version:** 1.0.0

---

## 1. Goal

Make existing TailPrint sample pages fully interactive (search, filters, table sorting) and add a dedicated charts page using ApexCharts. Document all interaction patterns in the tailprint-builder skill for AI reuse.

---

## 2. Scope

| Feature | Files Touched |
|---------|--------------|
| Inventory search + filter fix | `src/pages/inventory.astro` |
| Table sorting (all tables) | `src/lib/sort-table.ts` (new), `src/pages/iot.astro`, `src/pages/inventory.astro`, `src/pages/finance.astro`, `src/pages/invoice.astro` |
| Charts page | `src/pages/charts.astro` (new), `src/layouts/Shell.astro` (ApexCharts CDN), `src/components/ui/Sidebar.astro` (nav link) |
| Skill update | `skills/tailprint-builder/tailprint-builder.md` |

---

## 3. Inventory Search + Filter

### 3.1 Problem

`inventory.astro` has an `<Input>` for search and two `<Select>` components for category/warehouse filtering. None are wired to JS — the table never changes.

### 3.2 Solution

Add `data-*` attributes to every `<tr>` at build time, wire an inline `<script>` that AND-filters on every input/change event.

**Row attributes (set in Astro frontmatter template):**
```html
<tr data-sku="SKU-0001" data-name="Resistor 10Ω" data-category="Electronics" data-warehouse="WH-A">
```

**Filter logic (inline `<script>` in inventory.astro):**
```ts
function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;
  const wh = warehouseSelect.value;

  rows.forEach(row => {
    const matchQ = !q || row.dataset.sku!.includes(q) || row.dataset.name!.toLowerCase().includes(q);
    const matchCat = !cat || row.dataset.category === cat;
    const matchWh = !wh || row.dataset.warehouse === wh;
    row.style.display = matchQ && matchCat && matchWh ? '' : 'none';
  });
}

searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);
warehouseSelect.addEventListener('change', applyFilters);
```

**IDs required:** `<Input id="inv-search">`, `<Select id="inv-category">`, `<Select id="inv-warehouse">`.

---

## 4. Table Sorting

### 4.1 Shared Util

**File:** `src/lib/sort-table.ts`

```ts
export type SortType = 'string' | 'number' | 'date';

export function initSortableTable(tableId: string) {
  // Attaches click handlers to all <th data-col data-type> headers.
  // Cycles: none → asc → desc → asc.
  // Reads sort value from td[data-sort-value] attribute.
  // Sets aria-sort on header, shows ▲/▼ indicator span.
}
```

### 4.2 Column Header Markup

Each sortable `<th>` gets:
```html
<th data-col="0" data-type="string" data-sort="none">
  Node ID <span class="sort-indicator text-tp-xs ml-1"></span>
</th>
```

### 4.3 Row Cell Markup

Each sortable `<td>` gets `data-sort-value` set to the raw value for comparison:
```html
<td data-sort-value="18">18</td>       <!-- number -->
<td data-sort-value="2026-05-07">...</td>  <!-- date -->
<td data-sort-value="NODE-001">...</td>    <!-- string -->
```

### 4.4 Per-Page Sortable Columns

| Page | Sortable Columns (type) |
|------|------------------------|
| IoT Monitor | Node ID (string), Temp °C (number), Humidity % (number), Power W (number) |
| Inventory | SKU (string), Qty (number), Reorder Pt (number), Unit Cost (number) |
| Finance | Date (date), Debit (number), Credit (number), Balance (number) |
| Invoice | Invoice # (string), Amount (number), Due Date (date) |

### 4.5 Visual Indicator

Active sort column header: `text-tp-primary font-semibold`. Indicator span: `▲` (asc) or `▼` (desc), clears on reset.

---

## 5. Charts Page

### 5.1 Route

`/charts` — added to Sidebar nav between Dashboard and IoT Monitor.

### 5.2 ApexCharts Integration

Load ApexCharts once via CDN in `Shell.astro <head>`:
```html
<script is:inline src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

Data injected server-side in `charts.astro` frontmatter, passed to inline scripts as JSON:
```astro
<script is:inline define:vars={{ iotData, inventoryData, financeData, invoiceData }}>
  // ApexCharts init here
</script>
```

### 5.3 TailPrint ApexCharts Theme

Shared options applied to all charts:
```js
const tpTheme = {
  fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
  fontSize: '12px',
  toolbar: { show: false },
  colors: ['var(--tp-accent)', '#0f9960', '#db3737', '#d9822b'],
  grid: { borderColor: '#d8e1e8' },
  dataLabels: { enabled: false },
};
```

### 5.4 Four Charts

| Chart | Type | Data | Key Metric |
|-------|------|------|------------|
| IoT Sensor Status | Grouped bar (horizontal) | Online/warning/offline count per warehouse | Node health by location |
| Inventory by Category | Vertical bar | Total qty per category (8 bars) | Low-stock categories highlighted in danger color |
| Finance Cost Centers | Grouped bar | Debit vs credit per cost center (3 groups) | Which center is over/under budget |
| Invoice AR Aging | Donut | Count of paid/overdue/pending/draft | AR health at a glance |

Each chart rendered in a `<Card>` with `label` prop. Chart container: `<div id="chart-X" class="h-48"></div>`.

### 5.5 Page Layout

```
/charts
┌─────────────────────────────────────────────┐
│ Stat row: 4 StatBlocks (summary numbers)    │
├──────────────────┬──────────────────────────┤
│ IoT Status Chart │ Inventory Category Chart  │
├──────────────────┼──────────────────────────┤
│ Finance Chart    │ Invoice AR Donut          │
└──────────────────┴──────────────────────────┘
```

2×2 grid of Cards, each containing one ApexCharts instance.

---

## 6. tailprint-builder Skill Update

Add three new sections to `skills/tailprint-builder/tailprint-builder.md`:

### 6.1 Search + Filter Pattern

Documents the `data-*` attribute approach, applyFilters pattern, required element IDs.

### 6.2 Sort Table Pattern

Documents `sort-table.ts` import, `data-col`/`data-type`/`data-sort-value` attributes, initSortableTable call.

### 6.3 ApexCharts Integration

Documents CDN script tag placement, `define:vars` data injection pattern, TailPrint theme object, chart container sizing.

---

## 7. Anti-Patterns (enforced)

- No npm install of ApexCharts — CDN only (keeps build simple)
- No global state — each page's script is isolated
- No re-fetching data — all chart data computed at build time in frontmatter
- `define:vars` for passing server data to inline scripts — never hardcode in script body

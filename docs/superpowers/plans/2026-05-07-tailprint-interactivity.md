# TailPrint Interactivity & Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire inventory search/filters, add click-to-sort on all 4 tables, build an ApexCharts analytics page at `/charts`, and document all patterns in the tailprint-builder skill.

**Architecture:** Client-side JS only (static Astro output). Shared `sort-table.ts` imported via Astro `<script>` (Vite-bundled). Inventory filter uses inline `data-*` attrs + event listeners. ApexCharts loaded from CDN once in Shell.astro head; data passed server-side via `define:vars`.

**Tech Stack:** Astro 4.x, TypeScript, ApexCharts 3.x (CDN), Tailwind CSS 3.x, zero npm additions.

---

## File Map

```
samples/tailprint/src/
├── lib/
│   └── sort-table.ts              ← NEW: shared sort utility
├── layouts/
│   └── Shell.astro                ← MOD: add ApexCharts CDN <script>
├── components/ui/
│   └── Table.astro                ← MOD: add ColumnDef type, id prop, sortable <th>
├── pages/
│   ├── inventory.astro            ← MOD: ids, data-* attrs, filter+sort script
│   ├── iot.astro                  ← MOD: data-sort-value on tds, sort columns, init
│   ├── finance.astro              ← MOD: data-sort-value on tds, sort columns, init
│   ├── invoice.astro              ← MOD: data-sort-value on tds, sort columns, init
│   └── charts.astro               ← NEW: ApexCharts page (4 charts)
└── components/ui/
    └── Sidebar.astro              ← MOD: add Charts nav link
skills/tailprint-builder/
└── tailprint-builder.md           ← MOD: document 3 new patterns
```

---

## Task 1: Update Table.astro — ColumnDef + id + sortable headers

**Files:**
- Modify: `samples/tailprint/src/components/ui/Table.astro`

The `Table` component must export a `ColumnDef` type and accept `(string | ColumnDef)[]` columns so pages can mark individual columns as sortable. A sortable `<th>` gets `data-col`, `data-type`, `data-sort="none"` attributes and a `.sort-indicator` span. The `id` prop goes on `<table>` so `initSortableTable` can find it by id.

- [ ] **Step 1: Replace Table.astro with updated version**

```astro
---
export interface ColumnDef {
  label: string;
  sortType?: 'string' | 'number' | 'date';
}

interface Props {
  columns: (string | ColumnDef)[];
  id?: string;
  stickyHeader?: boolean;
}
const { columns, id, stickyHeader = true } = Astro.props;
---
<div class="overflow-auto rounded-tp shadow-tp-card">
  <table id={id} class="w-full border-collapse text-tp-base">
    <thead class={stickyHeader ? 'sticky top-0 z-10' : ''}>
      <tr class="bg-[#ebf1f5]">
        {columns.map((col, i) => {
          const def = typeof col === 'string' ? { label: col } : col;
          const sortable = !!def.sortType;
          return (
            <th
              class={`px-2 h-8 text-left text-tp-xs font-semibold text-tp-gray uppercase tracking-wider border-b border-tp-border whitespace-nowrap${sortable ? ' cursor-pointer select-none hover:text-tp-dark' : ''}`}
              data-col={sortable ? String(i) : undefined}
              data-type={sortable ? def.sortType : undefined}
              data-sort={sortable ? 'none' : undefined}
            >
              {def.label}
              {sortable && <span class="sort-indicator normal-case ml-1 text-tp-xs"></span>}
            </th>
          );
        })}
      </tr>
    </thead>
    <tbody class="divide-y divide-tp-border bg-white">
      <slot />
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Verify build still passes (existing pages use string[] — must still work)**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: `7 page(s) built`, no errors.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/components/ui/Table.astro
git commit -m "feat(samples): update Table component with ColumnDef, id, sortable headers"
```

---

## Task 2: Create sort-table.ts

**Files:**
- Create: `samples/tailprint/src/lib/sort-table.ts`

Single exported function. Attaches click handlers to all `th[data-col]` headers within the table. Reads sort value from `td[data-sort-value]` attribute (falls back to textContent). Cycles asc → desc → asc. Updates `.sort-indicator` span and adds `text-tp-primary font-semibold` to active header.

- [ ] **Step 1: Create src/lib/sort-table.ts**

```typescript
export type SortType = 'string' | 'number' | 'date';
export type SortDir = 'asc' | 'desc';

export function initSortableTable(tableId: string): void {
  const table = document.getElementById(tableId) as HTMLTableElement | null;
  if (!table) return;

  const headers = Array.from(table.querySelectorAll<HTMLElement>('th[data-col]'));
  const tbody = table.querySelector('tbody');
  if (!tbody || headers.length === 0) return;

  headers.forEach(th => {
    th.addEventListener('click', () => {
      const col = parseInt(th.dataset.col!);
      const type = (th.dataset.type ?? 'string') as SortType;
      const current = th.dataset.sort as SortDir | 'none';
      const next: SortDir = current === 'asc' ? 'desc' : 'asc';

      // Reset all sortable headers
      headers.forEach(h => {
        h.dataset.sort = 'none';
        h.classList.remove('text-tp-primary', 'font-semibold');
        const ind = h.querySelector('.sort-indicator');
        if (ind) ind.textContent = '';
      });

      // Mark active header
      th.dataset.sort = next;
      th.classList.add('text-tp-primary', 'font-semibold');
      const indicator = th.querySelector('.sort-indicator');
      if (indicator) indicator.textContent = next === 'asc' ? '▲' : '▼';

      // Sort tbody rows
      const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr:not([style*="display: none"])'));
      const allRows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));

      allRows.sort((a, b) => {
        const aCell = a.querySelectorAll('td')[col];
        const bCell = b.querySelectorAll('td')[col];
        const aRaw = aCell?.dataset.sortValue ?? aCell?.textContent?.trim() ?? '';
        const bRaw = bCell?.dataset.sortValue ?? bCell?.textContent?.trim() ?? '';

        let cmp = 0;
        if (type === 'number') {
          cmp = (parseFloat(aRaw) || 0) - (parseFloat(bRaw) || 0);
        } else if (type === 'date') {
          cmp = new Date(aRaw).getTime() - new Date(bRaw).getTime();
        } else {
          cmp = aRaw.localeCompare(bRaw, undefined, { numeric: true });
        }
        return next === 'asc' ? cmp : -cmp;
      });

      allRows.forEach(row => tbody.appendChild(row));
    });
  });
}
```

- [ ] **Step 2: Run type check**

```bash
cd samples/tailprint && npm run check 2>&1 | tail -4
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/lib/sort-table.ts
git commit -m "feat(samples): add shared sort-table utility"
```

---

## Task 3: Wire Inventory Search + Filters + Sorting

**Files:**
- Modify: `samples/tailprint/src/pages/inventory.astro`

Changes: (1) add `id` props to Input and Selects, (2) add `id="inv-table"` to Table, (3) update columns to ColumnDef for sortable columns, (4) add `data-*` filter attrs and `data-sort-value` to each `<tr>`/`<td>`, (5) add filter + sort `<script>`.

- [ ] **Step 1: Replace inventory.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import type { ColumnDef } from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Input from '../components/ui/Input.astro';
import Select from '../components/ui/Select.astro';
import { inventory } from '../data/inventory';

const columns: (string | ColumnDef)[] = [
  '',
  { label: 'SKU',        sortType: 'string' },
  'Name',
  'Category',
  'Warehouse',
  'Zone',
  'Bin',
  { label: 'Qty',        sortType: 'number' },
  { label: 'Reorder Pt', sortType: 'number' },
  { label: 'Unit Cost',  sortType: 'number' },
  'Status',
];

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
    <Input id="inv-search" placeholder="Search SKU or name…" />
    <Select id="inv-category" options={categoryOptions} />
    <Select id="inv-warehouse" options={warehouseOptions} />
  </div>

  <Table id="inv-table" columns={columns}>
    {inventory.map(item => {
      const belowReorder = item.qty < item.reorderPoint;
      return (
        <tr
          class="hover:bg-[#f0f4f7]"
          data-sku={item.sku.toLowerCase()}
          data-name={item.name.toLowerCase()}
          data-category={item.category}
          data-warehouse={item.warehouse}
        >
          <td class="px-2 py-1 border-r border-tp-border w-6">
            <input type="checkbox" class="w-3 h-3" />
          </td>
          <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border" data-sort-value={item.sku}>{item.sku}</td>
          <td class="px-2 py-1 text-tp-dark border-r border-tp-border whitespace-nowrap">{item.name}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.category}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.warehouse}</td>
          <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{item.zone}</td>
          <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border">{item.bin}</td>
          <td class={`px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right ${belowReorder ? 'text-tp-danger font-semibold' : 'text-tp-dark'}`} data-sort-value={item.qty}>
            {item.qty.toLocaleString()}
          </td>
          <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right text-tp-gray" data-sort-value={item.reorderPoint}>{item.reorderPoint}</td>
          <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right" data-sort-value={item.unitCost}>${item.unitCost.toFixed(2)}</td>
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

<script>
  import { initSortableTable } from '../lib/sort-table';

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

  initSortableTable('inv-table');
</script>
```

- [ ] **Step 2: Build and verify**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: build passes, no errors.

- [ ] **Step 3: Dev test — open in browser and verify**

```bash
cd samples/tailprint && npm run dev
```

Open `http://localhost:4321/inventory`. Verify:
- Typing "SKU-0001" in search hides all other rows
- Selecting "Electronics" in category dropdown filters table
- Clicking "Qty" column header sorts ascending then descending
- Filters + sort work simultaneously

- [ ] **Step 4: Commit**

```bash
git add samples/tailprint/src/pages/inventory.astro
git commit -m "feat(samples): wire inventory search, category/warehouse filters, and column sort"
```

---

## Task 4: Add Sorting to IoT Monitor Page

**Files:**
- Modify: `samples/tailprint/src/pages/iot.astro`

- [ ] **Step 1: Replace iot.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import type { ColumnDef } from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Callout from '../components/ui/Callout.astro';
import Toggle from '../components/ui/Toggle.astro';
import ProgressBar from '../components/ui/ProgressBar.astro';
import { iotNodes } from '../data/iot-nodes';

const offlineCount = iotNodes.filter(n => n.status === 'offline').length;

const columns: (string | ColumnDef)[] = [
  { label: 'Node ID',     sortType: 'string' },
  'Warehouse',
  'Type',
  'Status',
  { label: 'Temp °C',    sortType: 'number' },
  { label: 'Humidity %', sortType: 'number' },
  { label: 'Vibration g',sortType: 'number' },
  { label: 'Power W',    sortType: 'number' },
  'Last Seen',
];
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

  <Table id="iot-table" columns={columns}>
    {iotNodes.map(node => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border" data-sort-value={node.id}>{node.id}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{node.warehouse}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border capitalize">{node.sensorType}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge status={node.status} />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right" data-sort-value={node.temperature}>{node.temperature}</td>
        <td class="px-2 py-1 border-r border-tp-border w-24" data-sort-value={node.humidity}>
          <ProgressBar value={node.humidity} intent={node.humidity > 80 ? 'warning' : 'default'} />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right" data-sort-value={node.vibration}>{node.vibration.toFixed(2)}</td>
        <td class="px-2 py-1 font-tp-mono tabular-nums border-r border-tp-border text-right" data-sort-value={node.powerDraw}>{node.powerDraw}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray text-tp-xs">{node.lastSeen}</td>
      </tr>
    ))}
  </Table>
</Shell>

<script>
  import { initSortableTable } from '../lib/sort-table';
  initSortableTable('iot-table');
</script>
```

- [ ] **Step 2: Build**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: passes, no errors.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/iot.astro
git commit -m "feat(samples): add column sorting to IoT Monitor table"
```

---

## Task 5: Add Sorting to Finance Page

**Files:**
- Modify: `samples/tailprint/src/pages/finance.astro`

- [ ] **Step 1: Replace finance.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import type { ColumnDef } from '../components/ui/Table.astro';
import Tabs from '../components/ui/Tabs.astro';
import Badge from '../components/ui/Badge.astro';
import { financeEntries } from '../data/finance';

const tabs = [
  { label: 'All Entries',    href: '/finance' },
  { label: 'Manufacturing',  href: '/finance' },
  { label: 'Logistics',      href: '/finance' },
  { label: 'Admin',          href: '/finance' },
];

const columns: (string | ColumnDef)[] = [
  'Journal ID',
  { label: 'Date',    sortType: 'date' },
  'Description',
  'Cost Center',
  'Type',
  { label: 'Debit',   sortType: 'number' },
  { label: 'Credit',  sortType: 'number' },
  { label: 'Balance', sortType: 'number' },
];

const totalDebit = financeEntries.reduce((s, e) => s + e.debit, 0);
const totalCredit = financeEntries.reduce((s, e) => s + e.credit, 0);

const typeBadge: Record<string, 'online' | 'offline' | 'warning' | 'error'> = {
  sales: 'online',
  payroll: 'warning',
  purchase: 'offline',
  depreciation: 'error',
};
---
<Shell title="Finance / GL Journal" activePage="finance">
  <div class="flex items-center justify-between mb-3">
    <nav class="text-tp-sm text-tp-gray">
      Finance <span class="mx-1">/</span>
      <span class="text-tp-dark font-medium">GL Journal</span>
    </nav>
    <div class="flex gap-4 text-tp-sm">
      <span class="text-tp-gray">Total Debit:
        <span class="font-tp-mono tabular-nums text-tp-dark">${totalDebit.toLocaleString()}</span>
      </span>
      <span class="text-tp-gray">Total Credit:
        <span class="font-tp-mono tabular-nums text-tp-success">${totalCredit.toLocaleString()}</span>
      </span>
    </div>
  </div>

  <Tabs tabs={tabs} active="All Entries" />

  <Table id="finance-table" columns={columns}>
    {financeEntries.map(entry => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border">{entry.id}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border" data-sort-value={entry.date}>{entry.date}</td>
        <td class="px-2 py-1 text-tp-dark border-r border-tp-border">{entry.description}</td>
        <td class="px-2 py-1 text-tp-gray border-r border-tp-border">{entry.costCenter}</td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge status={typeBadge[entry.type]} label={entry.type} />
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-danger" data-sort-value={entry.debit}>
          {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '—'}
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-success" data-sort-value={entry.credit}>
          {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '—'}
        </td>
        <td class={`px-2 py-1 font-tp-mono tabular-nums text-right ${entry.balance < 0 ? 'text-tp-danger' : 'text-tp-dark'}`} data-sort-value={entry.balance}>
          ${entry.balance.toLocaleString()}
        </td>
      </tr>
    ))}
  </Table>
</Shell>

<script>
  import { initSortableTable } from '../lib/sort-table';
  initSortableTable('finance-table');
</script>
```

- [ ] **Step 2: Build**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/finance.astro
git commit -m "feat(samples): add column sorting to Finance GL Journal table"
```

---

## Task 6: Add Sorting to Invoice Page

**Files:**
- Modify: `samples/tailprint/src/pages/invoice.astro`

- [ ] **Step 1: Replace invoice.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Table from '../components/ui/Table.astro';
import type { ColumnDef } from '../components/ui/Table.astro';
import Badge from '../components/ui/Badge.astro';
import Tabs from '../components/ui/Tabs.astro';
import Modal from '../components/ui/Modal.astro';
import Button from '../components/ui/Button.astro';
import { invoices } from '../data/invoices';

const tabs = [
  { label: 'All',     href: '/invoice' },
  { label: 'Overdue', href: '/invoice' },
  { label: 'Pending', href: '/invoice' },
  { label: 'Paid',    href: '/invoice' },
];

const columns: (string | ColumnDef)[] = [
  { label: 'Invoice #', sortType: 'string' },
  'Client',
  'Issued',
  { label: 'Due Date', sortType: 'date' },
  { label: 'Amount',   sortType: 'number' },
  'Status',
  '',
];

const statusBadge: Record<string, 'online' | 'offline' | 'warning' | 'error'> = {
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

  <Table id="invoice-table" columns={columns}>
    {invoices.map(inv => (
      <tr class="hover:bg-[#f0f4f7]">
        <td class="px-2 py-1 font-tp-mono tabular-nums text-tp-dark border-r border-tp-border" data-sort-value={inv.id}>{inv.id}</td>
        <td class="px-2 py-1 text-tp-dark border-r border-tp-border">{inv.client}</td>
        <td class="px-2 py-1 font-tp-mono text-tp-gray border-r border-tp-border">{inv.issuedDate}</td>
        <td class={`px-2 py-1 font-tp-mono border-r border-tp-border ${inv.status === 'overdue' ? 'text-tp-danger font-semibold' : 'text-tp-gray'}`} data-sort-value={inv.dueDate}>
          {inv.dueDate}
        </td>
        <td class="px-2 py-1 font-tp-mono tabular-nums text-right border-r border-tp-border text-tp-dark" data-sort-value={inv.amount}>
          ${inv.amount.toLocaleString()}
        </td>
        <td class="px-2 py-1 border-r border-tp-border">
          <Badge status={statusBadge[inv.status]} label={inv.status} />
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
              <div class="flex justify-between">
                <span class="text-tp-gray">Amount</span>
                <span class="font-tp-mono tabular-nums">${inv.amount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-tp-gray">Issued</span>
                <span class="font-tp-mono">{inv.issuedDate}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-tp-gray">Due</span>
                <span class="font-tp-mono">{inv.dueDate}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-tp-gray">Status</span>
                <Badge status={statusBadge[inv.status]} label={inv.status} />
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button
                onclick={`closeModal('modal-${inv.id}')`}
                class="h-7 px-3 rounded-tp shadow-tp-button text-tp-base font-medium bg-white text-tp-dark"
              >Close</button>
              <Button intent="primary" label="Mark Paid" />
            </div>
          </Modal>
        </td>
      </tr>
    ))}
  </Table>
</Shell>

<script>
  import { initSortableTable } from '../lib/sort-table';
  initSortableTable('invoice-table');
</script>
```

- [ ] **Step 2: Build**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add samples/tailprint/src/pages/invoice.astro
git commit -m "feat(samples): add column sorting to Invoice/AR table"
```

---

## Task 7: Add ApexCharts CDN + Charts Nav Link

**Files:**
- Modify: `samples/tailprint/src/layouts/Shell.astro`
- Modify: `samples/tailprint/src/components/ui/Sidebar.astro`

- [ ] **Step 1: Add ApexCharts CDN to Shell.astro `<head>`**

In `Shell.astro`, add after the anti-flash script:

```astro
    <!-- Anti-flash: reads localStorage before body paint -->
    <script is:inline>
      (function () {
        var t = localStorage.getItem('tp-theme');
        var n = localStorage.getItem('tp-tenant');
        if (t) document.documentElement.dataset.theme = t;
        if (n) document.documentElement.dataset.tenant = n;
      })();
    </script>
    <script is:inline src="https://cdn.jsdelivr.net/npm/apexcharts@3.54.0/dist/apexcharts.min.js"></script>
```

- [ ] **Step 2: Add Charts nav item to Sidebar.astro**

In `Sidebar.astro`, insert Charts link between Dashboard and IoT Monitor:

```typescript
const navItems = [
  { label: 'Dashboard',    href: '/',           key: 'dashboard' },
  { label: 'Charts',       href: '/charts',     key: 'charts' },
  { label: 'IoT Monitor',  href: '/iot',         key: 'iot' },
  { label: 'Inventory',    href: '/inventory',   key: 'inventory' },
  { label: 'Finance',      href: '/finance',     key: 'finance' },
  { label: 'Warehouse',    href: '/warehouse',   key: 'warehouse' },
  { label: 'Invoice / AR', href: '/invoice',     key: 'invoice' },
  { label: 'Settings',     href: '/settings',    key: 'settings' },
];
```

- [ ] **Step 3: Build**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add samples/tailprint/src/layouts/Shell.astro samples/tailprint/src/components/ui/Sidebar.astro
git commit -m "feat(samples): add ApexCharts CDN to Shell, add Charts nav link"
```

---

## Task 8: Build Charts Page

**Files:**
- Create: `samples/tailprint/src/pages/charts.astro`

All chart data computed server-side in frontmatter. Passed to `<script is:inline define:vars={...}>`. Each chart in a `<Card>` with `h-56` container div.

- [ ] **Step 1: Create src/pages/charts.astro**

```astro
---
import Shell from '../layouts/Shell.astro';
import Card from '../components/ui/Card.astro';
import StatBlock from '../components/ui/StatBlock.astro';
import { iotNodes } from '../data/iot-nodes';
import { inventory } from '../data/inventory';
import { financeEntries } from '../data/finance';
import { invoices } from '../data/invoices';

// IoT: count per warehouse per status
const whs = ['WH-A', 'WH-B', 'WH-C'];
const iotChart = {
  categories: whs,
  online:  whs.map(w => iotNodes.filter(n => n.warehouse === w && n.status === 'online').length),
  warning: whs.map(w => iotNodes.filter(n => n.warehouse === w && n.status === 'warning').length),
  offline: whs.map(w => iotNodes.filter(n => n.warehouse === w && n.status === 'offline').length),
};

// Inventory: total qty + low stock count per category
const cats = ['Electronics','Mechanical','Chemical','Textile','Packaging','Tools','Safety','Office'];
const invChart = {
  categories: cats,
  totalQty:  cats.map(c => inventory.filter(i => i.category === c).reduce((s, i) => s + i.qty, 0)),
  lowStock:  cats.map(c => inventory.filter(i => i.category === c && i.qty < i.reorderPoint).length),
};

// Finance: debit vs credit per cost center
const centers = ['Manufacturing', 'Logistics', 'Admin'];
const finChart = {
  categories: centers,
  debit:  centers.map(c => Math.round(financeEntries.filter(e => e.costCenter === c).reduce((s, e) => s + e.debit, 0))),
  credit: centers.map(c => Math.round(financeEntries.filter(e => e.costCenter === c).reduce((s, e) => s + e.credit, 0))),
};

// Invoice AR aging: count per status
const arChart = {
  labels: ['Paid', 'Overdue', 'Pending', 'Draft'],
  series: [
    invoices.filter(i => i.status === 'paid').length,
    invoices.filter(i => i.status === 'overdue').length,
    invoices.filter(i => i.status === 'pending').length,
    invoices.filter(i => i.status === 'draft').length,
  ],
};

// Summary stats
const totalNodes = iotNodes.length;
const onlineNodes = iotNodes.filter(n => n.status === 'online').length;
const totalSkus = inventory.length;
const lowStockSkus = inventory.filter(i => i.qty < i.reorderPoint).length;
const totalAR = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
const overdueAR = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
---
<Shell title="Analytics / Charts" activePage="charts">
  <div class="grid grid-cols-4 gap-3 mb-4">
    <StatBlock label="Nodes Online" value={`${onlineNodes}/${totalNodes}`} delta="sensor health" trend="up" />
    <StatBlock label="Low Stock SKUs" value={String(lowStockSkus)} delta={`of ${totalSkus} total`} trend="down" />
    <StatBlock label="Open AR" value={`$${totalAR.toLocaleString()}`} delta="outstanding" trend="up" />
    <StatBlock label="Overdue AR" value={`$${overdueAR.toLocaleString()}`} delta="past due" trend="down" />
  </div>

  <div class="grid grid-cols-2 gap-4">
    <Card label="IoT Node Status by Warehouse">
      <div id="chart-iot" class="h-56"></div>
    </Card>

    <Card label="Inventory Qty by Category">
      <div id="chart-inventory" class="h-56"></div>
    </Card>

    <Card label="Finance: Debit vs Credit by Cost Center">
      <div id="chart-finance" class="h-56"></div>
    </Card>

    <Card label="Invoice AR Aging">
      <div id="chart-ar" class="h-56"></div>
    </Card>
  </div>
</Shell>

<script is:inline define:vars={{ iotChart, invChart, finChart, arChart }}>
  const tpFont = '"IBM Plex Sans", system-ui, sans-serif';
  const tpMono = '"IBM Plex Mono", monospace';
  const tpGrid = { borderColor: '#d8e1e8', strokeDashArray: 3 };
  const tpToolbar = { show: false };

  // IoT Status — horizontal grouped bar
  new ApexCharts(document.getElementById('chart-iot'), {
    chart: { type: 'bar', height: 224, fontFamily: tpFont, toolbar: tpToolbar },
    plotOptions: { bar: { horizontal: true, columnWidth: '60%', dataLabels: { position: 'top' } } },
    series: [
      { name: 'Online',  data: iotChart.online },
      { name: 'Warning', data: iotChart.warning },
      { name: 'Offline', data: iotChart.offline },
    ],
    xaxis: { categories: iotChart.categories, labels: { style: { fontSize: '11px', fontFamily: tpFont } } },
    colors: ['#0f9960', '#d9822b', '#db3737'],
    grid: tpGrid,
    dataLabels: { enabled: false },
    legend: { fontSize: '12px', fontFamily: tpFont },
  }).render();

  // Inventory by Category — vertical grouped bar
  new ApexCharts(document.getElementById('chart-inventory'), {
    chart: { type: 'bar', height: 224, fontFamily: tpFont, toolbar: tpToolbar },
    series: [
      { name: 'Total Qty',  data: invChart.totalQty },
      { name: 'Low Stock',  data: invChart.lowStock },
    ],
    xaxis: {
      categories: invChart.categories,
      labels: { rotate: -30, style: { fontSize: '10px', fontFamily: tpFont } },
    },
    colors: ['#137cbd', '#db3737'],
    grid: tpGrid,
    dataLabels: { enabled: false },
    legend: { fontSize: '12px', fontFamily: tpFont },
  }).render();

  // Finance — grouped bar debit vs credit
  new ApexCharts(document.getElementById('chart-finance'), {
    chart: { type: 'bar', height: 224, fontFamily: tpFont, toolbar: tpToolbar },
    series: [
      { name: 'Debit',  data: finChart.debit },
      { name: 'Credit', data: finChart.credit },
    ],
    xaxis: { categories: finChart.categories, labels: { style: { fontSize: '11px', fontFamily: tpFont } } },
    colors: ['#db3737', '#0f9960'],
    grid: tpGrid,
    dataLabels: { enabled: false },
    yaxis: { labels: { formatter: (v) => '$' + v.toLocaleString(), style: { fontSize: '11px', fontFamily: tpMono } } },
    legend: { fontSize: '12px', fontFamily: tpFont },
  }).render();

  // Invoice AR — donut
  new ApexCharts(document.getElementById('chart-ar'), {
    chart: { type: 'donut', height: 224, fontFamily: tpFont },
    series: arChart.series,
    labels: arChart.labels,
    colors: ['#0f9960', '#db3737', '#d9822b', '#5c7080'],
    legend: { position: 'bottom', fontSize: '12px', fontFamily: tpFont },
    dataLabels: { style: { fontSize: '11px', fontFamily: tpFont } },
    plotOptions: { pie: { donut: { size: '60%' } } },
  }).render();
</script>
```

- [ ] **Step 2: Build**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -5
```

Expected: `8 page(s) built`, no errors.

- [ ] **Step 3: Dev verify charts render**

```bash
cd samples/tailprint && npm run dev
```

Open `http://localhost:4321/charts`. Verify all 4 charts render with TailPrint colors.

- [ ] **Step 4: Commit**

```bash
git add samples/tailprint/src/pages/charts.astro
git commit -m "feat(samples): add ApexCharts analytics page with 4 charts"
```

---

## Task 9: Update tailprint-builder Skill

**Files:**
- Modify: `skills/tailprint-builder/tailprint-builder.md`

Append three new recipe sections after the existing Anti-Patterns section.

- [ ] **Step 1: Append to skills/tailprint-builder/tailprint-builder.md**

Add at the end of the file:

```markdown
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
```

- [ ] **Step 2: Run build to verify no regressions**

```bash
cd samples/tailprint && npm run build 2>&1 | tail -4
```

Expected: `8 page(s) built`, no errors.

- [ ] **Step 3: Commit**

```bash
git add skills/tailprint-builder/tailprint-builder.md
git commit -m "feat(skill): document search/filter, sort-table, and ApexCharts patterns in tailprint-builder"
```

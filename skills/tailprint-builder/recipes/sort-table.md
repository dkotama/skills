# TailPrint — Sort Table Pattern

Uses shared `src/lib/sort-table.ts` utility. Mark sortable columns with `ColumnDef`, add `data-sort-value` to cells, call `initSortableTable`.

## Column Definition (page frontmatter)

```typescript
import type { ColumnDef } from '../components/ui/Table.astro';

const columns: (string | ColumnDef)[] = [
  { label: 'SKU',      sortType: 'string' },  // sortable
  'Category',                                   // not sortable (plain string)
  { label: 'Qty',      sortType: 'number' },  // sortable
  { label: 'Due Date', sortType: 'date' },    // sortable
];
```

`sortType` values: `'string'` | `'number'` | `'date'`

## Table Component

```astro
<Table id="my-table" columns={columns}>
```

`id` required — `initSortableTable` finds the table by this id.

## Cell Markup

Add `data-sort-value` to every sortable `<td>` with the **raw comparable value**:

```html
<!-- number: raw number, not formatted string -->
<td data-sort-value={item.qty}>{item.qty.toLocaleString()}</td>

<!-- date: ISO string YYYY-MM-DD -->
<td data-sort-value={item.dueDate}>{item.dueDate}</td>

<!-- string: raw value -->
<td data-sort-value={item.sku}>{item.sku}</td>
```

Non-sortable `<td>` needs no `data-sort-value`.

## Init Script (in page `<script>`)

```typescript
import { initSortableTable } from '../lib/sort-table';
initSortableTable('my-table');
```

## sort-table.ts (full source)

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

      headers.forEach(h => {
        h.dataset.sort = 'none';
        h.classList.remove('text-tp-primary', 'font-semibold');
        const ind = h.querySelector('.sort-indicator');
        if (ind) ind.textContent = '';
      });

      th.dataset.sort = next;
      th.classList.add('text-tp-primary', 'font-semibold');
      const indicator = th.querySelector('.sort-indicator');
      if (indicator) indicator.textContent = next === 'asc' ? '▲' : '▼';

      const allRows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
      allRows.sort((a, b) => {
        const aCell = a.querySelectorAll('td')[col];
        const bCell = b.querySelectorAll('td')[col];
        const aRaw = aCell?.dataset.sortValue ?? aCell?.textContent?.trim() ?? '';
        const bRaw = bCell?.dataset.sortValue ?? bCell?.textContent?.trim() ?? '';

        let cmp = 0;
        if (type === 'number') cmp = (parseFloat(aRaw) || 0) - (parseFloat(bRaw) || 0);
        else if (type === 'date') cmp = new Date(aRaw).getTime() - new Date(bRaw).getTime();
        else cmp = aRaw.localeCompare(bRaw, undefined, { numeric: true });
        return next === 'asc' ? cmp : -cmp;
      });

      allRows.forEach(row => tbody.appendChild(row));
    });
  });
}
```

## Rules

- `data-sort-value` must be raw comparable (not display-formatted — e.g. `1234` not `"$1,234"`)
- Sort cycles asc → desc → asc; clicking different column resets others
- Filtered-out rows (hidden via `display:none`) stay in DOM and get sorted — filter re-applies after sort if combined
- Active header gets `text-tp-primary font-semibold` + `▲`/`▼` indicator in `.sort-indicator` span

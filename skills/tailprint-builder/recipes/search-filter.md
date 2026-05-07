# TailPrint — Search + Filter Pattern

Wire an input and selects to filter table rows client-side. Add `data-*` attrs to each `<tr>` at build time, then AND-filter on every event.

## Row Markup (Astro template)

```html
<tr
  data-sku={item.sku.toLowerCase()}
  data-name={item.name.toLowerCase()}
  data-category={item.category}
  data-warehouse={item.warehouse}
>
```

Store text fields lowercase — enables case-insensitive matching without `.toLowerCase()` at query time.

## Controls (with required IDs)

```astro
<Input id="inv-search" placeholder="Search SKU or name…" />
<Select id="inv-category" options={categoryOptions} />
<Select id="inv-warehouse" options={warehouseOptions} />
<Table id="inv-table" columns={columns}>
```

## Filter Script (in page `<script>`)

```typescript
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

initSortableTable('inv-table'); // combine with sort if needed
```

## Rules

- AND-logic across all active filters — all conditions must match
- Empty filter value (`''`) = no restriction on that field
- `display: 'none'` hides rows; `display: ''` restores browser default
- Sort and filter compose — filtered-out rows stay hidden during sort

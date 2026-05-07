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

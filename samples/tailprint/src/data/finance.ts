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

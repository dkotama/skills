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

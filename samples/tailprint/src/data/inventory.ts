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

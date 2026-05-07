export type ZoneStatus = 'active' | 'maintenance' | 'locked';

export interface WarehouseBin {
  bin: string;
  capacity: number;
  fillPct: number;
  skuCount: number;
  lastActivity: string;
}

export interface WarehouseZone {
  zone: string;
  status: ZoneStatus;
  bins: WarehouseBin[];
}

export interface WarehouseFloor {
  floor: string;
  warehouse: string;
  zones: WarehouseZone[];
}

const zoneStatuses: ZoneStatus[] = ['active','active','active','active','maintenance','locked'];

function makeFloor(warehouseIdx: number, floorIdx: number): WarehouseFloor {
  const warehouse = `WH-${['A','B','C'][warehouseIdx]}`;
  const floorLabel = `Floor ${floorIdx + 1}`;
  const baseIdx = warehouseIdx * 36 + floorIdx * 12;

  const zones: WarehouseZone[] = Array.from({ length: 12 }, (_, z) => {
    const globalZ = baseIdx + z;
    return {
      zone: `Z${z + 1}`,
      status: zoneStatuses[globalZ % zoneStatuses.length],
      bins: Array.from({ length: 8 }, (_, b) => {
        const globalB = globalZ * 8 + b;
        const fillPct = (globalB * 13) % 101;
        const lastDay = new Date('2026-05-07');
        lastDay.setHours(lastDay.getHours() - (globalB % 24));
        return {
          bin: `B${b + 1}`,
          capacity: 100,
          fillPct,
          skuCount: Math.floor(fillPct / 10),
          lastActivity: lastDay.toISOString().replace('T', ' ').slice(0, 16),
        };
      }),
    };
  });

  return { floor: floorLabel, warehouse, zones };
}

export const warehouseFloors: WarehouseFloor[] = [
  makeFloor(0, 0), makeFloor(1, 0), makeFloor(2, 0),
];

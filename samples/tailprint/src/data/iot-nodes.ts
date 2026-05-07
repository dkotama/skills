export type NodeStatus = 'online' | 'warning' | 'offline';
export type SensorType = 'temperature' | 'humidity' | 'vibration' | 'power';

export interface IotNode {
  id: string;
  warehouse: string;
  sensorType: SensorType;
  status: NodeStatus;
  temperature: number;
  humidity: number;
  vibration: number;
  powerDraw: number;
  lastSeen: string;
  alertThreshold: number;
}

const warehouses = ['WH-A', 'WH-B', 'WH-C'];
const sensorTypes: SensorType[] = ['temperature', 'humidity', 'vibration', 'power'];

function nodeStatus(i: number): NodeStatus {
  if (i % 8 === 7) return 'offline';
  if (i % 5 === 4) return 'warning';
  return 'online';
}

function minutesAgo(i: number): string {
  const mins = (i * 7 + 1) % 120;
  const now = new Date('2026-05-07T10:00:00Z');
  now.setMinutes(now.getMinutes() - mins);
  return now.toISOString().replace('T', ' ').slice(0, 16);
}

export const iotNodes: IotNode[] = Array.from({ length: 48 }, (_, i) => ({
  id: `NODE-${String(i + 1).padStart(3, '0')}`,
  warehouse: warehouses[Math.floor(i / 16)],
  sensorType: sensorTypes[i % 4],
  status: nodeStatus(i),
  temperature: 18 + (i * 13) % 22,
  humidity: 30 + (i * 17) % 50,
  vibration: parseFloat(((i * 3) % 10 / 10).toFixed(2)),
  powerDraw: 100 + (i * 23) % 900,
  lastSeen: minutesAgo(i),
  alertThreshold: 35 + (i % 3) * 5,
}));

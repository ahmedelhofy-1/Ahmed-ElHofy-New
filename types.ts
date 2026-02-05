
export enum AssetStatus {
  OPERATIONAL = 'Operational',
  MAINTENANCE = 'In Maintenance',
  DOWN = 'Down',
  RETIRED = 'Retired',
  STANDBY = 'Standby',
  OBSOLETE = 'Obsolete',
  OUT_OF_SERVICE = 'Out of Service',
  RENTAL = 'Rental'
}

export enum WorkOrderPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum WorkOrderStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  PENDING_PARTS = 'Pending Parts',
  COMPLETED = 'Closed'
}

export enum MaintenanceType {
  PREVENTIVE = 'Preventive M',
  CORRECTIVE = 'Corrective M',
  EMERGENCY = 'Emergency M',
  ANNUAL = 'Annual M',
  INVESTMENT = 'Investment M',
  OUTSOURCE = 'Outsource M'
}

export enum AgriculturalSeason {
  PRE_HARVEST = 'Pre-Harvest',
  HARVEST = 'Harvest',
  POST_HARVEST = 'Post-Harvest',
  OFF_SEASON = 'Off-Season'
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  location: string;
  sector: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  localId?: string;
  code?: string;
  itemCode?: string;
  mainGroup?: string;
  subGroup?: string;
  notes?: string;
  functionalLocation: string;
  parentAssetId?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  healthScore: number;
  purchaseDate: string;
  purchaseValue: number;
  operatingHours: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  sector: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  type: MaintenanceType;
  assignedTo: string;
  dueDate: string;
  description: string;
  plannedCost: number;
  actualCost: number;
  plannedHours: number;
  actualHours: number;
  isOverdue: boolean;
  maintenancePlan?: string;
  season?: AgriculturalSeason;
}

export interface BreakdownRecord {
  id: string;
  assetId: string;
  assetName: string;
  sector: string;
  date: string;
  failureCode: 'Mechanical' | 'Electrical' | 'Hydraulic' | 'Sensor' | 'Engine' | 'Software';
  downtimeHours: number;
  rootCause: string;
  correctiveActionStatus: 'Open' | 'Resolved' | 'Under Investigation';
  mtbf: number; // Hours
  mttr: number; // Hours
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  isCritical: boolean;
  isSlowMoving?: boolean;
}

export interface SparePartConsumption {
  id: string;
  materialCode: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  sector: string;
  equipmentId: string;
  equipmentName: string;
  workOrderId: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  site: string;
  baseHoursPerWeek: number;
  specialty: 'Mechanic' | 'Electrician' | 'Irrigation Specialist' | 'HVAC' | 'General';
}

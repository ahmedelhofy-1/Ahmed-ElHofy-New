
import React from 'react';
import { LayoutDashboard, Truck, FileText, Package, Settings, MessageSquare, AlertTriangle, CalendarCheck, Network, HeartPulse, ShoppingCart, BarChart3, Users, Wallet, ShieldAlert } from 'lucide-react';
import { Asset, AssetStatus, WorkOrder, WorkOrderPriority, WorkOrderStatus, InventoryItem, MaintenanceType, BreakdownRecord, AgriculturalSeason, SparePartConsumption, Technician } from './types';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Operational Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'executive-summary', label: 'Executive Dashboard', icon: <ShieldAlert size={20} /> },
  { id: 'assets', label: 'Technical Assets', icon: <Truck size={20} /> },
  { id: 'asset-hierarchy', label: 'Asset Tree', icon: <Network size={20} /> },
  { id: 'health-assessment', label: 'Health Assessment', icon: <HeartPulse size={20} /> },
  { id: 'workorders', label: 'Maintenance Orders', icon: <FileText size={20} /> },
  { id: 'labor-performance', label: 'Labor Performance', icon: <Users size={20} /> },
  { id: 'spare-parts', label: 'Parts Consumption', icon: <ShoppingCart size={20} /> },
  { id: 'maintenance-cost', label: 'Cost Analysis', icon: <BarChart3 size={20} /> },
  { id: 'budget-actual', label: 'Budget vs Actual', icon: <Wallet size={20} /> },
  { id: 'breakdown-analysis', label: 'Breakdown & Failure', icon: <AlertTriangle size={20} /> },
  { id: 'pm-performance', label: 'PM Performance', icon: <CalendarCheck size={20} /> },
  { id: 'inventory', label: 'Inventory & Parts', icon: <Package size={20} /> },
  { id: 'ai-assistant', label: 'AI ERP Advisor', icon: <MessageSquare size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const MOCK_TECHNICIANS: Technician[] = [
  { id: 'T-001', name: 'Marco Rossi', role: 'Senior Mechanic', site: 'North Workshop', baseHoursPerWeek: 40, specialty: 'Mechanic' },
  { id: 'T-002', name: 'Sarah Jenkins', role: 'Irrigation Lead', site: 'East Area Hub', baseHoursPerWeek: 40, specialty: 'Irrigation Specialist' },
  { id: 'T-003', name: 'David Chen', role: 'Automation Tech', site: 'Processing Hub', baseHoursPerWeek: 45, specialty: 'Electrician' },
  { id: 'T-004', name: 'Ahmed Hassan', role: 'Field Technician', site: 'North Workshop', baseHoursPerWeek: 40, specialty: 'Mechanic' },
  { id: 'T-005', name: 'Elena Gomez', role: 'HVAC Specialist', site: 'East Area Hub', baseHoursPerWeek: 40, specialty: 'HVAC' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'A-SYS-01', name: 'Main Irrigation System S4', type: 'Infrastructure', status: AssetStatus.OPERATIONAL, location: 'Sector 4', sector: 'Sector 4', manufacturer: 'Valmont', functionalLocation: 'S4-IRR-MAIN', lastMaintenance: '2024-03-01', nextMaintenance: '2024-09-01', healthScore: 98, purchaseDate: '2020-01-10', purchaseValue: 120000, operatingHours: 12400 },
  { id: 'A-102', name: 'Valmont Center Pivot 01', type: 'Irrigation', status: AssetStatus.MAINTENANCE, location: 'Sector 4', sector: 'Sector 4', manufacturer: 'Valmont', functionalLocation: 'S4-IRR-MAIN-PVT01', parentAssetId: 'A-SYS-01', lastMaintenance: '2024-04-10', nextMaintenance: '2024-05-10', healthScore: 45, purchaseDate: '2018-05-20', purchaseValue: 45000, operatingHours: 28900 },
  { id: 'A-101', name: 'John Deere 8R 410', type: 'Tractor', status: AssetStatus.OPERATIONAL, location: 'North Field', sector: 'North Field', manufacturer: 'John Deere', functionalLocation: 'NF-FLE-TRC01', lastMaintenance: '2024-03-15', nextMaintenance: '2024-06-15', healthScore: 92, purchaseDate: '2022-03-15', purchaseValue: 385000, operatingHours: 1800 },
  { id: 'A-103', name: 'Case IH Axial-Flow', type: 'Harvester', status: AssetStatus.OPERATIONAL, location: 'Depot B', sector: 'North Farm', manufacturer: 'Case IH', functionalLocation: 'NF-FLE-HAR01', lastMaintenance: '2024-01-20', nextMaintenance: '2024-07-20', healthScore: 88, purchaseDate: '2021-06-12', purchaseValue: 520000, operatingHours: 3500 },
  { id: 'A-104', name: 'Smart Climate Greenhouse', type: 'Greenhouse', status: AssetStatus.DOWN, location: 'East Area', sector: 'East Area', manufacturer: 'AgriTech', functionalLocation: 'EA-GH-01', lastMaintenance: '2024-02-05', nextMaintenance: '2024-05-05', healthScore: 12, purchaseDate: '2015-08-22', purchaseValue: 210000, operatingHours: 65000 },
  { id: 'A-105', name: 'Sorting Line A', type: 'Processing Plant', status: AssetStatus.OPERATIONAL, location: 'Processing Hub', sector: 'Processing Hub', manufacturer: 'Buhler', functionalLocation: 'PH-LINE-A', lastMaintenance: '2024-03-01', nextMaintenance: '2024-09-01', healthScore: 95, purchaseDate: '2023-01-15', purchaseValue: 850000, operatingHours: 2100 },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { 
    id: 'WO-5001', 
    title: 'Hydraulic Leak Repair', 
    assetId: 'A-102', 
    assetName: 'Valmont Center Pivot 01',
    sector: 'Sector 4',
    priority: WorkOrderPriority.HIGH, 
    status: WorkOrderStatus.IN_PROGRESS, 
    type: MaintenanceType.CORRECTIVE,
    assignedTo: 'Marco Rossi', 
    dueDate: '2024-05-12', 
    description: 'Address leak on main hydraulic arm.',
    plannedCost: 500,
    actualCost: 620,
    plannedHours: 4,
    actualHours: 5.5,
    isOverdue: false,
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5002', 
    title: '250h Engine Service', 
    assetId: 'A-101', 
    assetName: 'John Deere 8R 410',
    sector: 'North Field',
    priority: WorkOrderPriority.MEDIUM, 
    status: WorkOrderStatus.NEW, 
    type: MaintenanceType.PREVENTIVE,
    assignedTo: 'Sarah Jenkins', 
    dueDate: '2024-06-15', 
    description: 'Replace oil and fuel filters.',
    plannedCost: 350,
    actualCost: 380,
    plannedHours: 2,
    actualHours: 2.2,
    isOverdue: false,
    maintenancePlan: 'Tractor PM - Level 1',
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5003', 
    title: 'Critical Pump Replacement', 
    assetId: 'A-SYS-01', 
    assetName: 'Main Irrigation System S4',
    sector: 'Sector 4',
    priority: WorkOrderPriority.CRITICAL, 
    status: WorkOrderStatus.COMPLETED, 
    type: MaintenanceType.EMERGENCY,
    assignedTo: 'Ahmed Hassan', 
    dueDate: '2024-04-10', 
    description: 'Replace failed lift pump.',
    plannedCost: 2500,
    actualCost: 3200,
    plannedHours: 12,
    actualHours: 15,
    isOverdue: false,
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5004', 
    title: 'Pre-Harvest Annual PM', 
    assetId: 'A-103', 
    assetName: 'Case IH Axial-Flow',
    sector: 'North Farm',
    priority: WorkOrderPriority.MEDIUM, 
    status: WorkOrderStatus.COMPLETED, 
    type: MaintenanceType.ANNUAL,
    assignedTo: 'Marco Rossi', 
    dueDate: '2024-04-20', 
    description: 'Full strip down and cleaning.',
    plannedCost: 4500,
    actualCost: 4200,
    plannedHours: 40,
    actualHours: 38,
    isOverdue: false,
    maintenancePlan: 'Harvester Annual Overhaul',
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5005', 
    title: 'Sorting Line Expansion', 
    assetId: 'A-105', 
    assetName: 'Sorting Line A',
    sector: 'Processing Hub',
    priority: WorkOrderPriority.LOW, 
    status: WorkOrderStatus.COMPLETED, 
    type: MaintenanceType.INVESTMENT,
    assignedTo: 'David Chen', 
    dueDate: '2024-03-01', 
    description: 'Upgrade sorting line capacity.',
    plannedCost: 15000,
    actualCost: 16200,
    plannedHours: 120,
    actualHours: 135,
    isOverdue: false,
    season: AgriculturalSeason.OFF_SEASON
  },
  { 
    id: 'WO-5006', 
    title: 'Chiller Vendor Repair', 
    assetId: 'A-105', 
    assetName: 'Sorting Line A',
    sector: 'Processing Hub',
    priority: WorkOrderPriority.MEDIUM, 
    status: WorkOrderStatus.COMPLETED, 
    type: MaintenanceType.OUTSOURCE,
    assignedTo: 'External Carrier', 
    dueDate: '2024-02-15', 
    description: 'Chiller refrigerant recharge.',
    plannedCost: 1200,
    actualCost: 1450,
    plannedHours: 0,
    actualHours: 0,
    isOverdue: false,
    season: AgriculturalSeason.POST_HARVEST
  },
  { 
    id: 'WO-5007', 
    title: 'Greenhouse Structural Fix', 
    assetId: 'A-104', 
    assetName: 'Smart Climate Greenhouse',
    sector: 'East Area',
    priority: WorkOrderPriority.HIGH, 
    status: WorkOrderStatus.PENDING_PARTS, 
    type: MaintenanceType.CORRECTIVE,
    assignedTo: 'Elena Gomez', 
    dueDate: '2024-05-20', 
    description: 'Fix frame alignment issues.',
    plannedCost: 2000,
    actualCost: 1800,
    plannedHours: 16,
    actualHours: 14.5,
    isOverdue: true,
    season: AgriculturalSeason.PRE_HARVEST
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'I-001', name: 'Hydraulic Oil 20L', category: 'Fluids', stock: 45, minStock: 20, maxStock: 100, unit: 'pails', price: 120, isCritical: true },
  { id: 'I-002', name: 'Engine Oil Filter', category: 'Parts', stock: 12, minStock: 15, maxStock: 50, unit: 'units', price: 45, isCritical: true },
  { id: 'I-003', name: 'Irrigation Nozzle Kit', category: 'Parts', stock: 8, minStock: 10, maxStock: 25, unit: 'kits', price: 350, isCritical: false },
  { id: 'I-004', name: 'LED Work Light', category: 'Electrical', stock: 50, minStock: 10, maxStock: 60, unit: 'units', price: 85, isCritical: false },
  { id: 'I-005', name: 'Legacy Drive Belt', category: 'Parts', stock: 2, minStock: 1, maxStock: 5, unit: 'units', price: 1200, isCritical: true, isSlowMoving: true },
  { id: 'I-006', name: 'Air Filter 8R', category: 'Parts', stock: 120, minStock: 20, maxStock: 100, unit: 'units', price: 95, isCritical: false }, // Over Max
];

export const MOCK_CONSUMPTION: SparePartConsumption[] = [
  { id: 'C-001', materialCode: 'I-001', description: 'Hydraulic Oil 20L', quantity: 3, unitCost: 120, totalCost: 360, date: '2024-04-10', sector: 'Sector 4', equipmentId: 'A-102', equipmentName: 'Valmont Center Pivot 01', workOrderId: 'WO-5001' },
  { id: 'C-002', materialCode: 'I-002', description: 'Engine Oil Filter', quantity: 2, unitCost: 45, totalCost: 90, date: '2024-04-15', sector: 'North Field', equipmentId: 'A-101', equipmentName: 'John Deere 8R 410', workOrderId: 'WO-5002' },
];

export const MOCK_BREAKDOWNS: BreakdownRecord[] = [
  { id: 'F-7001', assetId: 'A-101', assetName: 'John Deere 8R 410', sector: 'North Field', date: '2024-04-12', failureCode: 'Hydraulic', downtimeHours: 12.5, rootCause: 'Sealed joint fatigue', correctiveActionStatus: 'Resolved', mtbf: 450, mttr: 4.2 },
];

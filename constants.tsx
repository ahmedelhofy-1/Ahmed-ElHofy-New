
import React from 'react';
import { LayoutDashboard, Truck, FileText, Package, Settings, MessageSquare, AlertTriangle, CalendarCheck, Network, HeartPulse } from 'lucide-react';
import { Asset, AssetStatus, WorkOrder, WorkOrderPriority, WorkOrderStatus, InventoryItem, MaintenanceType, BreakdownRecord, AgriculturalSeason } from './types';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'assets', label: 'Technical Assets', icon: <Truck size={20} /> },
  { id: 'asset-hierarchy', label: 'Asset Tree', icon: <Network size={20} /> },
  { id: 'health-assessment', label: 'Health Assessment', icon: <HeartPulse size={20} /> },
  { id: 'workorders', label: 'Maintenance Orders', icon: <FileText size={20} /> },
  { id: 'breakdown-analysis', label: 'Breakdown & Failure', icon: <AlertTriangle size={20} /> },
  { id: 'pm-performance', label: 'PM Performance', icon: <CalendarCheck size={20} /> },
  { id: 'inventory', label: 'Inventory & Parts', icon: <Package size={20} /> },
  { id: 'ai-assistant', label: 'AI ERP Advisor', icon: <MessageSquare size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'A-SYS-01', name: 'Main Irrigation System S4', type: 'Infrastructure', status: AssetStatus.OPERATIONAL, location: 'Sector 4', sector: 'Sector 4', manufacturer: 'Valmont', functionalLocation: 'S4-IRR-MAIN', lastMaintenance: '2024-03-01', nextMaintenance: '2024-09-01', healthScore: 98, purchaseDate: '2020-01-10', purchaseValue: 120000, operatingHours: 12400 },
  { id: 'A-102', name: 'Valmont Center Pivot 01', type: 'Irrigation', status: AssetStatus.MAINTENANCE, location: 'Sector 4', sector: 'Sector 4', manufacturer: 'Valmont', functionalLocation: 'S4-IRR-MAIN-PVT01', parentAssetId: 'A-SYS-01', lastMaintenance: '2024-04-10', nextMaintenance: '2024-05-10', healthScore: 45, purchaseDate: '2018-05-20', purchaseValue: 45000, operatingHours: 28900 },
  { id: 'A-102-P1', name: 'Primary Lift Pump', type: 'Component', status: AssetStatus.STANDBY, location: 'Sector 4', sector: 'Sector 4', manufacturer: 'Grundfos', functionalLocation: 'S4-IRR-MAIN-PVT01-PMP01', parentAssetId: 'A-102', lastMaintenance: '2024-02-15', nextMaintenance: '2024-08-15', healthScore: 90, purchaseDate: '2021-11-05', purchaseValue: 8500, operatingHours: 4200 },
  { id: 'A-101', name: 'John Deere 8R 410', type: 'Tractor', status: AssetStatus.OPERATIONAL, location: 'North Field', sector: 'North Field', manufacturer: 'John Deere', functionalLocation: 'NF-FLE-TRC01', lastMaintenance: '2024-03-15', nextMaintenance: '2024-06-15', healthScore: 92, purchaseDate: '2022-03-15', purchaseValue: 385000, operatingHours: 1800 },
  { id: 'A-101-R1', name: 'Rental Tractor X', type: 'Tractor', status: AssetStatus.RENTAL, location: 'North Field', sector: 'North Field', manufacturer: 'Fendt', functionalLocation: 'NF-FLE-TRC02-R', lastMaintenance: '2024-04-01', nextMaintenance: '2024-05-01', healthScore: 100, purchaseDate: '2024-03-01', purchaseValue: 0, operatingHours: 200 },
  { id: 'A-103', name: 'Case IH Axial-Flow', type: 'Harvester', status: AssetStatus.OPERATIONAL, location: 'Depot B', sector: 'North Farm', manufacturer: 'Case IH', functionalLocation: 'NF-FLE-HAR01', lastMaintenance: '2024-01-20', nextMaintenance: '2024-07-20', healthScore: 88, purchaseDate: '2021-06-12', purchaseValue: 520000, operatingHours: 3500 },
  { id: 'A-104', name: 'Smart Climate Greenhouse', type: 'Greenhouse', status: AssetStatus.DOWN, location: 'East Area', sector: 'East Area', manufacturer: 'AgriTech', functionalLocation: 'EA-GH-01', lastMaintenance: '2024-02-05', nextMaintenance: '2024-05-05', healthScore: 12, purchaseDate: '2015-08-22', purchaseValue: 210000, operatingHours: 65000 },
  { id: 'A-104-O', name: 'Legacy Sprinkler GH1', type: 'Irrigation', status: AssetStatus.OBSOLETE, location: 'East Area', sector: 'East Area', manufacturer: 'Generic', functionalLocation: 'EA-GH-01-OBS01', parentAssetId: 'A-104', lastMaintenance: '2022-01-01', nextMaintenance: 'N/A', healthScore: 0, purchaseDate: '2005-01-01', purchaseValue: 15000, operatingHours: 120000 },
  { id: 'A-105', name: 'Sorting Line A', type: 'Processing Plant', status: AssetStatus.OPERATIONAL, location: 'Processing Hub', sector: 'Processing Hub', manufacturer: 'Buhler', functionalLocation: 'PH-LINE-A', lastMaintenance: '2024-03-01', nextMaintenance: '2024-09-01', healthScore: 95, purchaseDate: '2023-01-15', purchaseValue: 850000, operatingHours: 2100 },
  { id: 'A-105-CH', name: 'Chiller Unit - Line A', type: 'Component', status: AssetStatus.OUT_OF_SERVICE, location: 'Processing Hub', sector: 'Processing Hub', manufacturer: 'Carrier', functionalLocation: 'PH-LINE-A-CHL01', parentAssetId: 'A-105', lastMaintenance: '2024-01-01', nextMaintenance: '2024-04-01', healthScore: 30, purchaseDate: '2019-10-10', purchaseValue: 45000, operatingHours: 18500 },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { 
    id: 'WO-5001', 
    title: 'Hydraulic Leak Repair', 
    assetId: 'A-102', 
    assetName: 'Valmont Center Pivot',
    sector: 'North Farm',
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
    actualCost: 0,
    plannedHours: 2,
    actualHours: 0,
    isOverdue: false,
    maintenancePlan: 'Tractor PM - Level 1',
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5003', 
    title: 'Critical Sensor Calibration', 
    assetId: 'A-104', 
    assetName: 'Smart Climate Greenhouse',
    sector: 'East Area',
    priority: WorkOrderPriority.CRITICAL, 
    status: WorkOrderStatus.PENDING_PARTS, 
    type: MaintenanceType.EMERGENCY,
    assignedTo: 'Tech Support', 
    dueDate: '2024-05-10', 
    description: 'Temp sensors reporting invalid data.',
    plannedCost: 1200,
    actualCost: 1450,
    plannedHours: 8,
    actualHours: 12,
    isOverdue: true,
    season: AgriculturalSeason.PRE_HARVEST
  },
  { 
    id: 'WO-5004', 
    title: 'Pre-Harvest PM', 
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
    title: 'Bi-Monthly Nozzle Cleaning', 
    assetId: 'A-102', 
    assetName: 'Valmont Center Pivot',
    sector: 'Sector 4',
    priority: WorkOrderPriority.LOW, 
    status: WorkOrderStatus.COMPLETED, 
    type: MaintenanceType.PREVENTIVE,
    assignedTo: 'Internal Team', 
    dueDate: '2024-04-01', 
    description: 'Check and clean all irrigation nozzles.',
    plannedCost: 150,
    actualCost: 140,
    plannedHours: 3,
    actualHours: 3.2,
    isOverdue: false,
    maintenancePlan: 'Irrigation Routine PM',
    season: AgriculturalSeason.OFF_SEASON
  }
];

export const MOCK_BREAKDOWNS: BreakdownRecord[] = [
  { id: 'F-7001', assetId: 'A-101', assetName: 'John Deere 8R 410', sector: 'North Field', date: '2024-04-12', failureCode: 'Hydraulic', downtimeHours: 12.5, rootCause: 'Sealed joint fatigue', correctiveActionStatus: 'Resolved', mtbf: 450, mttr: 4.2 },
  { id: 'F-7002', assetId: 'A-104', assetName: 'Smart Climate Greenhouse', sector: 'East Area', date: '2024-05-01', failureCode: 'Sensor', downtimeHours: 48, rootCause: 'Lightning surge', correctiveActionStatus: 'Under Investigation', mtbf: 120, mttr: 24 },
  { id: 'F-7003', assetId: 'A-102', assetName: 'Valmont Center Pivot', sector: 'Sector 4', date: '2024-05-05', failureCode: 'Electrical', downtimeHours: 6, rootCause: 'Short circuit in control panel', correctiveActionStatus: 'Resolved', mtbf: 310, mttr: 2.1 },
  { id: 'F-7004', assetId: 'A-105', assetName: 'Sorting Line A', sector: 'Processing Hub', date: '2024-04-22', failureCode: 'Mechanical', downtimeHours: 4.5, rootCause: 'Belt misalignment', correctiveActionStatus: 'Resolved', mtbf: 820, mttr: 1.5 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'I-001', name: 'Hydraulic Oil 20L', category: 'Fluids', stock: 45, minStock: 20, unit: 'pails', price: 120 },
  { id: 'I-002', name: 'Engine Oil Filter', category: 'Parts', stock: 12, minStock: 15, unit: 'units', price: 45 },
  { id: 'I-003', name: 'Irrigation Nozzle Kit', category: 'Parts', stock: 8, minStock: 10, unit: 'kits', price: 350 },
  { id: 'I-004', name: 'LED Work Light', category: 'Electrical', stock: 50, minStock: 10, unit: 'units', price: 85 },
];

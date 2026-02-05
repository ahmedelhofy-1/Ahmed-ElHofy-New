
import React, { useState, useMemo } from 'react';
import { MOCK_WORK_ORDERS, MOCK_ASSETS } from '../constants';
import { MaintenanceType, WorkOrder } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, PieChart, Pie
} from 'recharts';
import { 
  Search, Download, DollarSign, TrendingUp,
  Landmark, Tractor, Activity, Filter, Info,
  Calculator, Building2
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const MaintenanceCostView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    equipment: 'All',
    type: 'All',
    searchTerm: '',
    startDate: '',
    endDate: ''
  });

  const filteredOrders = useMemo(() => {
    return MOCK_WORK_ORDERS.filter(wo => {
      const matchSector = filters.sector === 'All' || wo.sector === filters.sector;
      const matchEquipment = filters.equipment === 'All' || wo.assetName === filters.equipment;
      const matchType = filters.type === 'All' || wo.type === filters.type;
      const matchSearch = wo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          wo.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchEquipment && matchType && matchSearch;
    });
  }, [filters]);

  // KPI Calculations
  // Explicitly type costKPIs as Record<string, number> to ensure Object.entries returns typed values for numeric comparison.
  const costKPIs: Record<string, number> = useMemo(() => {
    const total = filteredOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
    const byType: Record<string, number> = {};
    
    Object.values(MaintenanceType).forEach(type => {
      byType[type] = filteredOrders
        .filter(wo => wo.type === type)
        .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
    });

    return { total, ...byType };
  }, [filteredOrders]);

  // Donut Chart: Cost by Maintenance Type
  const costByTypeData = useMemo(() => {
    return Object.entries(costKPIs)
      .filter(([key]) => key !== 'total')
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [costKPIs]);

  // Stacked Bar Chart: Cost by Sector & Equipment Type
  const costBySectorEquipmentData = useMemo(() => {
    const sectors = Array.from(new Set(MOCK_ASSETS.map(a => a.sector)));
    const assetTypes = Array.from(new Set(MOCK_ASSETS.map(a => a.type)));

    return sectors.map(sector => {
      const sectorObj: any = { name: sector };
      assetTypes.forEach(type => {
        const sectorAssetIds = MOCK_ASSETS.filter(a => a.sector === sector && a.type === type).map(a => a.id);
        const cost = filteredOrders
          .filter(wo => sectorAssetIds.includes(wo.assetId))
          .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
        sectorObj[type] = cost;
      });
      return sectorObj;
    });
  }, [filteredOrders]);

  // Efficiency Indicators
  const efficiencyMetrics = useMemo(() => {
    const assetCount = MOCK_ASSETS.length;
    const pivotCount = MOCK_ASSETS.filter(a => a.type === 'Irrigation').length;
    const farmCount = new Set(MOCK_ASSETS.map(a => a.sector)).size;

    const costPerEquipment = assetCount > 0 ? costKPIs.total / assetCount : 0;
    const irrigationTotal = filteredOrders
      .filter(wo => {
        const asset = MOCK_ASSETS.find(a => a.id === wo.assetId);
        return asset?.type === 'Irrigation';
      })
      .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
    
    const costPerPivot = pivotCount > 0 ? irrigationTotal / pivotCount : 0;
    const costPerFarm = farmCount > 0 ? costKPIs.total / farmCount : 0;

    return { costPerEquipment, costPerPivot, costPerFarm };
  }, [costKPIs.total, filteredOrders]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Maintenance Type,Total Cost"].join(",") + "\n"
      + costByTypeData.map(d => `${d.name},${d.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maintenance_cost_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="text-blue-600" />
            Maintenance Cost Analysis
          </h2>
          <p className="text-gray-500 text-sm">Review financial engineering performance and cost efficiency across the enterprise.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Financial Export
        </button>
      </div>

      {/* Filter Bar */}
      <div className="sap-shadow bg-white p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>Sector 4</option>
            <option>North Field</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Maint. Type</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option>All</option>
            {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date Range</label>
          <div className="flex gap-1">
            <input type="date" className="w-1/2 p-1 text-[10px] border border-gray-200 rounded" />
            <input type="date" className="w-1/2 p-1 text-[10px] border border-gray-200 rounded" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search ID/Subject</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="WO# Search..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', equipment: 'All', type: 'All', searchTerm: '', startDate: '', endDate: ''})}
          className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total Maint Cost', value: costKPIs.total, color: 'border-blue-600' },
          { label: 'Preventive', value: costKPIs[MaintenanceType.PREVENTIVE], color: 'border-emerald-500' },
          { label: 'Corrective', value: costKPIs[MaintenanceType.CORRECTIVE], color: 'border-amber-500' },
          { label: 'Emergency', value: costKPIs[MaintenanceType.EMERGENCY], color: 'border-red-500' },
          { label: 'Annual', value: costKPIs[MaintenanceType.ANNUAL], color: 'border-indigo-500' },
          { label: 'Investment', value: costKPIs[MaintenanceType.INVESTMENT], color: 'border-purple-500' },
          { label: 'Outsource', value: costKPIs[MaintenanceType.OUTSOURCE], color: 'border-cyan-500' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 rounded-xl border-t-4 ${kpi.color} border-l border-r border-b border-gray-200 sap-shadow`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-900">${kpi.value?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={16} className="text-blue-600" />
            Cost Distribution by Maintenance Type
          </h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-gray-400 uppercase">Total Spend</span>
              <span className="text-2xl font-black text-gray-900">${costKPIs.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-emerald-500" />
            Cost by Sector & Equipment Class
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBySectorEquipmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend iconType="circle" />
                <Bar dataKey="Tractor" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Irrigation" stackId="a" fill="#10b981" />
                <Bar dataKey="Harvester" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Processing Plant" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Infrastructure" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Efficiency Indicators Section */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              Maintenance Efficiency Indicators
            </h3>
            <p className="text-xs text-gray-500">Benchmark maintenance intensity per operational unit.</p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cost Per Equipment</p>
                <p className="text-lg font-black text-gray-900">${efficiencyMetrics.costPerEquipment.toFixed(0)}</p>
             </div>
             <div className="w-px h-8 bg-gray-200" />
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cost Per Pivot</p>
                <p className="text-lg font-black text-emerald-600">${efficiencyMetrics.costPerPivot.toFixed(0)}</p>
             </div>
             <div className="w-px h-8 bg-gray-200" />
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cost Per Farm</p>
                <p className="text-lg font-black text-blue-600">${efficiencyMetrics.costPerFarm.toFixed(0)}</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> Performance Analysis
              </h4>
              <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">Cost Stability Index</span>
                    <span className="text-xs font-bold text-emerald-600">92% Stable</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">Preventive vs. Corrective Ratio</span>
                    <span className="text-xs font-bold text-blue-600">2.4 : 1</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">Cost Variance (Actual vs. Planned)</span>
                    <span className="text-xs font-bold text-amber-600">+8.4%</span>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Info size={14} /> Efficiency Notes
              </h4>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                 <p className="text-xs text-blue-800 leading-relaxed font-medium">
                   Current expenditure on <span className="font-bold">Sector 4</span> shows a 15% increase in emergency response costs due to aging irrigation components. 
                   Transitioning to a Level-2 PM cycle for Valmont Pivots could yield a <span className="font-bold">12% reduction</span> in annual O&M spend.
                 </p>
              </div>
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded">
                 <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                   Investment costs for <span className="font-bold">Sorting Line A</span> are tracking with expected capacity gains. Project ROI anticipated in 18 months.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCostView;

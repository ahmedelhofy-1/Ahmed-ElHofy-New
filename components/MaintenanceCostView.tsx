
import React, { useState, useMemo } from 'react';
import { MOCK_WORK_ORDERS, MOCK_ASSETS } from '../constants';
import { MaintenanceType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, PieChart, Pie
} from 'recharts';
import { 
  Search, Download, DollarSign, TrendingUp,
  Landmark, Info, Calculator, Building2
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const MaintenanceCostView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    type: 'All',
    searchTerm: '',
    startDate: '',
    endDate: ''
  });

  const filteredOrders = useMemo(() => {
    return MOCK_WORK_ORDERS.filter(wo => {
      const matchSector = filters.sector === 'All' || wo.sector === filters.sector;
      const matchType = filters.type === 'All' || wo.type === filters.type;
      const matchSearch = wo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          wo.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchType && matchSearch;
    });
  }, [filters]);

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

  const costByTypeData = useMemo(() => {
    return Object.entries(costKPIs)
      .filter(([key]) => key !== 'total')
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [costKPIs]);

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

  const efficiencyMetrics = useMemo(() => {
    const assetCount = MOCK_ASSETS.length;
    const pivotCount = MOCK_ASSETS.filter(a => a.type === 'Irrigation').length;
    const farmCount = new Set(MOCK_ASSETS.map(a => a.sector)).size;
    const costPerEquipment = assetCount > 0 ? costKPIs.total / assetCount : 0;
    const irrigationTotal = filteredOrders
      .filter(wo => MOCK_ASSETS.find(a => a.id === wo.assetId)?.type === 'Irrigation')
      .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
    return { costPerEquipment, costPerPivot: pivotCount > 0 ? irrigationTotal / pivotCount : 0, costPerFarm: farmCount > 0 ? costKPIs.total / farmCount : 0 };
  }, [costKPIs.total, filteredOrders]);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Landmark className="text-blue-600" /> Maintenance Cost Analysis</h2>
          <p className="text-gray-500 text-sm">Financial engineering performance and spend tracking.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Standard Top Filter Position */}
      <div className="sap-shadow bg-white p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sector</label>
          <select className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" value={filters.sector} onChange={(e) => setFilters({...filters, sector: e.target.value})}>
            <option>All</option>
            <option>Sector 4</option>
            <option>North Field</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Maint. Type</label>
          <select className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
            <option>All</option>
            {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Start Date</label>
          <input type="date" className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Search ID</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none" value={filters.searchTerm} onChange={(e) => setFilters({...filters, searchTerm: e.target.value})} />
          </div>
        </div>
        <button onClick={() => setFilters({sector: 'All', type: 'All', searchTerm: '', startDate: '', endDate: ''})} className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Reset</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total Cost', value: costKPIs.total, color: 'border-blue-600', tooltip: "Sum of actual costs for all selected work orders." },
          { label: 'Preventive', value: costKPIs[MaintenanceType.PREVENTIVE], color: 'border-emerald-500', tooltip: "Cost incurred from scheduled PM routines." },
          { label: 'Corrective', value: costKPIs[MaintenanceType.CORRECTIVE], color: 'border-amber-500', tooltip: "Costs for fixing failures identified during operations." },
          { label: 'Emergency', value: costKPIs[MaintenanceType.EMERGENCY], color: 'border-red-500', tooltip: "Highest priority costs for unplanned downtime." },
          { label: 'Annual', value: costKPIs[MaintenanceType.ANNUAL], color: 'border-indigo-500', tooltip: "Costs for major yearly machine overhauls." },
          { label: 'Investment', value: costKPIs[MaintenanceType.INVESTMENT], color: 'border-purple-500', tooltip: "Capex-style maintenance for upgrades." },
          { label: 'Outsource', value: costKPIs[MaintenanceType.OUTSOURCE], color: 'border-cyan-500', tooltip: "Payments to external vendors and technicians." },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 rounded-xl border-t-4 ${kpi.color} border-l border-r border-b border-gray-200 sap-shadow relative group/card`}>
            <div className="flex justify-between items-start mb-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">{kpi.label}</p>
              <div className="relative group/tooltip">
                <Info size={12} className="text-gray-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">{kpi.tooltip}</div>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900">${kpi.value?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2"><DollarSign size={16} className="text-blue-600" /> Cost Distribution</h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costByTypeData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {costByTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-gray-400 uppercase">Total</span>
              <span className="text-2xl font-black text-gray-900">${costKPIs.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2"><Building2 size={16} className="text-emerald-500" /> Cost by Sector</h3>
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 sap-shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Calculator size={20} className="text-blue-600" /> Efficiency Indicators</h3>
            <p className="text-xs text-gray-500">O&M intensity per production unit.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cost / Equipment</p>
                <p className="text-xl font-black text-gray-900">${efficiencyMetrics.costPerEquipment.toFixed(0)}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cost / Pivot</p>
                <p className="text-xl font-black text-emerald-600">${efficiencyMetrics.costPerPivot.toFixed(0)}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cost / Farm</p>
                <p className="text-xl font-black text-blue-600">${efficiencyMetrics.costPerFarm.toFixed(0)}</p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default MaintenanceCostView;


import React, { useState, useMemo } from 'react';
import { MOCK_ASSETS, MOCK_WORK_ORDERS, MOCK_BREAKDOWNS } from '../constants';
import { Asset, AssetStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, Legend 
} from 'recharts';
import { 
  Search, Download, Filter, 
  Clock, DollarSign, Activity, History,
  TrendingUp, Info, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle2, RefreshCw
} from 'lucide-react';

const EquipmentHealthView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    manufacturer: 'All',
    searchTerm: ''
  });

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(a => {
      const matchSector = filters.sector === 'All' || a.sector === filters.sector;
      const matchManufacturer = filters.manufacturer === 'All' || a.manufacturer === filters.manufacturer;
      const matchSearch = a.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchManufacturer && matchSearch;
    });
  }, [filters]);

  // Calculations for charts and data
  const healthData = useMemo(() => {
    return filteredAssets.map(asset => {
      const mCost = MOCK_WORK_ORDERS
        .filter(wo => wo.assetId === asset.id)
        .reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
      
      const breakdowns = MOCK_BREAKDOWNS.filter(b => b.assetId === asset.id).length;
      
      const purchaseYear = new Date(asset.purchaseDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - purchaseYear;
      
      const costVsValue = asset.purchaseValue > 0 ? (mCost / asset.purchaseValue) * 100 : 0;

      let decision = 'Continue';
      if (asset.status === AssetStatus.OBSOLETE) decision = 'Obsolete';
      else if (asset.healthScore < 40) decision = 'Replace';
      else if (asset.healthScore < 60) decision = 'Overhaul';
      else if (asset.healthScore < 80) decision = 'Follow-up';

      return {
        ...asset,
        mCost,
        breakdowns,
        age,
        costVsValue,
        decision
      };
    });
  }, [filteredAssets]);

  // KPI aggregation for current selection
  const kpis = useMemo(() => {
    const avgAge = healthData.reduce((acc, curr) => acc + curr.age, 0) / (healthData.length || 1);
    const totalMaintCost = healthData.reduce((acc, curr) => acc + curr.mCost, 0);
    const avgUtilization = healthData.reduce((acc, curr) => acc + curr.operatingHours, 0) / (healthData.length || 1);
    const avgCostRatio = healthData.reduce((acc, curr) => acc + curr.costVsValue, 0) / (healthData.length || 1);
    
    return { avgAge, totalMaintCost, avgUtilization, avgCostRatio };
  }, [healthData]);

  // Chart: Utilization Assets (Top 10 by Operating Hours)
  const utilizationData = useMemo(() => {
    return [...healthData]
      .sort((a, b) => b.operatingHours - a.operatingHours)
      .slice(0, 8)
      .map(a => ({ name: a.name, hours: a.operatingHours }));
  }, [healthData]);

  // Chart: Breakdown Frequency (Top 10)
  const breakdownFreqData = useMemo(() => {
    return [...healthData]
      .sort((a, b) => b.breakdowns - a.breakdowns)
      .slice(0, 8)
      .map(a => ({ name: a.name, count: a.breakdowns }));
  }, [healthData]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Asset ID,Equipment,Age,Operating Hours,Total Maint Cost,Cost vs Value %,Health Score,Decision"].join(",") + "\n"
      + healthData.map(d => {
        return [d.id, d.name, d.age, d.operatingHours, d.mCost, d.costVsValue.toFixed(1) + '%', d.healthScore, d.decision].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "equipment_health_matrix.csv");
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
            <Activity className="text-blue-500" />
            Equipment Health Assessment
          </h2>
          <p className="text-gray-500 text-sm">Decision support for engineering repair vs. replacement life-cycle analysis.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Health Matrix
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Equipment / Model</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Asset..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
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
            <option>East Area</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Manufacturer</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.manufacturer}
            onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
          >
            <option>All</option>
            <option>John Deere</option>
            <option>Valmont</option>
            <option>Case IH</option>
            <option>Buhler</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Equipment Age', value: `${kpis.avgAge.toFixed(1)} Yrs`, icon: <History className="text-blue-500" /> },
          { label: 'Avg. Operating Hours', value: `${kpis.avgUtilization.toFixed(0)} h`, icon: <Clock className="text-amber-500" /> },
          { label: 'Total Maint. Cost', value: `$${kpis.totalMaintCost.toLocaleString()}`, icon: <DollarSign className="text-emerald-500" /> },
          { label: 'Cost % of Asset Value', value: `${kpis.avgCostRatio.toFixed(1)}%`, icon: <TrendingUp className="text-purple-500" /> },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Top Utilization (Operating Hours)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 9}} />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Breakdown Frequency per Asset</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownFreqData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Decision Panel Table */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Health Score & Lifecycle Decisions</h3>
            <p className="text-xs text-gray-500">Asset-by-asset technical condition rating and economic recommendation.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Equipment & ID</th>
                <th className="px-6 py-4">Utilization (h)</th>
                <th className="px-6 py-4">Maint. Cost (LTD)</th>
                <th className="px-6 py-4">Cost/Value %</th>
                <th className="px-6 py-4">Health Score</th>
                <th className="px-6 py-4">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {healthData.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{d.name}</span>
                      <span className="text-[10px] font-mono text-blue-600 uppercase">{d.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {d.operatingHours.toLocaleString()}h
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-bold">
                    ${d.mCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold ${d.costVsValue > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                         {d.costVsValue.toFixed(1)}%
                       </span>
                       <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full ${d.costVsValue > 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(d.costVsValue, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        d.healthScore > 80 ? 'bg-emerald-100 text-emerald-700' :
                        d.healthScore > 60 ? 'bg-blue-100 text-blue-700' :
                        d.healthScore > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {d.healthScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded border ${
                      d.decision === 'Continue' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                      d.decision === 'Follow-up' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                      d.decision === 'Overhaul' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                      d.decision === 'Replace' ? 'border-red-200 text-red-600 bg-red-50' :
                      'border-gray-200 text-gray-600 bg-gray-50'
                    }`}>
                      {d.decision === 'Continue' && <CheckCircle2 size={12} />}
                      {d.decision === 'Follow-up' && <RefreshCw size={12} />}
                      {d.decision === 'Overhaul' && <Info size={12} />}
                      {d.decision === 'Replace' && <AlertTriangle size={12} />}
                      {d.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentHealthView;

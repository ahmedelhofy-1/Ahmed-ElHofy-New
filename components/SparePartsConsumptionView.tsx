
import React, { useState, useMemo } from 'react';
import { MOCK_CONSUMPTION, MOCK_INVENTORY, MOCK_ASSETS } from '../constants';
import { SparePartConsumption, InventoryItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Search, Download, Filter, 
  Package, DollarSign, AlertCircle, TrendingUp,
  Activity, ArrowRight, Layers, LayoutGrid, Calendar
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SparePartsConsumptionView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    equipment: 'All',
    category: 'All',
    searchTerm: ''
  });

  const filteredConsumption = useMemo(() => {
    return MOCK_CONSUMPTION.filter(c => {
      const matchSector = filters.sector === 'All' || c.sector === filters.sector;
      const matchEquipment = filters.equipment === 'All' || c.equipmentName === filters.equipment;
      const matchSearch = c.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          c.materialCode.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchEquipment && matchSearch;
    });
  }, [filters]);

  const filteredInventory = useMemo(() => {
    return MOCK_INVENTORY.filter(i => {
      const matchCategory = filters.category === 'All' || i.category === filters.category;
      const matchSearch = i.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          i.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [filters]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalCost = filteredConsumption.reduce((sum, c) => sum + c.totalCost, 0);
    const criticalCount = MOCK_INVENTORY.filter(i => i.isCritical).length;
    const slowMovingCount = MOCK_INVENTORY.filter(i => i.isSlowMoving).length;
    const criticalUnderMin = MOCK_INVENTORY.filter(i => i.isCritical && i.stock < i.minStock).length;
    const underMin = MOCK_INVENTORY.filter(i => i.stock < i.minStock).length;
    const overMax = MOCK_INVENTORY.filter(i => i.stock > i.maxStock).length;

    return { totalCost, criticalCount, slowMovingCount, criticalUnderMin, underMin, overMax };
  }, [filteredConsumption]);

  // Chart: Cost by Sector
  const costBySectorData = useMemo(() => {
    const sectors: Record<string, number> = {};
    filteredConsumption.forEach(c => {
      sectors[c.sector] = (sectors[c.sector] || 0) + c.totalCost;
    });
    return Object.entries(sectors).map(([name, cost]) => ({ name, cost }));
  }, [filteredConsumption]);

  // Chart: Top 10 Consumed
  const topConsumedData = useMemo(() => {
    const items: Record<string, number> = {};
    filteredConsumption.forEach(c => {
      items[c.description] = (items[c.description] || 0) + c.quantity;
    });
    return Object.entries(items)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
  }, [filteredConsumption]);

  // Chart: Stock Cost Per Year (Mocked)
  const yearlyStockCostData = [
    { year: '2021', cost: 120000 },
    { year: '2022', cost: 145000 },
    { year: '2023', cost: 138000 },
    { year: '2024', cost: stats.totalCost * 12 }, // Projected based on current filtering
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Material Code,Description,Quantity Actual,Quantity Min,Quantity Max,Unit Cost,Total Cost,Linked Order"].join(",") + "\n"
      + filteredConsumption.map(c => {
        const inv = MOCK_INVENTORY.find(i => i.id === c.materialCode);
        return [c.materialCode, c.description, c.quantity, inv?.minStock || 0, inv?.maxStock || 0, c.unitCost, c.totalCost, c.workOrderId].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spare_parts_consumption_report.csv");
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
            <Package className="text-blue-500" />
            Spare Parts Consumption & Control
          </h2>
          <p className="text-gray-500 text-sm">Monitor material usage efficiency and maintain optimal stock levels for technical operations.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Material Matrix
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>Sector 4</option>
            <option>North Field</option>
            <option>Processing Hub</option>
            <option>North Farm</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Equipment</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
            value={filters.equipment}
            onChange={(e) => setFilters({...filters, equipment: e.target.value})}
          >
            <option>All</option>
            {Array.from(new Set(MOCK_ASSETS.map(a => a.name))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Part Category</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option>All</option>
            <option>Fluids</option>
            <option>Parts</option>
            <option>Electrical</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search Material</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Code or Desc..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', equipment: 'All', category: 'All', searchTerm: ''})}
          className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Spare Parts Cost', value: `$${stats.totalCost.toLocaleString()}`, color: 'border-blue-500', sub: 'Selected Period' },
          { label: 'Critical Spares', value: stats.criticalCount, color: 'border-emerald-500', sub: 'Active Inventory' },
          { label: 'Slow Moving', value: stats.slowMovingCount, color: 'border-amber-500', sub: 'Non-active items' },
          { label: 'Critical Under Min', value: stats.criticalUnderMin, color: 'border-red-600', sub: 'Immediate Risk' },
          { label: 'Under Min Stock', value: stats.underMin, color: 'border-red-400', sub: 'Low inventory alert' },
          { label: 'Over Max Stock', value: stats.overMax, color: 'border-purple-400', sub: 'Storage efficiency' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 rounded-xl border-l-4 ${kpi.color} border-t border-r border-b border-gray-200 sap-shadow`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[9px] text-gray-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            Spare Parts Cost by Sector
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBySectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                   {costBySectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Top 10 Consumed Spare Parts (Qty)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConsumedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 9}} />
                <Tooltip />
                <Bar dataKey="qty" fill="#10b981" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-500" />
            Stock Cost Per Year (Projection)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyStockCostData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={3} dot={{r: 6, fill: '#8b5cf6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <LayoutGrid size={16} className="text-blue-500" />
            Spare Parts Total Cost vs Budget
          </h3>
          <div className="flex flex-col items-center justify-center h-[250px] space-y-4">
             <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * (stats.totalCost / 5000) * 100) / 100} 
                    className="text-blue-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">{((stats.totalCost / 5000) * 100).toFixed(0)}%</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">of Budget</span>
                </div>
             </div>
             <div className="text-center">
               <p className="text-xs text-gray-500">Target Monthly Budget: <span className="font-bold text-gray-900">$5,000</span></p>
               <p className="text-xs text-gray-500">Actual Spend: <span className="font-bold text-blue-600">${stats.totalCost.toLocaleString()}</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Spare Parts Consumption Matrix</h3>
            <p className="text-xs text-gray-500">Historical usage log linked to technical maintenance activity.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Material Code & Description</th>
                <th className="px-6 py-4 text-center">Qty (Act / Max / Min)</th>
                <th className="px-6 py-4">Unit Cost</th>
                <th className="px-6 py-4">Total Cost</th>
                <th className="px-6 py-4">Linked Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredConsumption.map((c) => {
                const inv = MOCK_INVENTORY.find(i => i.id === c.materialCode);
                const isUnder = inv ? inv.stock < inv.minStock : false;
                const isOver = inv ? inv.stock > inv.maxStock : false;

                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-blue-600">{c.materialCode}</span>
                        <span className="text-xs font-semibold text-gray-900">{c.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-gray-900">{c.quantity}</span>
                        <span className="text-[10px] text-gray-400">
                          Max: {inv?.maxStock || '-'} / Min: {inv?.minStock || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">${c.unitCost}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${c.totalCost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-blue-100">
                         {c.workOrderId}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{c.date}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                         isUnder ? 'bg-red-100 text-red-700' :
                         isOver ? 'bg-purple-100 text-purple-700' :
                         'bg-emerald-100 text-emerald-700'
                       }`}>
                         {isUnder ? 'Critical Low' : isOver ? 'Overstocked' : 'Optimal'}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SparePartsConsumptionView;

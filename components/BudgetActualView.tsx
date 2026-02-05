
import React, { useState, useMemo } from 'react';
import { MOCK_WORK_ORDERS, MOCK_ASSETS } from '../constants';
import { MaintenanceType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Search, Download, Wallet, TrendingUp,
  TrendingDown, Info, Filter, Calendar,
  Building2, Tractor, PieChart as PieIcon,
  ArrowUpRight, ArrowDownRight, Calculator
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const BudgetActualView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    department: 'All',
    equipment: 'All',
    searchTerm: ''
  });

  // Map sectors to departments for agricultural context
  const getDepartment = (sector: string) => {
    if (sector === 'Processing Hub') return 'Facility Operations';
    if (sector === 'North Field' || sector === 'North Farm') return 'Field Operations';
    if (sector === 'Sector 4' || sector === 'East Area') return 'Technical Irrigation';
    return 'General Maintenance';
  };

  const filteredOrders = useMemo(() => {
    return MOCK_WORK_ORDERS.filter(wo => {
      const matchSector = filters.sector === 'All' || wo.sector === filters.sector;
      const dept = getDepartment(wo.sector);
      const matchDept = filters.department === 'All' || dept === filters.department;
      const matchEquipment = filters.equipment === 'All' || wo.assetName === filters.equipment;
      const matchSearch = wo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          wo.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchDept && matchEquipment && matchSearch;
    });
  }, [filters]);

  // Financial aggregation
  const financeStats = useMemo(() => {
    const budget = filteredOrders.reduce((sum, wo) => sum + wo.plannedCost, 0);
    const actual = filteredOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
    const variance = actual - budget;
    const variancePct = budget > 0 ? (variance / budget) * 100 : 0;

    return { budget, actual, variance, variancePct };
  }, [filteredOrders]);

  // Chart: Budget vs Actual by Sector
  const budgetBySectorData = useMemo(() => {
    const sectors = Array.from(new Set(MOCK_WORK_ORDERS.map(wo => wo.sector)));
    return sectors.map(sector => {
      const orders = filteredOrders.filter(wo => wo.sector === sector);
      return {
        name: sector,
        Budget: orders.reduce((sum, wo) => sum + wo.plannedCost, 0),
        Actual: orders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0)
      };
    }).filter(d => d.Budget > 0 || d.Actual > 0);
  }, [filteredOrders]);

  // Chart: Cumulative Spend Trend (Mocked months)
  const cumulativeTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    let cumBudget = 0;
    let cumActual = 0;
    
    return months.map((month, i) => {
      // Logic for mock monthly distribution
      const monthlyBudget = financeStats.budget / 5 * (1 + (i * 0.1));
      const monthlyActual = financeStats.actual / 5 * (1 + (i * 0.15));
      cumBudget += monthlyBudget;
      cumActual += monthlyActual;
      return {
        name: month,
        Budget: Math.round(cumBudget),
        Actual: Math.round(cumActual)
      };
    });
  }, [financeStats]);

  // Variance Table Data (by Maintenance Type / Cost Element)
  const costElementData = useMemo(() => {
    return Object.values(MaintenanceType).map(type => {
      const orders = filteredOrders.filter(wo => wo.type === type);
      const budget = orders.reduce((sum, wo) => sum + wo.plannedCost, 0);
      const actual = orders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0);
      const variancePct = budget > 0 ? ((actual - budget) / budget) * 100 : 0;
      return { type, budget, actual, variancePct };
    }).filter(d => d.budget > 0 || d.actual > 0);
  }, [filteredOrders]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Cost Element,Budget,Actual,Variance %"].join(",") + "\n"
      + costElementData.map(d => `${d.type},${d.budget},${d.actual},${d.variancePct.toFixed(1)}%`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_variance_report.csv");
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
            <Wallet className="text-blue-600" />
            Budget vs. Actual Analysis
          </h2>
          <p className="text-gray-500 text-sm">Financial control dashboard for maintenance variance and department spend tracking.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Financial Matrix
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option>All</option>
            <option>Field Operations</option>
            <option>Facility Operations</option>
            <option>Technical Irrigation</option>
          </select>
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
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Equipment</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.equipment}
            onChange={(e) => setFilters({...filters, equipment: e.target.value})}
          >
            <option>All</option>
            {Array.from(new Set(MOCK_ASSETS.map(a => a.name))).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="lg:col-span-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search ID/Subject</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', department: 'All', equipment: 'All', searchTerm: ''})}
          className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Approved Budget (Planned)</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-gray-900">${financeStats.budget.toLocaleString()}</p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calculator size={24} /></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">Based on approved work order estimates</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Actual Spend (Total LTD)</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-gray-900">${financeStats.actual.toLocaleString()}</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={24} /></div>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2 font-bold flex items-center gap-1">
             Processed through SAP FI/CO
          </p>
        </div>
        <div className={`bg-white p-6 rounded-xl border border-gray-200 sap-shadow ${financeStats.variance > 0 ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-emerald-500'}`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget Variance</p>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-black ${financeStats.variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {financeStats.variance > 0 ? '+' : ''}${Math.abs(financeStats.variance).toLocaleString()}
            </p>
            <div className={`p-2 rounded-lg ${financeStats.variance > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {financeStats.variance > 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
            </div>
          </div>
          <p className={`text-[10px] font-bold mt-2 ${financeStats.variance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {financeStats.variancePct.toFixed(1)}% {financeStats.variance > 0 ? 'Over' : 'Under'} Budget
          </p>
        </div>
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-blue-500" />
            Budget vs Actual by Sector
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetBySectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend iconType="circle" />
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-500" />
            Cumulative Spend Trend (YTD)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="Budget" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Variance Table */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Variance Analysis by Cost Element</h3>
          <p className="text-xs text-gray-500">Detailed breakdown of maintenance types vs. approved financial thresholds.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Cost Element (Maint. Type)</th>
                <th className="px-6 py-4">Budget (Planned)</th>
                <th className="px-6 py-4">Actual (Incurred)</th>
                <th className="px-6 py-4">Abs. Variance</th>
                <th className="px-6 py-4">Variance %</th>
                <th className="px-6 py-4">Financial Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {costElementData.map((d, i) => {
                const absVar = d.actual - d.budget;
                const isOver = absVar > 0;
                
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                        <span className="font-bold text-gray-900">{d.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">${d.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">${d.actual.toLocaleString()}</td>
                    <td className={`px-6 py-4 font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isOver ? '+' : ''}${absVar.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className={`text-xs font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                           {d.variancePct.toFixed(1)}%
                         </span>
                         <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className={`h-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(Math.abs(d.variancePct), 100)}%` }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isOver ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isOver ? 'Variance Alert' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-black text-gray-900 border-t border-gray-200">
              <tr>
                <td className="px-6 py-4 uppercase">Total Maintenance Group</td>
                <td className="px-6 py-4">${financeStats.budget.toLocaleString()}</td>
                <td className="px-6 py-4">${financeStats.actual.toLocaleString()}</td>
                <td className={`px-6 py-4 ${financeStats.variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  ${financeStats.variance.toLocaleString()}
                </td>
                <td className="px-6 py-4" colSpan={2}>
                   {financeStats.variancePct.toFixed(1)}% Total Variance
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetActualView;

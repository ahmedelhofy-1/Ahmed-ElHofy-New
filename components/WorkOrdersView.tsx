
import React, { useState, useMemo } from 'react';
import { MOCK_WORK_ORDERS } from '../constants';
import { WorkOrderStatus, MaintenanceType, WorkOrderPriority } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Search, Plus, Download, Filter, 
  Calendar, Clock, User, ArrowUpRight, ArrowDownRight,
  TrendingUp, TrendingDown, Info
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const WorkOrdersView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    type: 'All',
    status: 'All',
    searchTerm: ''
  });

  const filteredData = useMemo(() => {
    return MOCK_WORK_ORDERS.filter(wo => {
      const matchSector = filters.sector === 'All' || wo.sector === filters.sector;
      const matchType = filters.type === 'All' || wo.type === filters.type;
      const matchStatus = filters.status === 'All' || wo.status === filters.status;
      const matchSearch = wo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          wo.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          wo.assetName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchType && matchStatus && matchSearch;
    });
  }, [filters]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = filteredData.length;
    const open = filteredData.filter(wo => wo.status !== WorkOrderStatus.COMPLETED).length;
    const closed = filteredData.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length;
    const outsource = filteredData.filter(wo => wo.type === MaintenanceType.OUTSOURCE).length;
    const overdue = filteredData.filter(wo => wo.isOverdue).length;
    return { total, open, closed, outsource, overdue };
  }, [filteredData]);

  // Chart Data Preparation
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(wo => {
      counts[wo.type] = (counts[wo.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const sectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(wo => {
      counts[wo.sector] = (counts[wo.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [filteredData]);

  const statusPieData = [
    { name: 'Open', value: stats.open, color: '#3b82f6' },
    { name: 'Closed', value: stats.closed, color: '#10b981' }
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Subject,Asset,Sector,Type,Status,Planned Cost,Actual Cost,Variance"].join(",") + "\n"
      + filteredData.map(wo => {
        const variance = wo.actualCost > 0 ? ((wo.actualCost - wo.plannedCost) / wo.plannedCost * 100).toFixed(1) + '%' : '0%';
        return [wo.id, wo.title, wo.assetName, wo.sector, wo.type, wo.status, wo.plannedCost, wo.actualCost, variance].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maintenance_performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Orders Overview</h2>
          <p className="text-gray-500 text-sm">Monitor maintenance workload, status, and execution performance.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export to Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md">
            <Plus size={20} />
            New Order
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search Order</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="WO# or Subject..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector / Farm</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>North Farm</option>
            <option>South Vineyard</option>
            <option>East Area</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Maintenance Type</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option>All</option>
            {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option>All</option>
            {Object.values(WorkOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', type: 'All', status: 'All', searchTerm: ''})}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'border-blue-500' },
          { label: 'Open Orders', value: stats.open, color: 'border-amber-500' },
          { label: 'Closed Orders', value: stats.closed, color: 'border-emerald-500' },
          { label: 'Outsource M', value: stats.outsource, color: 'border-purple-500' },
          { label: 'Overdue Orders', value: stats.overdue, color: 'border-red-500' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 rounded-xl border-l-4 ${kpi.color} border border-gray-200 sap-shadow`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            Orders by Maintenance Type
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            Open vs. Closed Distribution
          </h3>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Orders by Sector / Farm</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Historical Order Volume (Last 5 Months)</h3>
          <div className="h-[250px] flex items-center justify-center text-gray-400 italic text-sm">
             Trend analysis visualization placeholder - Filtered by current selection
          </div>
        </div>
      </div>

      {/* Performance Section - Table/Matrix */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Planned vs. Actual Performance</h3>
            <p className="text-xs text-gray-500">Execution accuracy across Time, Cost, and Resource utilization.</p>
          </div>
          <div className="flex gap-2">
             <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-red-500" /> Over Budget</span>
             <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Within Budget</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID & Status</th>
                <th className="px-6 py-4">Asset / Sector</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Planned Cost</th>
                <th className="px-6 py-4">Actual Cost</th>
                <th className="px-6 py-4">Cost Variance</th>
                <th className="px-6 py-4">Hours (P / A)</th>
                <th className="px-6 py-4">Variance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((wo) => {
                const costVar = wo.actualCost - wo.plannedCost;
                const isOver = costVar > 0;
                const varPercent = wo.plannedCost > 0 ? (costVar / wo.plannedCost * 100).toFixed(1) : 0;
                
                return (
                  <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-blue-600">{wo.id}</span>
                        <span className={`text-[10px] font-bold uppercase ${
                          wo.status === WorkOrderStatus.COMPLETED ? 'text-emerald-500' : 'text-amber-500'
                        }`}>{wo.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{wo.assetName}</span>
                        <span className="text-xs text-gray-500">{wo.sector}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {wo.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">${wo.plannedCost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">
                      {wo.actualCost > 0 ? `$${wo.actualCost.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {wo.actualCost > 0 ? (
                        <div className={`flex items-center gap-1 font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isOver ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          ${Math.abs(costVar).toLocaleString()}
                        </div>
                      ) : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {wo.plannedHours}h / <span className="text-gray-900 font-semibold">{wo.actualHours}h</span>
                    </td>
                    <td className="px-6 py-4">
                      {wo.actualCost > 0 ? (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          Number(varPercent) > 10 ? 'bg-red-100 text-red-700' : 
                          Number(varPercent) > 0 ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {varPercent}%
                        </span>
                      ) : <span className="text-gray-300">---</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-red-800">
            <Info size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Key Issues Identified</h3>
          </div>
          <ul className="space-y-3">
            {stats.overdue > 0 && (
              <li className="flex items-start gap-2 text-sm text-red-700">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                Critical: {stats.overdue} maintenance orders are past their scheduled due date. High risk of asset failure.
              </li>
            )}
            <li className="flex items-start gap-2 text-sm text-red-700">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              Budget Variance: Repair costs in Sector 'East Area' are 12% higher than planned.
            </li>
            <li className="flex items-start gap-2 text-sm text-red-700">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              Resource Gap: Emergency orders are consuming 40% of available man-hours.
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-emerald-800">
            <TrendingUp size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Planner Recommendations</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Optimize: Shift 15% of Corrective M to Preventive M cycles to reduce emergency costs.
            </li>
            <li className="flex items-start gap-2 text-sm text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Review: Audit Outsource M contracts for Sorting Line A; actual costs exceeding benchmarks.
            </li>
            <li className="flex items-start gap-2 text-sm text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Forecast: Increase lubricant stock in North Farm by 20% ahead of harvest peak.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkOrdersView;


import React, { useState, useMemo } from 'react';
import { MOCK_WORK_ORDERS } from '../constants';
import { WorkOrderStatus, MaintenanceType, AgriculturalSeason } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  Search, Download, Filter, 
  Calendar, CheckCircle2, Clock, ShieldCheck,
  TrendingUp, Info, ArrowRight, Sprout
} from 'lucide-react';

const PMPerformanceView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    plan: 'All',
    searchTerm: '',
    date: ''
  });

  // Filter for ONLY Preventive Maintenance or Annual Overhauls (often treated as large PMs)
  const pmOrders = useMemo(() => {
    return MOCK_WORK_ORDERS.filter(wo => 
      wo.type === MaintenanceType.PREVENTIVE || wo.type === MaintenanceType.ANNUAL
    );
  }, []);

  const filteredData = useMemo(() => {
    return pmOrders.filter(wo => {
      const matchSector = filters.sector === 'All' || wo.sector === filters.sector;
      const matchPlan = filters.plan === 'All' || wo.maintenancePlan === filters.plan;
      const matchSearch = wo.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          wo.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          (wo.maintenancePlan || '').toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchPlan && matchSearch;
    });
  }, [pmOrders, filters]);

  // Unique Plans for Dropdown
  const plans = useMemo(() => {
    const unique = new Set(pmOrders.map(wo => wo.maintenancePlan).filter(Boolean));
    return Array.from(unique);
  }, [pmOrders]);

  // KPI Calculations
  const stats = useMemo(() => {
    const planned = filteredData.length;
    const completed = filteredData.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length;
    const overdue = filteredData.filter(wo => wo.isOverdue).length;
    const compliance = planned > 0 ? (completed / planned * 100) : 0;
    return { planned, completed, overdue, compliance };
  }, [filteredData]);

  // Gauge Data (PM Compliance)
  const complianceGaugeData = [
    { name: 'Completed', value: stats.compliance, color: '#10b981' },
    { name: 'Remaining', value: 100 - stats.compliance, color: '#f3f4f6' }
  ];

  // Chart: PM Orders by Status
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(wo => {
      counts[wo.status] = (counts[wo.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Completion Trend (Last 5 Months Mock)
  const trendData = [
    { name: 'Jan', compliance: 85 },
    { name: 'Feb', compliance: 88 },
    { name: 'Mar', compliance: 92 },
    { name: 'Apr', compliance: stats.compliance },
    { name: 'May', compliance: 75 } // Projected
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Plan,Equipment,Sector,Season,Status,Due Date,Compliance Status"].join(",") + "\n"
      + filteredData.map(wo => {
        return [wo.id, wo.maintenancePlan || 'None', wo.assetName, wo.sector, wo.season || 'N/A', wo.status, wo.dueDate, wo.isOverdue ? 'Overdue' : 'OK'].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pm_seasonal_compliance_report.csv");
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
            <ShieldCheck className="text-emerald-500" />
            Preventive Maintenance Performance
          </h2>
          <p className="text-gray-500 text-sm">Control PM execution schedules and ensure alignment with agricultural seasons.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Seasonal Alignment
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>North Field</option>
            <option>Sector 4</option>
            <option>East Area</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Maintenance Plan</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.plan}
            onChange={(e) => setFilters({...filters, plan: e.target.value})}
          >
            <option>All</option>
            {plans.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search WO# or Equipment..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', plan: 'All', searchTerm: '', date: ''})}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset View
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Planned PM Orders', value: stats.planned, color: 'border-blue-500', icon: <Calendar size={20} className="text-blue-500" /> },
          { label: 'Completed PM Orders', value: stats.completed, color: 'border-emerald-500', icon: <CheckCircle2 size={20} className="text-emerald-500" /> },
          { label: 'PM Compliance %', value: `${stats.compliance.toFixed(1)}%`, color: 'border-emerald-600', icon: <ShieldCheck size={20} className="text-emerald-600" /> },
          { label: 'Overdue PM Orders', value: stats.overdue, color: 'border-red-500', icon: <Clock size={20} className="text-red-500" /> },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl border-l-4 ${kpi.color} border border-gray-200 sap-shadow flex items-center justify-between`}>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Visuals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider text-center">PM Compliance Rate</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceGaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {complianceGaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
              <span className="text-4xl font-black text-gray-900">{stats.compliance.toFixed(0)}%</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Actual Compliance</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">PM Orders by Status</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">PM Completion Trend</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#10b981'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Alignment Section */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sprout size={20} className="text-emerald-500" />
              PM Schedule vs. Agricultural Season
            </h3>
            <p className="text-xs text-gray-500">Validation of maintenance timing relative to crop cycles for availability optimization.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wider">
            Current Season: Pre-Harvest
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">WO# & Plan Name</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Agri-Season</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Execution Status</th>
                <th className="px-6 py-4">Alignment Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((wo) => {
                const isMisaligned = (wo.season === AgriculturalSeason.HARVEST && wo.status !== WorkOrderStatus.COMPLETED);
                
                return (
                  <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-blue-600">{wo.id}</span>
                        <span className="text-xs text-gray-500">{wo.maintenancePlan}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{wo.assetName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        wo.season === AgriculturalSeason.HARVEST ? 'bg-orange-100 text-orange-700' :
                        wo.season === AgriculturalSeason.PRE_HARVEST ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {wo.season}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{wo.dueDate}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          wo.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                          {wo.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      {isMisaligned ? (
                        <div className="flex items-center gap-1.5 text-red-600 font-bold text-[10px] uppercase">
                          <Clock size={12} /> High - Harvest Conflict
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                          <ShieldCheck size={12} /> Optimal Alignment
                        </div>
                      )}
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
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-amber-800">
            <Info size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">PM Risks Identified</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-amber-700">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              Critical Overlap: 5 major Harvester PMs are scheduled for completion only 2 days before Harvest starts.
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-700">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              Resource Drain: Tractor lubrication cycles in North Field are slipping behind schedule due to high usage.
            </li>
            <li className="flex items-start gap-2 text-sm text-amber-700">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              Parts Latency: Level 2 PM kits for Valmont pivots have a 10-day lead time, risking compliance.
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-blue-800">
            <TrendingUp size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Improvement Actions</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">A1</div>
                 <p className="text-xs font-semibold text-gray-800">Accelerate Harvester PM completion by 48hrs.</p>
               </div>
               <ArrowRight size={14} className="text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">A2</div>
                 <p className="text-xs font-semibold text-gray-800">Re-route lubricant stock from South Warehouse.</p>
               </div>
               <ArrowRight size={14} className="text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">A3</div>
                 <p className="text-xs font-semibold text-gray-800">Automate Pivot Part Requisitions via PM triggering.</p>
               </div>
               <ArrowRight size={14} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMPerformanceView;

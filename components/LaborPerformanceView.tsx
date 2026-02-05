
import React, { useState, useMemo } from 'react';
import { MOCK_TECHNICIANS, MOCK_WORK_ORDERS } from '../constants';
import { WorkOrderStatus, WorkOrder } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, ColumnChart, ComposedChart
} from 'recharts';
import { 
  Search, Download, Users, Clock, 
  TrendingUp, Award, MapPin, ClipboardList,
  UserCheck, Briefcase, Filter, Calendar
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const LaborPerformanceView: React.FC = () => {
  const [filters, setFilters] = useState({
    site: 'All',
    technician: 'All',
    searchTerm: '',
    dateRange: ''
  });

  const filteredTechnicians = useMemo(() => {
    return MOCK_TECHNICIANS.filter(t => {
      const matchSite = filters.site === 'All' || t.site === filters.site;
      const matchTech = filters.technician === 'All' || t.name === filters.technician;
      const matchSearch = t.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          t.role.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSite && matchTech && matchSearch;
    });
  }, [filters]);

  // Aggregate stats per technician
  const techStats = useMemo(() => {
    return filteredTechnicians.map(tech => {
      const orders = MOCK_WORK_ORDERS.filter(wo => wo.assignedTo === tech.name);
      const hoursWorked = orders.reduce((sum, wo) => sum + (wo.actualHours || 0), 0);
      const ordersCompleted = orders.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length;
      const plannedHours = orders.reduce((sum, wo) => sum + (wo.plannedHours || 0), 0);
      
      // Efficiency = (Planned / Actual) * 100
      const efficiency = hoursWorked > 0 ? (plannedHours / hoursWorked) * 100 : 0;

      return {
        ...tech,
        hoursWorked,
        ordersCompleted,
        plannedHours,
        efficiency
      };
    });
  }, [filteredTechnicians]);

  // KPI Row Calculations
  const kpis = useMemo(() => {
    const totalLaborHours = techStats.reduce((sum, t) => sum + t.hoursWorked, 0);
    const totalWorkingHours = techStats.reduce((sum, t) => sum + t.hoursWorked, 0); // Simplified for direct labor
    const avgHoursPerTech = techStats.length > 0 ? totalLaborHours / techStats.length : 0;
    
    // Productivity Index: (Avg Efficiency across techs)
    const productivityIndex = techStats.length > 0 
      ? techStats.reduce((sum, t) => sum + t.efficiency, 0) / techStats.length 
      : 0;

    return { totalLaborHours, totalWorkingHours, avgHoursPerTech, productivityIndex };
  }, [techStats]);

  // Chart: Labor Hours per Technician
  const laborHoursChartData = useMemo(() => {
    return techStats
      .sort((a, b) => b.hoursWorked - a.hoursWorked)
      .map(t => ({ name: t.name, hours: t.hoursWorked }));
  }, [techStats]);

  // Chart: Workload Distribution by Site
  const workloadBySiteData = useMemo(() => {
    const sites = Array.from(new Set(MOCK_TECHNICIANS.map(t => t.site)));
    return sites.map(site => {
      const siteHours = techStats
        .filter(t => t.site === site)
        .reduce((sum, t) => sum + t.hoursWorked, 0);
      return { name: site, hours: siteHours };
    });
  }, [techStats]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Technician,Role,Site,Hours Worked,Orders Completed,Efficiency %"].join(",") + "\n"
      + techStats.map(t => {
        return [t.id, t.name, t.role, t.site, t.hoursWorked, t.ordersCompleted, t.efficiency.toFixed(1)].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "labor_performance_report.csv");
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
            <Users className="text-blue-600" />
            Labor & Manpower Performance
          </h2>
          <p className="text-gray-500 text-sm">Measure workforce productivity, efficiency benchmarks, and workload utilization.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Manpower Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Workshop / Site</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.site}
            onChange={(e) => setFilters({...filters, site: e.target.value})}
          >
            <option>All</option>
            <option>North Workshop</option>
            <option>East Area Hub</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Technician</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.technician}
            onChange={(e) => setFilters({...filters, technician: e.target.value})}
          >
            <option>All</option>
            {MOCK_TECHNICIANS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date Period</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Search Detail</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Name or ID..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Labor Hours', value: `${kpis.totalLaborHours.toFixed(1)} h`, icon: <Clock className="text-blue-500" /> },
          { label: 'Total Working Hours', value: `${kpis.totalWorkingHours.toFixed(1)} h`, icon: <Briefcase className="text-emerald-500" /> },
          { label: 'Avg Hours / Technician', value: `${kpis.avgHoursPerTech.toFixed(1)} h`, icon: <UserCheck className="text-amber-500" /> },
          { label: 'Productivity Index', value: `${kpis.productivityIndex.toFixed(0)}%`, icon: <TrendingUp className="text-purple-500" /> },
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

      {/* Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-blue-500" />
            Labor Hours per Technician
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laborHoursChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 9}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={15}>
                  {laborHoursChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={16} className="text-emerald-500" />
            Workload Distribution by Site (Hours)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadBySiteData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Matrix Table */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Technician Performance Matrix</h3>
            <p className="text-xs text-gray-500">Detailed overview of workforce output and task execution efficiency.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Technician Info</th>
                <th className="px-6 py-4">Workshop</th>
                <th className="px-6 py-4 text-center">Hours Worked</th>
                <th className="px-6 py-4 text-center">Orders Completed</th>
                <th className="px-6 py-4">Productivity</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {techStats.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{t.name}</span>
                        <span className="text-[10px] text-gray-500">{t.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      {t.site}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-900">
                    {t.hoursWorked.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">
                    {t.ordersCompleted}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold ${t.efficiency >= 100 ? 'text-emerald-600' : t.efficiency > 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                         {t.efficiency.toFixed(0)}%
                       </span>
                       <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full ${t.efficiency >= 100 ? 'bg-emerald-500' : t.efficiency > 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(t.efficiency, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.efficiency >= 100 ? 'bg-emerald-100 text-emerald-700' :
                      t.efficiency > 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.efficiency >= 100 ? 'High Performance' : t.efficiency > 80 ? 'Standard' : 'Under Target'}
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

export default LaborPerformanceView;

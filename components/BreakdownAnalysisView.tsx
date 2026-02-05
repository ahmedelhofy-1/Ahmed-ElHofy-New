
import React, { useState, useMemo } from 'react';
import { MOCK_BREAKDOWNS } from '../constants';
import { BreakdownRecord } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  Search, Download, Filter, 
  Activity, Clock, AlertTriangle, Hammer,
  TrendingUp, TrendingDown, Info, Calendar
} from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

const BreakdownAnalysisView: React.FC = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    failureCode: 'All',
    searchTerm: '',
    startDate: '',
    endDate: ''
  });

  const filteredData = useMemo(() => {
    return MOCK_BREAKDOWNS.filter(f => {
      const matchSector = filters.sector === 'All' || f.sector === filters.sector;
      const matchCode = filters.failureCode === 'All' || f.failureCode === filters.failureCode;
      const matchSearch = f.assetName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          f.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          f.assetId.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchCode && matchSearch;
    });
  }, [filters]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = filteredData.length;
    const totalDowntime = filteredData.reduce((acc, curr) => acc + curr.downtimeHours, 0);
    const avgMtbf = total > 0 ? filteredData.reduce((acc, curr) => acc + curr.mtbf, 0) / total : 0;
    const avgMttr = total > 0 ? filteredData.reduce((acc, curr) => acc + curr.mttr, 0) / total : 0;
    return { total, totalDowntime, avgMtbf, avgMttr };
  }, [filteredData]);

  // Chart: Failure Frequency by Failure Code
  const codeFrequencyData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(f => {
      counts[f.failureCode] = (counts[f.failureCode] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Chart: Top Failing Equipment
  const topFailingData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(f => {
      counts[f.assetName] = (counts[f.assetName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredData]);

  // Chart: Trend Over Time (Simplified)
  const trendData = useMemo(() => {
    const trends: Record<string, number> = {};
    filteredData.forEach(f => {
      const month = f.date.substring(0, 7); // YYYY-MM
      trends[month] = (trends[month] || 0) + 1;
    });
    return Object.entries(trends)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Failure ID,Asset,Sector,Date,Code,Downtime(h),MTBF(h),MTTR(h),Root Cause,Status"].join(",") + "\n"
      + filteredData.map(f => {
        return [f.id, f.assetName, f.sector, f.date, f.failureCode, f.downtimeHours, f.mtbf, f.mttr, `"${f.rootCause}"`, f.correctiveActionStatus].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reliability_analysis_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Breakdown & Failure Analysis</h2>
          <p className="text-gray-500 text-sm">Identify chronic failures and reliability risks through engineering data.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Reliability Matrix
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Asset Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Asset or failure ID..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector / Farm</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>North Field</option>
            <option>East Area</option>
            <option>Sector 4</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Failure Code</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            value={filters.failureCode}
            onChange={(e) => setFilters({...filters, failureCode: e.target.value})}
          >
            <option>All</option>
            <option>Mechanical</option>
            <option>Electrical</option>
            <option>Hydraulic</option>
            <option>Sensor</option>
            <option>Engine</option>
            <option>Software</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date Range</label>
          <div className="flex gap-1">
            <input type="date" className="w-1/2 p-1 text-[10px] border border-gray-200 rounded" />
            <input type="date" className="w-1/2 p-1 text-[10px] border border-gray-200 rounded" />
          </div>
        </div>
        <button 
          onClick={() => setFilters({sector: 'All', failureCode: 'All', searchTerm: '', startDate: '', endDate: ''})}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Clear View
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Breakdowns</p>
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-bold">
            <TrendingUp size={12} /> +2 Since last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. MTBF (h)</p>
            <Activity size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgMtbf.toFixed(1)}</p>
          <p className="mt-2 text-[10px] text-gray-400 font-medium">Mean Time Between Failures</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. MTTR (h)</p>
            <Hammer size={18} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgMttr.toFixed(1)}</p>
          <p className="mt-2 text-[10px] text-gray-400 font-medium">Mean Time to Repair</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Downtime (h)</p>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalDowntime.toFixed(1)}</p>
          <p className="mt-2 text-[10px] text-gray-400 font-medium">Accumulated production loss</p>
        </div>
      </div>

      {/* Main Visuals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Top 10 Failing Equipment</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFailingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 9}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Failure by Failure Code</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={codeFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={25}>
                  {codeFrequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Breakdown Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reliability Section - Table */}
      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Reliability Section (MTBF & MTTR Matrix)</h3>
          <p className="text-xs text-gray-500">Technical performance metrics per asset for reliability engineering.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Equipment Code & Name</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Failure Code</th>
                <th className="px-6 py-4">Downtime (Hrs)</th>
                <th className="px-6 py-4">MTBF (Hrs)</th>
                <th className="px-6 py-4">MTTR (Hrs)</th>
                <th className="px-6 py-4">Reliability Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{f.assetName}</span>
                      <span className="text-[10px] font-mono text-blue-600">{f.assetId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{f.sector}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-600">
                      {f.failureCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-600">{f.downtimeHours}h</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.mtbf}h</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{f.mttr}h</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className={`w-2 h-2 rounded-full ${f.mtbf > 500 ? 'bg-emerald-500' : f.mtbf > 200 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">
                        {f.mtbf > 500 ? 'High' : f.mtbf > 200 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-blue-800">
            <Info size={18} className="text-blue-500" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Root Cause Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs font-bold text-gray-900 mb-1">Electronic Fatigue in Sector 4</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Repetitive voltage fluctuations in the Greenhouse area (Sector 4) are causing premature failure of humidity sensors. Recommendation: Install surge protectors on main control buses.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-xs font-bold text-gray-900 mb-1">Hydraulic Wear Pattern</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tractor fleet (A-101 Series) showing 15% shorter MTBF for hydraulic cylinders. Root cause traced to non-OEM seals used in last service cycle.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex items-center gap-2 mb-4 text-emerald-800">
            <TrendingUp size={18} className="text-emerald-500" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Corrective Action Status</h3>
          </div>
          <div className="space-y-3">
            {[
              { id: 'CA-1002', task: 'Voltage Audit - East Area', status: 'In Progress', priority: 'High' },
              { id: 'CA-1005', task: 'Replace non-OEM hydraulic seals', status: 'Pending Approval', priority: 'Critical' },
              { id: 'CA-0994', task: 'Sorting Line Belt Calibration', status: 'Resolved', priority: 'Medium' },
              { id: 'CA-1008', task: 'Lightning protection installation', status: 'Open', priority: 'High' },
            ].map((ca, i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 font-mono">{ca.id}</p>
                  <p className="text-xs font-medium text-gray-800">{ca.task}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    ca.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                    ca.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {ca.status}
                  </span>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{ca.priority} Priority</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakdownAnalysisView;

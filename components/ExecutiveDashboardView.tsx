
import React, { useMemo } from 'react';
import { MOCK_ASSETS, MOCK_WORK_ORDERS, MOCK_BREAKDOWNS } from '../constants';
import { AssetStatus, MaintenanceType } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, ComposedChart, Area
} from 'recharts';
import { 
  ShieldAlert, Activity, TrendingUp, BarChart3, 
  Target, Zap, AlertTriangle, CheckCircle2,
  FileText, Briefcase, ChevronRight, Info
} from 'lucide-react';

const ExecutiveDashboardView: React.FC = () => {
  // Strategic KPI Calculations
  const metrics = useMemo(() => {
    const totalAssets = MOCK_ASSETS.length;
    const operationalAssets = MOCK_ASSETS.filter(a => a.status === AssetStatus.OPERATIONAL).length;
    
    // Availability %: (Operational / Total) * 100
    const availability = (operationalAssets / totalAssets) * 100;
    
    // Reliability %: Based on Health Scores
    const avgHealth = MOCK_ASSETS.reduce((acc, curr) => acc + curr.healthScore, 0) / totalAssets;
    
    // OEE % (Critical Equipment): Combined metric of health and uptime (Mocked logic)
    const criticalAssets = MOCK_ASSETS.filter(a => a.healthScore < 80);
    const oee = criticalAssets.length > 0 
      ? criticalAssets.reduce((acc, curr) => acc + curr.healthScore, 0) / criticalAssets.length * 0.95
      : 94.5; // High benchmark if all healthy

    // PM vs CM Ratio
    const pmCount = MOCK_WORK_ORDERS.filter(wo => wo.type === MaintenanceType.PREVENTIVE || wo.type === MaintenanceType.ANNUAL).length;
    const cmCount = MOCK_WORK_ORDERS.filter(wo => wo.type === MaintenanceType.CORRECTIVE || wo.type === MaintenanceType.EMERGENCY).length;
    const pmCmRatio = cmCount > 0 ? (pmCount / cmCount).toFixed(1) : pmCount.toString();

    return { availability, reliability: avgHealth, oee, pmCmRatio };
  }, []);

  // Efficiency Costs
  const costMetrics = useMemo(() => {
    const totalCost = MOCK_WORK_ORDERS.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
    const farmCount = new Set(MOCK_ASSETS.map(a => a.sector)).size;
    const equipmentCount = MOCK_ASSETS.length;
    
    const costPerFarm = totalCost / (farmCount || 1);
    const costPerEquipment = totalCost / (equipmentCount || 1);

    return { costPerFarm, costPerEquipment };
  }, []);

  // Trend Data for Availability & OEE (Mocked Months)
  const trendData = [
    { name: 'Jan', Availability: 92, OEE: 88, Target: 90 },
    { name: 'Feb', Availability: 94, OEE: 89, Target: 90 },
    { name: 'Mar', Availability: 89, OEE: 85, Target: 90 },
    { name: 'Apr', Availability: metrics.availability.toFixed(0), OEE: metrics.oee.toFixed(0), Target: 90 },
  ];

  // RAG Status Logic
  const getStatusColor = (val: number, target: number) => {
    if (val >= target) return 'bg-emerald-500';
    if (val >= target - 10) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" />
            Executive Maintenance Dashboard
          </h2>
          <p className="text-gray-500 text-sm">Strategic overview of technical reliability, operational efficiency, and capital risk.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Last Refreshed</p>
          <p className="text-xs font-semibold text-gray-900">May 12, 2024 - 08:30 AM</p>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Asset Availability', value: `${metrics.availability.toFixed(1)}%`, target: 90, icon: <Activity className="text-blue-500" /> },
          { label: 'Reliability Index', value: `${metrics.reliability.toFixed(1)}%`, target: 85, icon: <Target className="text-emerald-500" /> },
          { label: 'Critical OEE', value: `${metrics.oee.toFixed(1)}%`, target: 80, icon: <Zap className="text-amber-500" /> },
          { label: 'PM vs CM Ratio', value: `${metrics.pmCmRatio} : 1`, target: 3, icon: <BarChart3 className="text-purple-500" />, sub: 'Optimal > 3.0' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-50 p-2 rounded-lg">{kpi.icon}</div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(parseFloat(kpi.value), kpi.target)} animate-pulse`} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black text-gray-900">{kpi.value}</p>
            {kpi.sub && <p className="text-[10px] text-gray-500 mt-1 font-semibold">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Strategic Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              Strategic Trend: Availability & OEE vs. Target
            </h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><div className="w-2 h-0.5 bg-blue-500" /> Availability</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><div className="w-2 h-0.5 bg-emerald-500" /> OEE</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><div className="w-2 h-0.5 bg-gray-200" /> Target</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="Target" fill="#f8fafc" stroke="#e2e8f0" />
                <Line type="monotone" dataKey="Availability" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="OEE" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-xs font-bold text-gray-800 mb-8 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={16} className="text-emerald-500" />
            Performance Traffic Lights
          </h3>
          <div className="space-y-6">
             <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">A</div>
                 <div>
                   <p className="text-xs font-bold text-emerald-900">Technical Uptime</p>
                   <p className="text-[10px] text-emerald-700 font-medium">Within healthy thresholds</p>
                 </div>
               </div>
               <ChevronRight className="text-emerald-400" />
             </div>
             <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">B</div>
                 <div>
                   <p className="text-xs font-bold text-amber-900">PM Compliance</p>
                   <p className="text-[10px] text-amber-700 font-medium">Marginal slippage (75%)</p>
                 </div>
               </div>
               <ChevronRight className="text-amber-400" />
             </div>
             <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">C</div>
                 <div>
                   <p className="text-xs font-bold text-red-900">Spare Parts Latency</p>
                   <p className="text-[10px] text-red-700 font-medium">Immediate procurement risk</p>
                 </div>
               </div>
               <ChevronRight className="text-red-400" />
             </div>
          </div>
        </div>
      </div>

      {/* Cost Indicators Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow flex items-center gap-6">
           <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
             <Briefcase size={32} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cost Per operational Farm</p>
              <p className="text-3xl font-black text-gray-900">${costMetrics.costPerFarm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-1">
                <TrendingUp size={12} /> +4% vs Q1 Benchmark
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow flex items-center gap-6">
           <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
             <Briefcase size={32} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cost Per Equipment Unit</p>
              <p className="text-3xl font-black text-gray-900">${costMetrics.costPerEquipment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                <CheckCircle2 size={12} /> -8% efficiency gain YTD
              </div>
           </div>
        </div>
      </div>

      {/* Executive Strategic Notes Panel */}
      <div className="bg-[#0a1e36] text-white rounded-2xl p-8 sap-shadow overflow-hidden relative border border-blue-900/50">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <ShieldAlert size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 space-y-6">
             <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <AlertTriangle size={18} />
               Executive Risks Assessment
             </h4>
             <ul className="space-y-4">
                <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                   <div>
                      <p className="text-sm font-bold text-white">Irrigation Aging Out (Sector 4)</p>
                      <p className="text-xs text-blue-300 leading-relaxed">System S4 component life has exceeded 85% of design capacity. Failure probability during upcoming Harvest is <span className="text-red-400 font-bold">High</span>.</p>
                   </div>
                </li>
                <li className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                   <div>
                      <p className="text-sm font-bold text-white">CapEx Variance Alert</p>
                      <p className="text-xs text-blue-300 leading-relaxed">Actual maintenance spend on new Sorting Line A is tracking <span className="text-amber-400 font-bold">12% over</span> initial commissioning budget.</p>
                   </div>
                </li>
             </ul>
          </div>

          <div className="md:w-1/2 space-y-6">
             <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <Info size={18} />
               Strategic Actions Required
             </h4>
             <div className="space-y-4">
                <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 hover:bg-blue-900/60 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Phase-In Predictive Maintenance</p>
                    <ChevronRight size={14} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] text-blue-200">Approve IoT sensor rollout for critical Harvesters to prevent emergency shutdowns.</p>
                </div>
                <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 hover:bg-blue-900/60 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Audit External Service Contracts</p>
                    <ChevronRight size={14} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] text-blue-200">Renegotiate Outsource M agreements for Sorting Facility to align with actual usage hours.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardView;

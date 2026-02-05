
import React, { useMemo } from 'react';
import { MOCK_ASSETS, MOCK_WORK_ORDERS } from '../constants';
import { AssetStatus, MaintenanceType } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Area, ComposedChart
} from 'recharts';
import { 
  ShieldAlert, Activity, TrendingUp, BarChart3, 
  Target, Zap, AlertTriangle, CheckCircle2,
  Briefcase, ChevronRight, Info
} from 'lucide-react';

interface ExecutiveDashboardViewProps {
  onNavigate: (tabId: string) => void;
}

const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({ onNavigate }) => {
  // Strategic KPI Calculations
  const metrics = useMemo(() => {
    const totalAssets = MOCK_ASSETS.length;
    const operationalAssets = MOCK_ASSETS.filter(a => a.status === AssetStatus.OPERATIONAL).length;
    const availability = (operationalAssets / totalAssets) * 100;
    const avgHealth = MOCK_ASSETS.reduce((acc, curr) => acc + curr.healthScore, 0) / totalAssets;
    const criticalAssets = MOCK_ASSETS.filter(a => a.healthScore < 80);
    const oee = criticalAssets.length > 0 
      ? criticalAssets.reduce((acc, curr) => acc + curr.healthScore, 0) / criticalAssets.length * 0.95
      : 94.5;

    const pmCount = MOCK_WORK_ORDERS.filter(wo => wo.type === MaintenanceType.PREVENTIVE || wo.type === MaintenanceType.ANNUAL).length;
    const cmCount = MOCK_WORK_ORDERS.filter(wo => wo.type === MaintenanceType.CORRECTIVE || wo.type === MaintenanceType.EMERGENCY).length;
    const pmCmRatio = cmCount > 0 ? (pmCount / cmCount).toFixed(1) : pmCount.toString();

    return { availability, reliability: avgHealth, oee, pmCmRatio };
  }, []);

  const costMetrics = useMemo(() => {
    const totalCost = MOCK_WORK_ORDERS.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
    const farmCount = new Set(MOCK_ASSETS.map(a => a.sector)).size;
    const equipmentCount = MOCK_ASSETS.length;
    return { costPerFarm: totalCost / (farmCount || 1), costPerEquipment: totalCost / (equipmentCount || 1) };
  }, []);

  const trendData = [
    { name: 'Jan', Availability: 92, OEE: 88, Target: 90 },
    { name: 'Feb', Availability: 94, OEE: 89, Target: 90 },
    { name: 'Mar', Availability: 89, OEE: 85, Target: 90 },
    { name: 'Apr', Availability: metrics.availability.toFixed(0), OEE: metrics.oee.toFixed(0), Target: 90 },
  ];

  const getStatusColor = (val: number, target: number) => {
    if (val >= target) return 'bg-emerald-500';
    if (val >= target - 10) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const kpis = [
    { 
      label: 'Asset Availability', 
      value: `${metrics.availability.toFixed(1)}%`, 
      target: 90, 
      icon: <Activity className="text-blue-500" />,
      tooltip: "Percentage of technical assets in 'Operational' status vs total fleet.",
      drillTab: 'assets'
    },
    { 
      label: 'Reliability Index', 
      value: `${metrics.reliability.toFixed(1)}%`, 
      target: 85, 
      icon: <Target className="text-emerald-500" />,
      tooltip: "Weighted average health score based on sensor data and age.",
      drillTab: 'health-assessment'
    },
    { 
      label: 'Critical OEE', 
      value: `${metrics.oee.toFixed(1)}%`, 
      target: 80, 
      icon: <Zap className="text-amber-500" />,
      tooltip: "Overall Equipment Effectiveness for bottleneck assets (Pivots/Sorting).",
      drillTab: 'breakdown-analysis'
    },
    { 
      label: 'PM vs CM Ratio', 
      value: `${metrics.pmCmRatio} : 1`, 
      target: 3, 
      icon: <BarChart3 className="text-purple-500" />, 
      sub: 'Optimal > 3.0',
      tooltip: "Preventive Maintenance vs Corrective Maintenance volume. Higher is better.",
      drillTab: 'pm-performance'
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" />
            Executive Dashboard
          </h2>
          <p className="text-gray-500 text-sm">Strategic decision support and fleet reliability benchmarking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => onNavigate(kpi.drillTab)}
            className="group bg-white p-6 rounded-xl border border-gray-200 sap-shadow cursor-pointer hover:border-blue-300 transition-all active:scale-95"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">{kpi.icon}</div>
              <div className="flex items-center gap-2">
                <div className="relative group/tooltip">
                   <Info size={14} className="text-gray-300 cursor-help" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                      {kpi.tooltip}
                   </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(parseFloat(kpi.value), kpi.target)} animate-pulse`} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black text-gray-900">{kpi.value}</p>
            {kpi.sub && <p className="text-[10px] text-gray-500 mt-1 font-semibold">{kpi.sub}</p>}
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Details <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              Strategic Performance Trend (Availability vs. OEE)
            </h3>
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
            Reliability Status (RAG)
          </h3>
          <div className="space-y-4">
             <div onClick={() => onNavigate('assets')} className="cursor-pointer flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">A</div>
                 <div><p className="text-xs font-bold text-emerald-900">Technical Uptime</p><p className="text-[10px] text-emerald-700">Healthy levels</p></div>
               </div>
               <ChevronRight className="text-emerald-400" />
             </div>
             <div onClick={() => onNavigate('pm-performance')} className="cursor-pointer flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-100 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">B</div>
                 <div><p className="text-xs font-bold text-amber-900">PM Compliance</p><p className="text-[10px] text-amber-700">Slight delays</p></div>
               </div>
               <ChevronRight className="text-amber-400" />
             </div>
             <div onClick={() => onNavigate('inventory')} className="cursor-pointer flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">C</div>
                 <div><p className="text-xs font-bold text-red-900">Spare Parts Latency</p><p className="text-[10px] text-red-700">Stockout Risk</p></div>
               </div>
               <ChevronRight className="text-red-400" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div onClick={() => onNavigate('maintenance-cost')} className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 sap-shadow flex items-center gap-6 hover:border-blue-400 transition-colors">
           <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Briefcase size={32} /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Cost Per operational Farm</p>
              <p className="text-3xl font-black text-gray-900">${costMetrics.costPerFarm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-red-500 font-bold mt-1">+4% vs Q1 Benchmark</p>
           </div>
        </div>
        <div onClick={() => onNavigate('maintenance-cost')} className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 sap-shadow flex items-center gap-6 hover:border-emerald-400 transition-colors">
           <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Briefcase size={32} /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Cost Per Equipment Unit</p>
              <p className="text-3xl font-black text-gray-900">${costMetrics.costPerEquipment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">-8% efficiency gain</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardView;

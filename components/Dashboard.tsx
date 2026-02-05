
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { MOCK_ASSETS, MOCK_WORK_ORDERS } from '../constants';
import { AssetStatus, WorkOrderPriority } from '../types';
import { AlertCircle, CheckCircle2, Clock, Wrench } from 'lucide-react';

const Dashboard: React.FC = () => {
  const statusData = [
    { name: 'Operational', value: MOCK_ASSETS.filter(a => a.status === AssetStatus.OPERATIONAL).length, color: '#10b981' },
    { name: 'Maintenance', value: MOCK_ASSETS.filter(a => a.status === AssetStatus.MAINTENANCE).length, color: '#f59e0b' },
    { name: 'Down', value: MOCK_ASSETS.filter(a => a.status === AssetStatus.DOWN).length, color: '#ef4444' },
  ];

  const maintenanceHistory = [
    { month: 'Jan', costs: 4500, orders: 12 },
    { month: 'Feb', costs: 5200, orders: 15 },
    { month: 'Mar', costs: 3800, orders: 10 },
    { month: 'Apr', costs: 6800, orders: 22 },
    { month: 'May', costs: 4200, orders: 14 },
  ];

  const kpis = [
    { label: 'Total Assets', value: MOCK_ASSETS.length, icon: <Wrench size={24} />, color: 'bg-blue-500' },
    { label: 'Open Work Orders', value: MOCK_WORK_ORDERS.length, icon: <Clock size={24} />, color: 'bg-amber-500' },
    { label: 'Active Issues', value: MOCK_ASSETS.filter(a => a.healthScore < 50).length, icon: <AlertCircle size={24} />, color: 'bg-red-500' },
    { label: 'Completed (MTD)', value: 124, icon: <CheckCircle2 size={24} />, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow flex items-center gap-4">
            <div className={`${kpi.color} text-white p-3 rounded-lg`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Maintenance Cost & Output Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="costs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Fleet Status Distribution</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{MOCK_ASSETS.length}</p>
                <p className="text-xs text-gray-500 uppercase">Total</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Critical Work Orders</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_WORK_ORDERS.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{wo.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{wo.title}</td>
                  <td className="px-6 py-4 text-gray-600">{wo.assetId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      wo.priority === WorkOrderPriority.CRITICAL ? 'bg-red-100 text-red-600' :
                      wo.priority === WorkOrderPriority.HIGH ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{wo.status}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                      {wo.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    {wo.assignedTo}
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

export default Dashboard;

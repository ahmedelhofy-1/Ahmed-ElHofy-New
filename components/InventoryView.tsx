
import React from 'react';
import { MOCK_INVENTORY } from '../constants';
import { Package, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

const InventoryView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Spare Parts & Warehouse</h2>
          <p className="text-gray-500 text-sm">Manage inventory levels, procurement, and stock valuation.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Value Report</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Receive Stock</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Current Stock Inventory</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Low Stock</span>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Part Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">In Stock</th>
                <th className="px-6 py-4">Min Stock</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_INVENTORY.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLow ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 uppercase">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-[11px] font-bold uppercase">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.minStock} {item.unit}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">${(item.stock * item.price).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a1e36] text-white p-6 rounded-xl sap-shadow">
            <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">Stock Optimization AI</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-1" />
                <p className="text-xs text-blue-100 leading-relaxed">
                  <span className="font-bold text-white">Critical Low Stock:</span> 3 items are currently below minimum safety levels. Automation triggered replenishment for Oil Filters.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw size={20} className="text-blue-400 shrink-0 mt-1" />
                <p className="text-xs text-blue-100 leading-relaxed">
                  <span className="font-bold text-white">Seasonal Forecast:</span> Harvest season starts in 14 days. Suggesting +20% stock for Harvester belts and lubricants.
                </p>
              </div>
              <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-bold transition-all mt-2">
                Run AI Purchase Advisor
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
            <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              Recent Requisitions
            </h4>
            <div className="space-y-3">
              {[
                { label: 'REQ-4402', status: 'Approved', user: 'Mark S.' },
                { label: 'REQ-4403', status: 'Pending', user: 'Ana L.' },
                { label: 'REQ-4399', status: 'Shipped', user: 'John D.' }
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{req.label}</p>
                    <p className="text-[10px] text-gray-500">{req.user}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;

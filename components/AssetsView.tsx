
import React, { useState } from 'react';
import { MOCK_ASSETS } from '../constants';
import { AssetStatus } from '../types';
import { Filter, Plus, MoreVertical, Download, Search } from 'lucide-react';

const AssetsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = MOCK_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technical Assets</h2>
          <p className="text-gray-500 text-sm">Monitor and manage your fleet of agricultural machinery and facilities.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter by Name, ID, or Location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Asset Info</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Maintenance Health</th>
                <th className="px-6 py-4">Next Maint.</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Plus size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">{asset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[11px] font-medium uppercase text-gray-600">
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${
                      asset.status === AssetStatus.OPERATIONAL ? 'text-emerald-600' :
                      asset.status === AssetStatus.MAINTENANCE ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        asset.status === AssetStatus.OPERATIONAL ? 'bg-emerald-500' :
                        asset.status === AssetStatus.MAINTENANCE ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {asset.location}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span>Health</span>
                        <span className={asset.healthScore > 70 ? 'text-emerald-600' : asset.healthScore > 40 ? 'text-amber-600' : 'text-red-600'}>
                          {asset.healthScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            asset.healthScore > 70 ? 'bg-emerald-500' : 
                            asset.healthScore > 40 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {asset.nextMaintenance}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filteredAssets.length} of {MOCK_ASSETS.length} assets</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsView;

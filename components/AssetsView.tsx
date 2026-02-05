
import React, { useState } from 'react';
import { MOCK_ASSETS } from '../constants';
import { AssetStatus } from '../types';
import { Filter, Plus, MoreVertical, Download, Search, LayoutGrid } from 'lucide-react';
import AssetRegistrationForm from './AssetRegistrationForm';
import BulkUploadView from './BulkUploadView';

const AssetsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewState, setViewState] = useState<'list' | 'register' | 'bulk'>('list');

  const filteredAssets = MOCK_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAsset = (data: any) => {
    console.log('Saving Single Asset:', data);
    alert('Asset successfully synchronized with ERP master data.');
    setViewState('list');
  };

  const handleBulkUpload = (data: any[]) => {
    console.log('Synchronizing Bulk Data:', data);
    alert(`Successfully synchronized ${data.length} records to the ERP system.`);
    setViewState('list');
  };

  if (viewState === 'register') {
    return (
      <AssetRegistrationForm 
        onSave={handleSaveAsset} 
        onCancel={() => setViewState('list')} 
      />
    );
  }

  if (viewState === 'bulk') {
    return (
      <BulkUploadView 
        onCancel={() => setViewState('list')}
        onUpload={handleBulkUpload}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technical Assets</h2>
          <p className="text-gray-500 text-sm">Monitor and manage your fleet of agricultural machinery and facilities.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} />
            Export Master Data
          </button>
          <button 
            onClick={() => setViewState('bulk')}
            className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all active:scale-95"
          >
            <LayoutGrid size={18} />
            Bulk Upload
          </button>
          <button 
            onClick={() => setViewState('register')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium">
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Asset Details (وصف البند)</th>
                <th className="px-6 py-4">Status (موقف الخدمة)</th>
                <th className="px-6 py-4">Location (الموقع)</th>
                <th className="px-6 py-4">Local ID (الرقم المحلى)</th>
                <th className="px-6 py-4 text-center">Health Rating</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <Plus size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{asset.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono uppercase mt-0.5">{asset.type} • {asset.manufacturer || 'OEM'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      asset.status === AssetStatus.OPERATIONAL ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      asset.status === AssetStatus.MAINTENANCE ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
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
                    <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      {asset.localId || asset.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-black ${
                        asset.healthScore > 80 ? 'text-emerald-600' : asset.healthScore > 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {asset.healthScore}%
                      </span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            asset.healthScore > 80 ? 'bg-emerald-500' : 
                            asset.healthScore > 50 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                    </div>
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
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Records Found: {filteredAssets.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsView;

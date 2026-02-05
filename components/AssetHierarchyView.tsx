
import React, { useState, useMemo } from 'react';
import { MOCK_ASSETS } from '../constants';
import { AssetStatus, Asset } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend 
} from 'recharts';
import { 
  Search, Download, Filter, 
  ChevronRight, ChevronDown, Monitor, Settings, 
  Boxes, Truck, Zap, Activity, AlertCircle, Building2
} from 'lucide-react';

const AssetHierarchyView: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'A-SYS-01': true, 'A-102': true, 'A-104': true, 'A-105': true });
  const [filters, setFilters] = useState({
    sector: 'All',
    manufacturer: 'All',
    searchTerm: ''
  });

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(a => {
      const matchSector = filters.sector === 'All' || a.sector === filters.sector;
      const matchManufacturer = filters.manufacturer === 'All' || a.manufacturer === filters.manufacturer;
      const matchSearch = a.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          a.functionalLocation.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchSector && matchManufacturer && matchSearch;
    });
  }, [filters]);

  // KPI Calculations
  const stats = useMemo(() => {
    return {
      total: MOCK_ASSETS.length,
      operating: MOCK_ASSETS.filter(a => a.status === AssetStatus.OPERATIONAL).length,
      maintenance: MOCK_ASSETS.filter(a => a.status === AssetStatus.MAINTENANCE).length,
      obsolete: MOCK_ASSETS.filter(a => a.status === AssetStatus.OBSOLETE).length,
      standby: MOCK_ASSETS.filter(a => a.status === AssetStatus.STANDBY).length,
      outOfService: MOCK_ASSETS.filter(a => a.status === AssetStatus.OUT_OF_SERVICE).length,
      rental: MOCK_ASSETS.filter(a => a.status === AssetStatus.RENTAL).length,
    };
  }, []);

  // Chart: Status by Sector
  const chartData = useMemo(() => {
    const sectors = Array.from(new Set(MOCK_ASSETS.map(a => a.sector)));
    return sectors.map(sector => {
      const assets = MOCK_ASSETS.filter(a => a.sector === sector);
      return {
        name: sector,
        Operational: assets.filter(a => a.status === AssetStatus.OPERATIONAL).length,
        Maintenance: assets.filter(a => a.status === AssetStatus.MAINTENANCE).length,
        Standby: assets.filter(a => a.status === AssetStatus.STANDBY).length,
        Down: assets.filter(a => a.status === AssetStatus.DOWN).length,
      };
    });
  }, []);

  // Recursive Tree Component
  const AssetTreeNode: React.FC<{ asset: Asset; level: number }> = ({ asset, level }) => {
    const children = MOCK_ASSETS.filter(a => a.parentAssetId === asset.id);
    const isExpanded = expanded[asset.id];
    const hasChildren = children.length > 0;

    return (
      <div className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer ${level === 0 ? 'bg-gray-50/50' : ''} hover:bg-blue-50 group`}
          onClick={() => hasChildren && toggleExpand(asset.id)}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          <div className="w-5 h-5 flex items-center justify-center text-gray-400">
            {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div className="w-1 h-1 bg-gray-300 rounded-full" />}
          </div>
          
          <div className={`p-1.5 rounded bg-white border border-gray-200 shadow-sm ${
            asset.status === AssetStatus.OPERATIONAL ? 'text-emerald-500' : 
            asset.status === AssetStatus.MAINTENANCE ? 'text-amber-500' : 'text-red-500'
          }`}>
             {asset.type === 'Infrastructure' ? <Building2 size={14} /> :
              asset.type === 'Tractor' ? <Truck size={14} /> :
              asset.type === 'Irrigation' ? <Activity size={14} /> :
              <Boxes size={14} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold truncate ${asset.status === AssetStatus.DOWN ? 'text-red-600' : 'text-gray-900'}`}>{asset.name}</span>
              <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{asset.functionalLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
            <span className={`text-[10px] font-bold uppercase ${
              asset.status === AssetStatus.OPERATIONAL ? 'text-emerald-600' :
              asset.status === AssetStatus.MAINTENANCE ? 'text-amber-600' :
              'text-red-600'
            }`}>{asset.status}</span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: asset.healthScore > 80 ? '#10b981' : asset.healthScore > 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {children.map(child => <AssetTreeNode key={child.id} asset={child} level={level + 1} />)}
          </div>
        )}
      </div>
    );
  };

  const rootAssets = MOCK_ASSETS.filter(a => !a.parentAssetId);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Asset ID,Equipment,Functional Location,Sector,Manufacturer,Status,Health"].join(",") + "\n"
      + filteredAssets.map(a => {
        return [a.id, a.name, a.functionalLocation, a.sector, a.manufacturer || 'N/A', a.status, a.healthScore].join(",");
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asset_tree_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="text-blue-500" />
            Asset Tree & Functional Location
          </h2>
          <p className="text-gray-500 text-sm">Visualize asset hierarchy and technical locations across the farm.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Asset List
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'border-blue-500' },
          { label: 'Operating', value: stats.operating, color: 'border-emerald-500' },
          { label: 'Maintenance', value: stats.maintenance, color: 'border-amber-500' },
          { label: 'Standby', value: stats.standby, color: 'border-blue-300' },
          { label: 'Out of Service', value: stats.outOfService, color: 'border-red-400' },
          { label: 'Obsolete', value: stats.obsolete, color: 'border-gray-400' },
          { label: 'Rental', value: stats.rental, color: 'border-purple-400' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-3 rounded-lg border-t-4 ${kpi.color} border-l border-r border-b border-gray-200 sap-shadow text-center`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 truncate">{kpi.label}</p>
            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 sap-shadow grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.sector}
            onChange={(e) => setFilters({...filters, sector: e.target.value})}
          >
            <option>All</option>
            <option>Sector 4</option>
            <option>North Field</option>
            <option>East Area</option>
            <option>Processing Hub</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Manufacturer</label>
          <select 
            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none"
            value={filters.manufacturer}
            onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
          >
            <option>All</option>
            <option>Valmont</option>
            <option>John Deere</option>
            <option>Case IH</option>
            <option>AgriTech</option>
            <option>Grundfos</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Quick Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Name, ID, or Functional Location..." 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tree Sidebar */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-gray-200 sap-shadow overflow-y-auto max-h-[600px]">
          <h3 className="text-xs font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Settings size={16} className="text-blue-500" />
            Hierarchy Slicer: Asset Tree
          </h3>
          <div className="space-y-1">
            {rootAssets.map(asset => <AssetTreeNode key={asset.id} asset={asset} level={0} />)}
          </div>
        </div>

        {/* Charts and Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 sap-shadow">
            <h3 className="text-xs font-bold text-gray-800 mb-6 uppercase tracking-wider">Asset Status by Sector</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Operational" stackId="a" fill="#10b981" />
                  <Bar dataKey="Maintenance" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Standby" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Down" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Asset Detail Matrix</h3>
               <button className="text-[10px] text-blue-600 font-bold hover:underline">View Advanced Specs</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Asset ID</th>
                      <th className="px-4 py-3">Equipment</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-gray-100">
                    {filteredAssets.slice(0, 6).map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-blue-600 font-bold">{a.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                        <td className="px-4 py-3 text-gray-500">{a.location}</td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-1.5">
                             <div className={`w-1.5 h-1.5 rounded-full ${
                               a.status === AssetStatus.OPERATIONAL ? 'bg-emerald-500' :
                               a.status === AssetStatus.MAINTENANCE ? 'bg-amber-500' : 'bg-red-500'
                             }`} />
                             {a.status}
                           </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAssets.length > 6 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-center text-gray-400 bg-gray-50 font-medium">
                          + {filteredAssets.length - 6} more assets in selection
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetHierarchyView;

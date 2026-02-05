
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import { Sprout } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-64 bg-[#0a1e36] text-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-blue-900/50">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Sprout size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AgriMant</h1>
          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">ERP Solutions</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-blue-100 hover:bg-blue-900/40 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-blue-900/50">
        <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-xl border border-blue-800/50">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Maintenance Chief</p>
            <p className="text-xs text-blue-400">SAP User: 9841</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

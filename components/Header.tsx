
import React from 'react';
import { Bell, Search, User, Globe } from 'lucide-react';

interface HeaderProps {
  activeTabLabel: string;
}

const Header: React.FC<HeaderProps> = ({ activeTabLabel }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 sap-shadow">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <span>AgriMant ERP</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-900">{activeTabLabel}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions, assets..."
            className="pl-10 pr-4 py-1.5 bg-gray-100 border-none rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <Globe size={20} />
          </button>
          <button className="text-gray-500 hover:text-blue-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

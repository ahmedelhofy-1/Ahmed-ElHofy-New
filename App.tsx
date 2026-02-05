
import React, { useState } from 'react';
import { NAVIGATION_ITEMS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AssetsView from './components/AssetsView';
import WorkOrdersView from './components/WorkOrdersView';
import BreakdownAnalysisView from './components/BreakdownAnalysisView';
import PMPerformanceView from './components/PMPerformanceView';
import InventoryView from './components/InventoryView';
import AIAssistant from './components/AIAssistant';
import AssetHierarchyView from './components/AssetHierarchyView';
import EquipmentHealthView from './components/EquipmentHealthView';
import SparePartsConsumptionView from './components/SparePartsConsumptionView';
import MaintenanceCostView from './components/MaintenanceCostView';
import LaborPerformanceView from './components/LaborPerformanceView';
import BudgetActualView from './components/BudgetActualView';
import ExecutiveDashboardView from './components/ExecutiveDashboardView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'executive-summary':
        return <ExecutiveDashboardView />;
      case 'assets':
        return <AssetsView />;
      case 'asset-hierarchy':
        return <AssetHierarchyView />;
      case 'health-assessment':
        return <EquipmentHealthView />;
      case 'spare-parts':
        return <SparePartsConsumptionView />;
      case 'maintenance-cost':
        return <MaintenanceCostView />;
      case 'budget-actual':
        return <BudgetActualView />;
      case 'labor-performance':
        return <LaborPerformanceView />;
      case 'workorders':
        return <WorkOrdersView />;
      case 'breakdown-analysis':
        return <BreakdownAnalysisView />;
      case 'pm-performance':
        return <PMPerformanceView />;
      case 'inventory':
        return <InventoryView />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Module Coming Soon</h2>
              <p>The {activeTab} module is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTabLabel={NAVIGATION_ITEMS.find(i => i.id === activeTab)?.label || 'App'} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

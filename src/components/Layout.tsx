import React, { useState } from 'react';
import { Home, DollarSign, Target, TrendingUp, Settings, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import ExpensesPage from './ExpensesPage';
import GoalsPage from './GoalsPage';
import InvestmentsPage from './InvestmentsPage';
import AITabPage from './AITabPage';
import MorePage from './MorePage';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'inicio', label: 'Início', icon: Home, component: Dashboard },
    { id: 'gastos', label: 'Gastos', icon: DollarSign, component: ExpensesPage },
    { id: 'metas', label: 'Metas', icon: Target, component: GoalsPage },
    { id: 'investimentos', label: 'Investimentos', icon: TrendingUp, component: InvestmentsPage },
    { id: 'ia', label: 'IA', icon: Bot, component: AITabPage },
    { id: 'mais', label: 'Mais', icon: Settings, component: MorePage },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="min-h-screen pb-20">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav px-2 py-2">
        <div className="flex justify-around max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="h-4 w-4 mb-0.5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
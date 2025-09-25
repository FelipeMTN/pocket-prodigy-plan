import React, { useState } from 'react';
import { Home, DollarSign, Target, TrendingUp, Settings, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EditableDashboard from './EditableDashboard';
import Expenses from './Expenses';
import Goals from './Goals';
import Investments from './Investments';
import AITab from './AITab';
import More from './More';

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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'inicio', label: 'Início', icon: Home, component: EditableDashboard },
    { id: 'gastos', label: 'Gastos', icon: DollarSign, component: Expenses },
    { id: 'metas', label: 'Metas', icon: Target, component: Goals },
    { id: 'investimentos', label: 'Investimentos', icon: TrendingUp, component: Investments },
    { id: 'ia', label: 'IA', icon: Bot, component: AITab },
    { id: 'mais', label: 'Mais', icon: Settings, component: More },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || EditableDashboard;

  return (
    <div className="min-h-screen gradient-warm-main">
      {/* Main Content */}
      <main className="min-h-screen pb-20">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/80 px-2 py-2">
        <div className="flex justify-around max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-1.5 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
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
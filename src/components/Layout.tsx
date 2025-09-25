import { useState } from "react";
import { Home, CreditCard, TrendingUp, Target, Settings } from "lucide-react";
import Dashboard from "./Dashboard";
import Expenses from "./Expenses";
import Investments from "./Investments";
import Goals from "./Goals";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "INÍCIO", icon: Home, component: Dashboard },
    { id: "spend", label: "GASTOS", icon: CreditCard, component: Expenses },
    { id: "invest", label: "INVESTIR", icon: TrendingUp, component: Investments },
    { id: "goals", label: "METAS", icon: Target, component: Goals },
    { id: "settings", label: "MAIS", icon: Settings, component: Dashboard },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden touch-manipulation">
      {/* Main Content */}
      <main className="min-h-screen">
        <ActiveComponent />
      </main>
      {/* Spacer to prevent overlap with bottom nav */}
      <div aria-hidden className="md:h-24 h-20" style={{ height: "calc(5rem + env(safe-area-inset-bottom))" }} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav px-4 py-3 z-30 safe-area-inset-bottom">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
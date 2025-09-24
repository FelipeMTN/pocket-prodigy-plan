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
    <div className="min-h-screen w-full bg-background overflow-hidden">
      {/* Main Content */}
      <main className="pb-20 min-h-screen">
        <ActiveComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-nav px-4 py-2 z-50">
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
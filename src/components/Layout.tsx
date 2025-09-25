import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  DollarSign,
  Target,
  TrendingUp,
  Bot,
  Settings,
} from "lucide-react";

// Import your new page components below.  These should be implemented
// separately to keep each tab focused and easy to maintain.
import Dashboard from "./Dashboard";
import ExpensesPage from "./ExpensesPage";
import GoalsPage from "./GoalsPage";
import InvestmentsPage from "./InvestmentsPage";
import AITabPage from "./AITabPage";
import MorePage from "./MorePage";

interface TabDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const TABS: TabDefinition[] = [
  { id: "inicio", label: "Início", icon: Home, component: Dashboard },
  { id: "gastos", label: "Gastos", icon: DollarSign, component: ExpensesPage },
  { id: "metas", label: "Metas", icon: Target, component: GoalsPage },
  {
    id: "investimentos",
    label: "Investimentos",
    icon: TrendingUp,
    component: InvestmentsPage,
  },
  { id: "ia", label: "IA", icon: Bot, component: AITabPage },
  { id: "mais", label: "Mais", icon: Settings, component: MorePage },
];

const Layout: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("inicio");

  // Redirect unauthenticated users to /auth
  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  // Show a spinner while we check authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-muted"></div>
      </div>
    );
  }

  // Find the active tab component; default to Dashboard if none match
  const ActiveComponent =
    TABS.find((tab) => tab.id === activeTab)?.component ?? Dashboard;

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen pb-20">
        <ActiveComponent />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 glass-nav px-2 py-2">
        <div className="flex justify-around max-w-lg mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-secondary/40 text-primary"
                  : "text-muted-foreground hover:bg-secondary/20"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;

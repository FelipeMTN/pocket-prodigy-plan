import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Eye, BarChart3, PieChart, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useExpenses, useGoals, useInvestments } from "@/hooks/useSupabaseData";
import AIAssistant from "./AIAssistant";

interface NetWorthData {
  total: number;
  assets: number;
  liabilities: number;
  change: number;
  changePercent: number;
}

const EnhancedDashboard = () => {
  const [showAI, setShowAI] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'assets' | 'liabilities'>('overview');
  const { expenses } = useExpenses();
  const { goals } = useGoals();
  const { investments } = useInvestments();

  // Calculate real financial data from database
  const [netWorthData, setNetWorthData] = useState<NetWorthData>({
    total: 0,
    assets: 0,
    liabilities: 0,
    change: 0,
    changePercent: 0
  });

  const [assetsBreakdown, setAssetsBreakdown] = useState([
    { name: "Investimentos", amount: 0, percentage: 0, color: "from-blue-400 to-blue-600" },
    { name: "Dinheiro", amount: 15000, percentage: 30, color: "from-green-400 to-green-600" },
    { name: "Imóveis", amount: 350000, percentage: 70, color: "from-purple-400 to-purple-600" }
  ]);

  const [liabilitiesBreakdown] = useState([
    { name: "Cartões de Crédito", amount: 8500, percentage: 15, color: "from-red-400 to-red-600" },
    { name: "Financiamentos", amount: 180000, percentage: 85, color: "from-orange-400 to-orange-600" }
  ]);

  // Calculate investment portfolio value
  useEffect(() => {
    const portfolioValue = investments.reduce((total, inv) => {
      return total + (inv.shares * inv.price);
    }, 0);

    const totalAssets = portfolioValue + 15000 + 350000; // investments + cash + real estate
    const totalLiabilities = 8500 + 180000; // credit cards + financing

    setAssetsBreakdown(prev => [
      { ...prev[0], amount: portfolioValue, percentage: Math.round((portfolioValue / totalAssets) * 100) },
      { ...prev[1], percentage: Math.round((15000 / totalAssets) * 100) },
      { ...prev[2], percentage: Math.round((350000 / totalAssets) * 100) }
    ]);

    setNetWorthData({
      total: totalAssets - totalLiabilities,
      assets: totalAssets,
      liabilities: totalLiabilities,
      change: 12500, // This would be calculated from historical data
      changePercent: 3.85
    });
  }, [investments]);

  const handleConnectAccounts = () => {
    // In a real app, this would integrate with financial institutions
    alert("Funcionalidade de conexão bancária será implementada em breve!");
  };

  const ViewToggle = () => (
    <div className="flex bg-white/10 rounded-lg p-1">
      {(['overview', 'assets', 'liabilities'] as const).map((view) => (
        <button
          key={view}
          onClick={() => setSelectedView(view)}
          className={`px-3 py-2 text-xs font-medium rounded transition-all ${
            selectedView === view 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {view === 'overview' ? 'Geral' : view === 'assets' ? 'Ativos' : 'Passivos'}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Assets Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <h4 className="text-white font-medium">Ativos</h4>
          <span className="text-white text-2xl font-semibold">
            ${netWorthData.assets.toLocaleString()}
          </span>
        </div>
        
        {assetsBreakdown.map((asset, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">
                {asset.name} ({asset.percentage}%)
              </span>
              <span className="text-white/80 text-sm">
                ${asset.amount.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={asset.percentage} 
              className="h-2 bg-white/10"
            />
          </div>
        ))}
      </div>

      {/* Liabilities Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <h4 className="text-white font-medium">Passivos</h4>
          <span className="text-white text-2xl font-semibold">
            ${netWorthData.liabilities.toLocaleString()}
          </span>
        </div>
        
        {liabilitiesBreakdown.map((liability, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">
                {liability.name} ({liability.percentage}%)
              </span>
              <span className="text-white/80 text-sm">
                ${liability.amount.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={liability.percentage} 
              className="h-2 bg-white/10"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      <h4 className="text-white font-semibold text-lg">Detalhamento de Ativos</h4>
      {assetsBreakdown.map((asset, index) => (
        <Card key={index} className="bg-white/5 border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-white font-medium">{asset.name}</h5>
            <span className="text-success text-sm">+2.5%</span>
          </div>
          <div className="text-white text-xl font-semibold mb-2">
            ${asset.amount.toLocaleString()}
          </div>
          <Progress value={asset.percentage} className="h-2 bg-white/10" />
          <p className="text-white/60 text-sm mt-2">{asset.percentage}% do total de ativos</p>
        </Card>
      ))}
    </div>
  );

  const renderLiabilities = () => (
    <div className="space-y-4">
      <h4 className="text-white font-semibold text-lg">Detalhamento de Passivos</h4>
      {liabilitiesBreakdown.map((liability, index) => (
        <Card key={index} className="bg-white/5 border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-white font-medium">{liability.name}</h5>
            <span className="text-destructive text-sm">-1.2%</span>
          </div>
          <div className="text-white text-xl font-semibold mb-2">
            ${liability.amount.toLocaleString()}
          </div>
          <Progress value={liability.percentage} className="h-2 bg-white/10" />
          <p className="text-white/60 text-sm mt-2">{liability.percentage}% do total de passivos</p>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen gradient-blue relative overflow-hidden">
      {/* AI Assistant FAB */}
      <Button
        onClick={() => setShowAI(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark shadow-glow z-40"
        size="icon"
      >
        <Bot size={24} className="text-primary-foreground" />
      </Button>

      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="heading-display text-white italic">
              Seu Patrimônio
            </h1>
            <p className="text-white/80 text-lg mt-2 max-w-xs leading-relaxed">
              Acompanhe seus ativos e passivos em tempo real
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <BarChart3 size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <PieChart size={20} />
            </Button>
          </div>
        </div>

        {/* Connect Accounts Button */}
        <Button 
          onClick={handleConnectAccounts}
          className="button-glass w-full py-4 mb-8 text-white font-semibold"
        >
          <Plus className="mr-2" size={20} />
          Conectar suas contas
        </Button>
      </div>

      {/* Main Content Card */}
      <div className="px-6 space-y-6 relative z-10">
        {/* Assets and Liabilities Overview */}
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">PATRIMÔNIO</h3>
              <ViewToggle />
            </div>

            {selectedView === 'overview' && renderOverview()}
            {selectedView === 'assets' && renderAssets()}
            {selectedView === 'liabilities' && renderLiabilities()}
          </div>
        </div>

        {/* Net Worth Summary */}
        <div className="glass-card animate-slide-up">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/60 text-sm font-medium">PATRIMÔNIO LÍQUIDO</h3>
                <div className="text-white text-3xl font-semibold mt-1">
                  ${netWorthData.total.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-success text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  +${netWorthData.change.toLocaleString()} ({netWorthData.changePercent}%)
                </div>
                <div className="text-white/60 text-xs mt-1">Últimos 6 meses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 animate-scale-in">
          <Card className="glass-card p-4">
            <div className="text-white/60 text-xs font-medium mb-2">METAS ATIVAS</div>
            <div className="text-white text-2xl font-semibold">{goals.length}</div>
            <div className="text-success text-xs mt-1">+2 este mês</div>
          </Card>
          
          <Card className="glass-card p-4">
            <div className="text-white/60 text-xs font-medium mb-2">INVESTIMENTOS</div>
            <div className="text-white text-2xl font-semibold">{investments.length}</div>
            <div className="text-success text-xs mt-1">
              ${investments.reduce((sum, inv) => sum + (inv.shares * inv.price), 0).toLocaleString()}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />

      {/* Bottom CTA */}
      <div className="px-6 pt-8 pb-4">
        <p className="text-white/80 text-center text-sm leading-relaxed">
          💡 Use o assistente AI para adicionar gastos, metas e investimentos rapidamente
        </p>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

const Dashboard = () => {
  const [netWorth] = useState({
    total: 540000,
    assets: 540000,
    liabilities: 214528,
    change: 26660,
    changePercent: 32.17
  });

  const [assets] = useState([
    { name: "Imóveis", amount: 459000, percentage: 85, color: "from-blue-400 to-blue-600" },
    { name: "Dinheiro", amount: 27000, percentage: 5, color: "from-green-400 to-green-600" },
    { name: "Investimentos", amount: 54000, percentage: 10, color: "from-purple-400 to-purple-600" }
  ]);

  const [liabilities] = useState([
    { name: "Cartões de Crédito", amount: 12853, percentage: 6, color: "from-red-400 to-red-600" },
    { name: "Financiamento", amount: 201675, percentage: 94, color: "from-orange-400 to-orange-600" }
  ]);

  return (
    <div className="min-h-screen gradient-blue relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-display text-white italic">
              Acompanhe seu patrimônio
            </h1>
            <p className="text-white/80 text-lg mt-2 max-w-xs leading-relaxed">
              Una sua vida financeira para ver como seus ativos e passivos mudam ao longo do tempo.
            </p>
          </div>
        </div>

        {/* Connect Accounts Button */}
        <button className="button-glass w-full py-4 mb-8 text-white font-semibold">
          Conectar suas contas
        </button>
      </div>

      {/* Main Content Card */}
      <div className="px-6 space-y-6 relative z-10">
        {/* Assets and Liabilities Overview */}
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">ATIVOS E PASSIVOS</h3>
              <Plus className="text-white/60" size={20} />
            </div>

            {/* Assets Section */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-4">
                <h4 className="text-white font-medium">Ativos</h4>
                <span className="text-white text-2xl font-semibold">
                  ${netWorth.assets.toLocaleString()}
                </span>
              </div>
              
              {assets.map((asset, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80 text-sm">{asset.name} ({asset.percentage}%)</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className={`progress-fill bg-gradient-to-r ${asset.color}`}
                      style={{ width: `${asset.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Liabilities Section */}
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h4 className="text-white font-medium">Passivos</h4>
                <span className="text-white text-2xl font-semibold">
                  ${netWorth.liabilities.toLocaleString()}
                </span>
              </div>
              
              {liabilities.map((liability, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80 text-sm">{liability.name} ({liability.percentage}%)</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className={`progress-fill bg-gradient-to-r ${liability.color}`}
                      style={{ width: `${liability.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Net Worth Summary */}
        <div className="glass-card animate-slide-up">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/60 text-sm font-medium">PATRIMÔNIO LÍQUIDO</h3>
                <div className="text-white text-3xl font-semibold mt-1">
                  ${(netWorth.assets - netWorth.liabilities).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  +${netWorth.change.toLocaleString()} ({netWorth.changePercent}%)
                </div>
                <div className="text-white/60 text-xs mt-1">Últimos 6 meses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pt-8 pb-4">
        <p className="text-white/80 text-center text-sm leading-relaxed">
          Conecte com segurança todas suas contas correntes e poupanças para acompanhar suas finanças em um só lugar.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
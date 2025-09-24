import { useState } from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

const Investments = () => {
  const [portfolio] = useState({
    allocations: [
      { name: "U.S. stocks", current: 40.2, target: 56, color: "from-blue-400 to-blue-600" },
      { name: "Intl. stocks", current: 14.2, target: 24, color: "from-green-400 to-green-600" },
      { name: "Crypto", current: 25, target: 31, color: "from-purple-400 to-purple-600" },
      { name: "Cash", current: 37.6, target: 18.3, color: "from-orange-400 to-orange-600" }
    ]
  });

  const [marketData] = useState([
    { name: "DJIA", ticker: "DJI", value: "$42.34k", change: "1.78%", isUp: true },
    { name: "NASDAQ", ticker: "DJI", value: "$19.20k", change: "2.47%", isUp: true },
    { name: "S&P 500", ticker: "SPX", value: "$5.92k", change: "2.47%", isUp: true },
    { name: "VIX", ticker: "VIX", value: "$18.96", change: "7.83%", isUp: false }
  ]);

  const [cdiRates] = useState([
    { bank: "Neon", rate: 150, highlight: true },
    { bank: "PagBank", rate: 130, highlight: true },
    { bank: "Banco BMG", rate: 117, highlight: false },
    { bank: "Nubank", rate: 100, highlight: false },
    { bank: "Iti", rate: 100, highlight: false }
  ]);

  return (
    <div className="min-h-screen gradient-green relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <div className="mb-8">
          <h1 className="heading-display text-white italic mb-4">
            Track your investments
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-sm">
            From crypto to 401(k)s, get the context you need to manage your investments with clarity.
          </p>
        </div>

        {/* Connect Accounts Button */}
        <button className="button-glass w-full py-4 mb-8 text-white font-semibold">
          Connect your accounts
        </button>
      </div>

      {/* Portfolio Allocation Card */}
      <div className="px-6 space-y-6">
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">ASSET & RISK</h3>
              <Plus className="text-white/60" size={20} />
            </div>

            <div className="space-y-4">
              {portfolio.allocations.map((allocation, index) => (
                <div key={index}>
                  <div className="mb-3">
                    <div className="text-white font-medium mb-2">{allocation.name}</div>
                    
                    {/* Current allocation bar */}
                    <div className="mb-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Current ({allocation.current}%)</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div 
                          className={`progress-fill bg-gradient-to-r ${allocation.color}`}
                          style={{ width: `${allocation.current}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Target allocation bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Model ({allocation.target}%)</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div 
                          className="h-full bg-white/20 border-2 border-dashed border-white/40"
                          style={{ width: `${allocation.target}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Markets Overview Card */}
        <div className="glass-card animate-slide-up">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">MARKETS AT A GLANCE</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {marketData.map((market, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="mb-2">
                    {/* Simple chart placeholder */}
                    <div className="h-8 flex items-end space-x-1 mb-2">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-white/60 rounded-sm flex-1 ${
                            market.isUp ? 'bg-green-400' : 'bg-red-400'
                          }`}
                          style={{ 
                            height: `${20 + Math.random() * 12}px`,
                            opacity: market.isUp ? 0.8 : 0.6
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-white font-medium text-lg">{market.name}</div>
                  <div className="text-white/80 text-sm">{market.ticker}</div>
                  
                  <div className="mt-2">
                    <div className="text-white font-semibold">{market.value}</div>
                    <div className={`text-sm flex items-center ${
                      market.isUp ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {market.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="ml-1">{market.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CDI Rates Card */}
        <div className="glass-card animate-scale-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">CDI RATES (% OF CDI)</h3>
            </div>

            <div className="space-y-3">
              {cdiRates.map((rate, index) => (
                <div key={index} className={`p-3 rounded-lg ${rate.highlight ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{rate.bank}</span>
                    <div className="flex items-center">
                      <span className="text-white font-semibold text-lg">{rate.rate}%</span>
                      {rate.highlight && <span className="ml-2 text-green-400 text-xs">BEST</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-white/60 text-xs">
              *Rates updated daily. Conditions may apply.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pt-8 pb-4">
        <p className="text-white/90 text-center text-sm leading-relaxed">
          Securely connect all your brokerage and retirement accounts to track your finances in one place.
        </p>
      </div>
    </div>
  );
};

export default Investments;
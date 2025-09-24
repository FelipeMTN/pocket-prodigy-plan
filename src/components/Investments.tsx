import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import AddStockModal from "./AddStockModal";

const Investments = () => {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [portfolio, setPortfolio] = useState([
    { id: 1, ticker: "PETR4.SA", name: "Petrobras", shares: 100, price: 28.45, sector: "Energy", change: 1.2 },
    { id: 2, ticker: "AAPL", name: "Apple Inc.", shares: 10, price: 189.25, sector: "Technology", change: 1.8 },
    { id: 3, ticker: "VALE3.SA", name: "Vale", shares: 50, price: 65.80, sector: "Materials", change: -0.8 }
  ]);
  const [allocations] = useState({
    allocations: [
      { name: "Ações EUA", current: 40.2, target: 56, color: "from-blue-400 to-blue-600" },
      { name: "Ações Intl.", current: 14.2, target: 24, color: "from-green-400 to-green-600" },
      { name: "Cripto", current: 25, target: 31, color: "from-purple-400 to-purple-600" },
      { name: "Dinheiro", current: 37.6, target: 18.3, color: "from-orange-400 to-orange-600" }
    ]
  });

  const [marketData] = useState([
    { name: "DJIA", ticker: "DJI", value: "$42.34k", change: "1.78%", isUp: true },
    { name: "NASDAQ", ticker: "DJI", value: "$19.20k", change: "2.47%", isUp: true },
    { name: "S&P 500", ticker: "SPX", value: "$5.92k", change: "2.47%", isUp: true },
    { name: "VIX", ticker: "VIX", value: "$18.96", change: "7.83%", isUp: false }
  ]);

  const [cdiRates] = useState([
    { bank: "Neon", rate: 150, highlight: true, conditions: "New accounts only" },
    { bank: "PagBank", rate: 130, highlight: true, conditions: "Min R$ 1,000" },
    { bank: "Banco BMG", rate: 117, highlight: false, conditions: "CDB 180 days" },
    { bank: "C6 Bank", rate: 115, highlight: false, conditions: "Min R$ 5,000" },
    { bank: "Sofisa Direto", rate: 112, highlight: false, conditions: "CDB 12 months" },
    { bank: "Banco Original", rate: 110, highlight: false, conditions: "Min R$ 1,000" },
    { bank: "Banco Inter", rate: 108, highlight: false, conditions: "Active account" },
    { bank: "Banco BS2", rate: 105, highlight: false, conditions: "Min R$ 10,000" },
    { bank: "Banco Pine", rate: 103, highlight: false, conditions: "CDB 24 months" },
    { bank: "Nubank", rate: 100, highlight: false, conditions: "Standard rate" },
    { bank: "Iti", rate: 100, highlight: false, conditions: "Standard rate" },
    { bank: "XP Investimentos", rate: 98, highlight: false, conditions: "Min R$ 5,000" },
    { bank: "Rico", rate: 96, highlight: false, conditions: "CDB 6 months" },
    { bank: "Clear", rate: 95, highlight: false, conditions: "Min R$ 1,000" },
    { bank: "Bradesco", rate: 85, highlight: false, conditions: "Traditional bank" }
  ]);

  const handleAddStock = (stock: any) => {
    setPortfolio(prev => [...prev, stock]);
  };

  const handleRemoveStock = (stockId: number) => {
    setPortfolio(prev => prev.filter(stock => stock.id !== stockId));
  };

  const totalPortfolioValue = portfolio.reduce((sum, stock) => sum + (stock.shares * stock.price), 0);

  return (
    <>
      <AddStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onAdd={handleAddStock}
      />
      
      <div className="min-h-screen gradient-green relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <div className="mb-8">
            <h1 className="heading-display text-white italic mb-4">
              Acompanhe seus investimentos
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">
              De cripto a previdência, tenha o contexto necessário para gerenciar seus investimentos com clareza.
            </p>
        </div>

        {/* Add Stock Button */}
        <button 
          onClick={() => setIsStockModalOpen(true)}
          className="button-glass w-full py-4 mb-8 text-white font-semibold flex items-center justify-center"
        >
          <Plus className="mr-2" size={20} />
          Adicionar ao Portfólio
        </button>
      </div>

      {/* Portfolio Holdings */}
      <div className="px-6 space-y-6">
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">SEU PORTFÓLIO</h3>
              <div className="text-white text-lg font-semibold">
                ${totalPortfolioValue.toFixed(2)}
              </div>
            </div>

            {portfolio.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <TrendingUp className="mx-auto mb-4 opacity-50" size={48} />
                <p>Nenhuma ação em seu portfólio ainda.</p>
                <p className="text-sm">Adicione ações para começar a acompanhar seus investimentos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {portfolio.map((stock, index) => {
                  const totalValue = stock.shares * stock.price;
                  return (
                    <div key={stock.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-white font-semibold">{stock.ticker}</div>
                              <div className="text-white/80 text-sm">{stock.name}</div>
                              <div className="text-white/60 text-xs">{stock.sector}</div>
                            </div>
                            <button
                              onClick={() => handleRemoveStock(stock.id)}
                              className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-white/80 text-sm">{stock.shares} ações</div>
                              <div className="text-white/60 text-xs">@ ${stock.price.toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">${totalValue.toFixed(2)}</div>
                              <div className={`text-sm flex items-center ${
                                stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                <span className="ml-1">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Asset Allocation Card */}
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">ALOCAÇÃO DE ATIVOS</h3>
              <Plus className="text-white/60" size={20} />
            </div>

            <div className="space-y-4">
              {allocations.allocations.map((allocation, index) => (
                <div key={index}>
                  <div className="mb-3">
                    <div className="text-white font-medium mb-2">{allocation.name}</div>
                    
                    {/* Current allocation bar */}
                    <div className="mb-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Atual ({allocation.current}%)</span>
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
                        <span className="text-white/60">Meta ({allocation.target}%)</span>
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
              <h3 className="text-white/60 font-medium tracking-wider text-sm">MERCADOS EM RESUMO</h3>
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
              <h3 className="text-white/60 font-medium tracking-wider text-sm">TAXAS CDI (% DO CDI)</h3>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {cdiRates.map((rate, index) => (
                <div key={index} className={`p-3 rounded-lg transition-all ${rate.highlight ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-medium">{rate.bank}</span>
                        <div className="flex items-center">
                          <span className="text-white font-semibold text-lg">{rate.rate}%</span>
                          {rate.highlight && <span className="ml-2 text-green-400 text-xs font-medium">TOP</span>}
                        </div>
                      </div>
                      <div className="text-white/60 text-xs">{rate.conditions}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-white/60 text-xs">
              *Taxas atualizadas diariamente • CDI atual: 11,75% a.a. • Última atualização: Hoje
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pt-8 pb-4">
        <p className="text-white/90 text-center text-sm leading-relaxed">
          Conecte com segurança todas suas contas de corretora e previdência para acompanhar suas finanças em um só lugar.
        </p>
      </div>
    </div>
    </>
  );
};

export default Investments;
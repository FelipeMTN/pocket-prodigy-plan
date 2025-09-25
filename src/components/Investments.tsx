import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Trash2, BarChart3, PieChart, Search } from "lucide-react";
import AddStockModal from "./AddStockModal";
import StockSearchModal from "./StockSearchModal";
import { useInvestments } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";

const Investments = () => {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'portfolio' | 'analytics'>('portfolio');
  const { investments, loading, addInvestment, deleteInvestment } = useInvestments();
  const { toast } = useToast();
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

  const handleAddStock = async (stockData: any) => {
    try {
      await addInvestment(stockData);
      toast({
        title: "Investimento adicionado",
        description: "O investimento foi adicionado ao seu portfólio!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o investimento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStock = async (stockId: string) => {
    try {
      await deleteInvestment(stockId);
      toast({
        title: "Investimento removido",
        description: "O investimento foi removido do seu portfólio!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o investimento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const totalPortfolioValue = investments.reduce((sum, stock) => sum + (parseInt(stock.shares) * parseFloat(stock.price)), 0);
  
  // Calculate sector allocation
  const sectorAllocation = investments.reduce((acc, stock) => {
    const sector = stock.sector || 'Other';
    const shares = parseInt(stock.shares) || 0;
    const price = parseFloat(stock.price) || 0;
    const value = shares * price;
    acc[sector] = (acc[sector] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  // Generate random price changes for demonstration
  const getRandomChange = () => (Math.random() - 0.5) * 10;

  return (
    <>
      <AddStockModal 
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onAdd={handleAddStock}
      />
      
      <StockSearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddStock={handleAddStock}
      />
      
      <div className="min-h-screen gradient-invest-green relative overflow-hidden">
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

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8">
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="button-glass px-6 py-3 text-white font-semibold flex-1"
          >
            <Search className="mr-2" size={20} />
            Buscar Ações
          </button>
          <button 
            onClick={() => setIsStockModalOpen(true)}
            className="button-glass px-4 py-3 text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setViewMode('portfolio')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'portfolio' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <PieChart size={16} className="mr-2" />
            Portfólio
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'analytics' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 size={16} className="mr-2" />
            Análise
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="px-6 space-y-6">
        {viewMode === 'portfolio' ? (
          <div className="glass-card animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm">SEU PORTFÓLIO</h3>
                <div className="text-white text-lg font-semibold">
                  R$ {totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {investments.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <TrendingUp className="mx-auto mb-4 opacity-50" size={48} />
                  <p>Nenhum investimento em seu portfólio ainda.</p>
                  <p className="text-sm">Adicione investimentos para começar a acompanhar seu portfólio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.map((stock) => {
                    const totalValue = parseInt(stock.shares) * parseFloat(stock.price);
                    const change = getRandomChange();
                    return (
                      <div key={stock.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-white font-semibold">{stock.ticker}</div>
                                <div className="text-white/80 text-sm">{stock.name}</div>
                                <div className="text-white/60 text-xs">{stock.sector}</div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveStock(stock.id);
                                }}
                                className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-white/80 text-sm">{stock.shares} ações</div>
                                <div className="text-white/60 text-xs">@ R$ {parseFloat(stock.price).toFixed(2)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-white font-semibold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                <div className={`text-sm flex items-center ${
                                  change >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                  <span className="ml-1">{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
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
        ) : (
          /* Analytics View */
          <div className="space-y-6">
            {/* Portfolio Performance */}
            <div className="glass-card animate-fade-in">
              <div className="p-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm mb-4">PERFORMANCE DO PORTFÓLIO</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-white/80 text-sm">Valor Total</div>
                    <div className="text-white text-lg font-semibold">
                      R$ {totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-white/80 text-sm">Posições</div>
                    <div className="text-white text-lg font-semibold">{investments.length}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-white/80 text-sm">Maior Posição</div>
                    <div className="text-white text-lg font-semibold">
                      {investments.length > 0 
                        ? `R$ ${Math.max(...investments.map(inv => {
                            const shares = parseInt(inv.shares) || 0;
                            const price = parseFloat(inv.price) || 0;
                            return shares * price;
                          })).toFixed(2)}`
                        : 'R$ 0,00'
                      }
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-white/80 text-sm">Setores</div>
                    <div className="text-white text-lg font-semibold">{Object.keys(sectorAllocation).length}</div>
                  </div>
                </div>

                {/* Sector Breakdown */}
                {Object.keys(sectorAllocation).length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Alocação por Setor</h4>
                    <div className="space-y-3">
                      {Object.entries(sectorAllocation).map(([sector, value]) => {
                        const numValue = Number(value);
                        const percentage = totalPortfolioValue > 0 ? (numValue / totalPortfolioValue) * 100 : 0;
                        return (
                          <div key={sector}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white font-medium">{sector}</span>
                              <div className="text-right">
                                <div className="text-white font-semibold">
                                  R$ {numValue.toFixed(2)}
                                </div>
                                <div className="text-white/80 text-sm">{percentage.toFixed(1)}%</div>
                              </div>
                            </div>
                            <div className="progress-bar h-2">
                              <div 
                                className="progress-fill bg-gradient-to-r from-green-400 to-green-600"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
import { useState } from "react";
import { X, Search, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stock: any) => void;
}

const AddStockModal = ({ isOpen, onClose, onAdd }: AddStockModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [shares, setShares] = useState("");

  // Popular Brazilian and US stocks
  const popularStocks = [
    { ticker: "PETR4.SA", name: "Petrobras", price: 28.45, change: 1.2, sector: "Energia" },
    { ticker: "VALE3.SA", name: "Vale", price: 65.80, change: -0.8, sector: "Materiais" },
    { ticker: "ITUB4.SA", name: "Itaú Unibanco", price: 32.15, change: 0.5, sector: "Bancos" },
    { ticker: "BBDC4.SA", name: "Bradesco", price: 15.67, change: 0.3, sector: "Bancos" },
    { ticker: "MGLU3.SA", name: "Magazine Luiza", price: 8.90, change: 2.1, sector: "Varejo" },
    { ticker: "WEGE3.SA", name: "WEG", price: 42.30, change: -0.4, sector: "Industriais" },
    { ticker: "AAPL", name: "Apple Inc.", price: 189.25, change: 1.8, sector: "Tecnologia" },
    { ticker: "MSFT", name: "Microsoft", price: 378.90, change: 0.9, sector: "Tecnologia" },
    { ticker: "GOOGL", name: "Alphabet", price: 142.80, change: 1.4, sector: "Tecnologia" },
    { ticker: "TSLA", name: "Tesla", price: 248.50, change: 3.2, sector: "Automotivo" },
    { ticker: "NVDA", name: "NVIDIA", price: 875.30, change: 2.7, sector: "Tecnologia" },
    { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 459.20, change: 0.6, sector: "ETF" }
  ];

  const filteredStocks = popularStocks.filter(
    stock =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || !shares) return;

    const stock = {
      id: Date.now(),
      ticker: selectedStock.ticker,
      name: selectedStock.name,
      shares: parseInt(shares),
      price: selectedStock.price,
      sector: selectedStock.sector,
      totalValue: selectedStock.price * parseInt(shares),
      change: selectedStock.change,
      addedAt: new Date().toISOString()
    };

    onAdd(stock);
    onClose();
    setSearchTerm("");
    setSelectedStock(null);
    setShares("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-heading font-semibold text-xl">Adicionar ao Portfólio</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-hidden">
            {/* Search */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Buscar Ações
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-white/60" size={20} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Busque por ticker ou nome da empresa..."
                />
              </div>
            </div>

            {/* Stock Selection */}
            <div className="flex-1 overflow-hidden">
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Ações Populares
              </Label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    type="button"
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedStock?.ticker === stock.ticker
                        ? 'bg-primary/20 border-primary text-white'
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-white">{stock.ticker}</div>
                        <div className="text-sm text-white/80">{stock.name}</div>
                        <div className="text-xs text-white/60">{stock.sector}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div className={`text-sm flex items-center ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp 
                            size={12} 
                            className={`mr-1 ${stock.change < 0 ? 'rotate-180' : ''}`}
                          />
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shares Input */}
            {selectedStock && (
              <div>
                <Label className="text-white/80 text-sm font-medium mb-2 block">
                  Quantidade de Ações
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Quantas ações você possui?"
                  required
                />
                {shares && (
                  <div className="mt-2 text-white/80 text-sm">
                    Valor Total: ${(selectedStock.price * parseInt(shares || '0')).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedStock || !shares}
              className="flex-1 button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar ao Portfólio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
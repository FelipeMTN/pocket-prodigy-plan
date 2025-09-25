import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
}

interface StockSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: any) => void;
}

const StockSearchModal = ({ isOpen, onClose, onAddStock }: StockSearchModalProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinnedStocks, setPinnedStocks] = useState<string[]>([]);

  // Popular Brazilian and US stocks
  const popularStocks: Stock[] = [
    { symbol: "PETR4.SA", name: "Petrobras", price: 32.45, change: 0.89, changePercent: 2.82, market: "BOVESPA" },
    { symbol: "VALE3.SA", name: "Vale", price: 65.20, change: -1.23, changePercent: -1.85, market: "BOVESPA" },
    { symbol: "ITUB4.SA", name: "Itaú Unibanco", price: 28.90, change: 0.45, changePercent: 1.58, market: "BOVESPA" },
    { symbol: "BBDC4.SA", name: "Bradesco", price: 21.35, change: -0.25, changePercent: -1.15, market: "BOVESPA" },
    { symbol: "WEGE3.SA", name: "WEG", price: 45.80, change: 1.20, changePercent: 2.69, market: "BOVESPA" },
    { symbol: "AAPL", name: "Apple Inc.", price: 185.42, change: 2.15, changePercent: 1.17, market: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft", price: 378.91, change: -1.85, changePercent: -0.49, market: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet", price: 142.56, change: 3.22, changePercent: 2.31, market: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla", price: 248.50, change: 8.95, changePercent: 3.74, market: "NASDAQ" },
    { symbol: "NVDA", name: "NVIDIA", price: 875.30, change: 15.20, changePercent: 1.77, market: "NASDAQ" }
  ];

  const searchStocks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call - in real implementation, use Alpha Vantage or similar
    setTimeout(() => {
      const filtered = popularStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchStocks(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const togglePin = (symbol: string) => {
    setPinnedStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleAddStock = (stock: Stock) => {
    const shares = prompt("Quantas ações você possui?");
    if (shares && !isNaN(Number(shares))) {
      onAddStock({
        ticker: stock.symbol,
        name: stock.name,
        shares: Number(shares),
        price: stock.price,
        sector: stock.market === "BOVESPA" ? "Brasileiro" : "Internacional",
        purchase_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Ação adicionada!",
        description: `${shares} ações de ${stock.name} foram adicionadas ao seu portfólio`,
      });
      
      onClose();
    }
  };

  const displayStocks = searchTerm ? searchResults : popularStocks.filter(s => pinnedStocks.includes(s.symbol));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Buscar Ações</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Busque por ticker ou nome da empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">
              {searchTerm ? "Resultados da Busca" : "Ações Favoritas"}
            </h3>
            <span className="text-sm text-muted-foreground">
              {displayStocks.length} {displayStocks.length === 1 ? "ação" : "ações"}
            </span>
          </div>

          {/* Stock List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : displayStocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhuma ação encontrada" : "Nenhuma ação favoritada"}
              </div>
            ) : (
              displayStocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-card-foreground">{stock.symbol}</h4>
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {stock.market}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-semibold text-card-foreground">
                        ${stock.price.toFixed(2)}
                      </span>
                      <div className={`flex items-center space-x-1 text-xs ${
                        stock.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(stock.symbol)}
                      className={pinnedStocks.includes(stock.symbol) ? 'text-warning' : 'text-muted-foreground'}
                    >
                      <Star size={16} fill={pinnedStocks.includes(stock.symbol) ? 'currentColor' : 'none'} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddStock(stock)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!searchTerm && pinnedStocks.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Favorite ações para acesso rápido</p>
              <p className="text-xs mt-1">Use o ícone de estrela ao lado de cada ação</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockSearchModal;
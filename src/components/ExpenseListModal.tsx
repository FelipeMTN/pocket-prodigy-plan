import { useState } from "react";
import { X, Filter, Search, Trash2, Edit3, Calendar, DollarSign } from "lucide-react";

interface ExpenseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseListModal = ({ isOpen, onClose, expenses, onDeleteExpense }: ExpenseListModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  if (!isOpen) return null;

  const categories = ["all", "food", "transport", "shopping", "utilities", "entertainment", "other"];
  
  const filteredExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || expense.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "amount") return parseFloat(b.amount) - parseFloat(a.amount);
      return a.description.localeCompare(b.description);
    });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading text-white">Todos os Gastos</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
              <input
                type="text"
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
              />
            </div>
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="all">Todas as Categorias</option>
              <option value="food">Alimentação</option>
              <option value="transport">Transporte</option>
              <option value="shopping">Compras</option>
              <option value="utilities">Contas</option>
              <option value="entertainment">Entretenimento</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="date">Data</option>
              <option value="amount">Valor</option>
              <option value="description">Nome</option>
            </select>
          </div>

          {/* Summary */}
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-white/80">{filteredExpenses.length} gastos encontrados</span>
            <span className="text-white font-semibold">Total: R$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Expense List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{expense.description}</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          title="Editar gasto"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Excluir gasto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-white/80">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </div>
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs capitalize">
                        {expense.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-white font-semibold text-lg">
                      R$ {parseFloat(expense.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center text-white/60 py-12">
              <DollarSign className="mx-auto mb-4 opacity-50" size={48} />
              <p>Nenhum gasto encontrado.</p>
              <p className="text-sm">Tente ajustar os filtros de busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseListModal;
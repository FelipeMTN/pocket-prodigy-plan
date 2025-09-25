import { useState } from "react";
import { X, PieChart, BarChart3, TrendingDown, TrendingUp } from "lucide-react";

interface BudgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
}

const BudgetDetailModal = ({ isOpen, onClose, expenses }: BudgetDetailModalProps) => {
  const [viewMode, setViewMode] = useState<'overview' | 'categories' | 'trends'>('overview');

  if (!isOpen) return null;

  // Calculate budget data from expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const categoryData = monthlyExpenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = { spent: 0, budget: 0, count: 0 };
    }
    acc[category].spent += parseFloat(expense.amount);
    acc[category].count += 1;
    return acc;
  }, {});

  // Set budget limits for categories
  const budgetLimits = {
    food: 2500,
    transport: 1200,
    shopping: 1000,
    utilities: 800,
    entertainment: 500,
    other: 1000
  };

  Object.keys(categoryData).forEach(category => {
    categoryData[category].budget = budgetLimits[category] || 1000;
  });

  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalBudget = Object.values(budgetLimits).reduce((sum, budget) => sum + budget, 0);
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    const icons = {
      food: "🍕",
      transport: "🚗",
      shopping: "🛍️",
      utilities: "⚡",
      entertainment: "🎬",
      other: "💳"
    };
    return icons[category] || "💰";
  };

  const getCategoryName = (category: string) => {
    const names = {
      food: "Alimentação",
      transport: "Transporte",
      shopping: "Compras",
      utilities: "Contas",
      entertainment: "Entretenimento",
      other: "Outros"
    };
    return names[category] || category;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading text-white">Detalhes do Orçamento</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex space-x-4">
            <button 
              onClick={() => setViewMode('overview')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'overview' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <PieChart size={16} className="mr-2" />
              Visão Geral
            </button>
            <button 
              onClick={() => setViewMode('categories')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'categories' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <BarChart3 size={16} className="mr-2" />
              Categorias
            </button>
            <button 
              onClick={() => setViewMode('trends')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'trends' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <TrendingUp size={16} className="mr-2" />
              Tendências
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {viewMode === 'overview' && (
            <div className="space-y-6">
              {/* Overall Budget Progress */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Orçamento Total - {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-white font-medium">Gasto Total</span>
                    <span className="text-white text-2xl font-semibold">
                      R$ {totalSpent.toFixed(2)} de R$ {totalBudget.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end mb-3">
                    <span className={`text-sm font-medium ${
                      budgetPercentage > 100 ? 'text-red-400' : budgetPercentage > 80 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {budgetPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar h-3">
                    <div 
                      className={`progress-fill h-full transition-all duration-700 ${
                        budgetPercentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                        budgetPercentage > 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-600' :
                        'bg-gradient-to-r from-green-400 to-green-600'
                      }`}
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-sm">Restante</div>
                    <div className={`text-xl font-semibold ${
                      totalBudget - totalSpent < 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      R$ {(totalBudget - totalSpent).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-sm">Transações</div>
                    <div className="text-white text-xl font-semibold">{monthlyExpenses.length}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-sm">Média/Dia</div>
                    <div className="text-white text-xl font-semibold">
                      R$ {(totalSpent / new Date().getDate()).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'categories' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4">Gastos por Categoria</h3>
              
              {Object.entries(categoryData).map(([category, data]: [string, any]) => {
                const percentage = data.budget > 0 ? (data.spent / data.budget) * 100 : 0;
                
                return (
                  <div key={category} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                        <div>
                          <h4 className="text-white font-medium">{getCategoryName(category)}</h4>
                          <p className="text-white/60 text-sm">{data.count} transações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          R$ {data.spent.toFixed(2)} / R$ {data.budget.toFixed(2)}
                        </div>
                        <div className={`text-sm ${
                          percentage > 100 ? 'text-red-400' : percentage > 80 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="progress-bar h-2">
                      <div 
                        className={`progress-fill h-full transition-all duration-700 ${
                          percentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          percentage > 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-600' :
                          'bg-gradient-to-r from-green-400 to-green-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg mb-4">Análise de Tendências</h3>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Resumo do Mês</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`flex items-center justify-center mb-2 ${
                      budgetPercentage > 100 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {budgetPercentage > 100 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div className="text-white/80 text-sm">Status do Orçamento</div>
                    <div className={`font-semibold ${
                      budgetPercentage > 100 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {budgetPercentage > 100 ? 'Acima do Limite' : 'Dentro do Limite'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white text-2xl mb-2">📊</div>
                    <div className="text-white/80 text-sm">Categoria Maior</div>
                    <div className="text-white font-semibold">
                      {Object.entries(categoryData)
                        .sort(([,a]: [string, any], [,b]: [string, any]) => b.spent - a.spent)[0]?.[0] 
                        ? getCategoryName(Object.entries(categoryData).sort(([,a]: [string, any], [,b]: [string, any]) => b.spent - a.spent)[0][0])
                        : 'N/A'
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Projeção Mensal</h4>
                <p className="text-white/80 text-sm mb-2">
                  Com base nos gastos até agora, sua projeção para o final do mês é:
                </p>
                <div className="text-white text-xl font-semibold">
                  R$ {((totalSpent / new Date().getDate()) * 31).toFixed(2)}
                </div>
                <div className={`text-sm mt-1 ${
                  ((totalSpent / new Date().getDate()) * 31) > totalBudget ? 'text-red-400' : 'text-green-400'
                }`}>
                  {((totalSpent / new Date().getDate()) * 31) > totalBudget ? 'Acima' : 'Dentro'} do orçamento planejado
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailModal;
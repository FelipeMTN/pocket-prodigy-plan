import { useState } from "react";
import { Plus, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseListModal from "./ExpenseListModal";
import BudgetDetailModal from "./BudgetDetailModal";
import { useExpenses } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseListOpen, setIsExpenseListOpen] = useState(false);
  const [isBudgetDetailOpen, setIsBudgetDetailOpen] = useState(false);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const { expenses, loading, addExpense, deleteExpense } = useExpenses();
  const { toast } = useToast();

  const [budget] = useState({
    totalSpent: 5070,
    totalBudget: 10000,
    percentage: 44.7,
    categories: [
      { name: "Comida", spent: 2100, budget: 2500, percentage: 84, icon: "🍕" },
      { name: "Auto & Transporte", spent: 420, budget: 1200, percentage: 35, icon: "🚗" },
      { name: "Outros", spent: 2550, budget: 6300, percentage: 40.5, icon: "💳" }
    ]
  });

  const [cashFlow] = useState({
    period: "Últimos 6 meses",
    total: 30127,
    income: 63392,
    interest: 1478,
    categories: [
      { name: "Poupança", amount: 28799, percentage: 41 },
      { name: "Casa", amount: 15676, percentage: 22 },
      { name: "Auto & transporte", amount: 5789, percentage: 8 },
      { name: "Viagens & Férias", amount: 5180, percentage: 7 },
      { name: "Bebidas & Comida", amount: 4850, percentage: 7 },
      { name: "Saúde", amount: 4210, percentage: 6 }
    ]
  });

  const handleAddExpense = async (expense: any) => {
    try {
      await addExpense(expense);
      toast({
        title: "Gasto adicionado",
        description: "Seu gasto foi registrado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o gasto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast({
        title: "Gasto removido",
        description: "O gasto foi excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o gasto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
      <ExpenseListModal
        isOpen={isExpenseListOpen}
        onClose={() => setIsExpenseListOpen(false)}
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
      />
      <BudgetDetailModal
        isOpen={isBudgetDetailOpen}
        onClose={() => setIsBudgetDetailOpen(false)}
        expenses={expenses}
      />
      
      <div className="min-h-screen gradient-spend-tan relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-16 pb-8 relative z-10">
          <div className="mb-8">
            <h1 className="heading-display text-white italic mb-4">
              Acompanhe seus gastos
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">
              Veja suas despesas claramente com IA que ajuda você a manter o controle.
            </p>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="button-glass w-full py-4 mb-8 text-white font-semibold flex items-center justify-center"
          >
            <Plus className="mr-2" size={20} />
            Adicionar Gasto
          </button>
        </div>

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <div className="px-6 mb-6">
            <div className="glass-card animate-fade-in">
              <div className="p-4">
                <h3 className="text-white/60 font-medium tracking-wider text-sm mb-4">GASTOS RECENTES</h3>
                <div className="space-y-3">
                  {expenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{expense.description}</div>
                        <div className="text-white/60 text-sm">{new Date(expense.date).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div className="text-white font-semibold">R$ {expense.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                {expenses.length > 3 && (
                  <button 
                    onClick={() => setIsExpenseListOpen(true)}
                    className="text-primary text-sm mt-3 font-medium hover:text-primary-light transition-colors"
                  >
                    Ver todos os gastos ({expenses.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Budget Overview Card */}
        <div className="px-6 space-y-6">
          <div className="glass-card animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm">ORÇAMENTO</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsBudgetDetailOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Ver detalhes completos"
                  >
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title={isBudgetExpanded ? "Recolher" : "Expandir"}
                  >
                    {isBudgetExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Total Budget */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-white font-medium">Orçamento Total</span>
                  <span className="text-white text-xl font-semibold">
                    ${budget.totalSpent.toLocaleString()} of ${budget.totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-end mb-3">
                  <span className="text-white/80 text-sm">{budget.percentage}%</span>
                </div>
                <div className="progress-bar h-3">
                  <div 
                    className="progress-fill bg-gradient-to-r from-orange-400 to-orange-600"
                    style={{ width: `${budget.percentage}%` }}
                  />
                </div>
              </div>

              {/* Category Breakdown */}
              {isBudgetExpanded && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white/80 font-medium mb-3 text-sm">BREAKDOWN POR CATEGORIA</h4>
                    {budget.categories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="mr-3 text-lg">{category.icon}</span>
                            <span className="text-white font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-semibold text-sm">
                              ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                            </span>
                            <div className="text-white/80 text-xs">{category.percentage}%</div>
                          </div>
                        </div>
                        <div className="progress-bar h-2">
                          <div 
                            className="progress-fill bg-gradient-to-r from-orange-300 to-orange-500"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                          <span>Restante: ${(category.budget - category.spent).toLocaleString()}</span>
                          <span className={category.percentage > 90 ? 'text-red-400' : category.percentage > 70 ? 'text-yellow-400' : 'text-green-400'}>
                            {category.percentage > 90 ? 'Atenção!' : category.percentage > 70 ? 'Cuidado' : 'No limite'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cash Flow Card */}
          <div className="glass-card animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm">FLUXO DE CAIXA</h3>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg border border-white/20 text-white/60">📊</button>
                  <button className="p-2 rounded-lg border border-white/20 text-white/60">📈</button>
                  <button className="p-2 rounded-lg border border-white/20 text-white/60">🔄</button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-white/80 text-sm mb-1">{cashFlow.period}</div>
                <div className="text-white text-2xl font-semibold">${cashFlow.total.toLocaleString()}</div>
              </div>

              {/* Income Breakdown */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-white/80 text-sm">Renda</div>
                    <div className="text-white font-semibold">${cashFlow.income.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">Juros</div>
                    <div className="text-white font-semibold">${cashFlow.interest.toLocaleString()}</div>
                  </div>
                </div>
                
                {/* Category spending breakdown */}
                <div className="space-y-2">
                  {cashFlow.categories.map((category, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white/80">{category.name}</span>
                      <span className="text-white">${category.amount.toLocaleString()} ({category.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pt-8 pb-4">
          <p className="text-white/90 text-center text-sm leading-relaxed">
            Conecte com segurança todas suas contas correntes e cartões de crédito para acompanhar seus gastos em um só lugar.
          </p>
        </div>
      </div>
    </>
  );
};

export default Expenses;
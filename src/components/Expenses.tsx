import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 45.67, category: "food", description: "Lunch at cafe", date: "2024-01-15" },
    { id: 2, amount: 120.00, category: "transport", description: "Gas station", date: "2024-01-14" },
    { id: 3, amount: 85.50, category: "shopping", description: "Groceries", date: "2024-01-13" }
  ]);

  const [budget] = useState({
    totalSpent: 5070,
    totalBudget: 10000,
    percentage: 44.7,
    categories: [
      { name: "Food", spent: 2100, budget: 2500, percentage: 84, icon: "🍕" },
      { name: "Auto & Transport", spent: 420, budget: 1200, percentage: 35, icon: "🚗" },
      { name: "Everything Else", spent: 2550, budget: 6300, percentage: 40.5, icon: "💳" }
    ]
  });

  const [cashFlow] = useState({
    period: "Last 6 months",
    total: 30127,
    income: 63392,
    interest: 1478,
    categories: [
      { name: "Savings", amount: 28799, percentage: 41 },
      { name: "Household", amount: 15676, percentage: 22 },
      { name: "Auto & transport", amount: 5789, percentage: 8 },
      { name: "Travel & vacation", amount: 5180, percentage: 7 },
      { name: "Drinks & dining", amount: 4850, percentage: 7 },
      { name: "Healthcare", amount: 4210, percentage: 6 }
    ]
  });

  const handleAddExpense = (expense: any) => {
    setExpenses(prev => [expense, ...prev]);
  };

  return (
    <>
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
      
      <div className="min-h-screen gradient-warm relative overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-16 pb-8 relative z-10">
          <div className="mb-8">
            <h1 className="heading-display text-white italic mb-4">
              Track your spending
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">
              See your expenses clearly with AI that helps you stay in control.
            </p>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="button-glass w-full py-4 mb-8 text-white font-semibold flex items-center justify-center"
          >
            <Plus className="mr-2" size={20} />
            Add Expense
          </button>
        </div>

        {/* Budget Overview Card */}
        <div className="px-6 space-y-6">
          <div className="glass-card animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm">BUDGET</h3>
                <ArrowRight className="text-white/60" size={20} />
              </div>

              {/* Total Budget */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-white font-medium">Total Budget</span>
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
              <div className="space-y-4">
                {budget.categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{category.icon}</span>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <span className="text-white/80 text-sm">{category.percentage}%</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div 
                        className="progress-fill bg-gradient-to-r from-orange-300 to-orange-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cash Flow Card */}
          <div className="glass-card animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white/60 font-medium tracking-wider text-sm">CASH FLOW</h3>
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
                    <div className="text-white/80 text-sm">Income</div>
                    <div className="text-white font-semibold">${cashFlow.income.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">Interest</div>
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
            Securely connect all your checking accounts and credit cards to track your spending in one place.
          </p>
        </div>
      </div>
    </>
  );
};

export default Expenses;
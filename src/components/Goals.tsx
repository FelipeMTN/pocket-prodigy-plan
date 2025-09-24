import { useState } from "react";
import { Plus, Target, Calendar, DollarSign, Edit3, Trash2 } from "lucide-react";
import AddGoalModal from "./AddGoalModal";

const Goals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Reserva de Emergência",
      target: 15000,
      current: 8500,
      deadline: "Dez 2024",
      category: "Segurança",
      color: "from-blue-400 to-blue-600",
      monthlyTarget: 650
    },
    {
      id: 2,
      title: "Notebook Novo",
      target: 3000,
      current: 1200,
      deadline: "Ago 2024",
      category: "Tecnologia",
      color: "from-purple-400 to-purple-600",
      monthlyTarget: 450
    },
    {
      id: 3,
      title: "Viagem para Europa",
      target: 8000,
      current: 3200,
      deadline: "Jun 2025",
      category: "Viagem",
      color: "from-green-400 to-green-600",
      monthlyTarget: 400
    },
    {
      id: 4,
      title: "Entrada da Casa",
      target: 50000,
      current: 22000,
      deadline: "Dez 2025",
      category: "Casa",
      color: "from-orange-400 to-orange-600",
      monthlyTarget: 2334
    }
  ]);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleAddGoal = (goal: any) => {
    setGoals(prev => [...prev, goal]);
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const handleAddToGoal = (goalId: number, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
        : goal
    ));
  };

  return (
    <>
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGoal}
      />
      
      <div className="min-h-screen gradient-purple relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <div className="mb-8">
            <h1 className="heading-display text-white italic mb-4">
              Alcance suas metas
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">
              Defina objetivos financeiros e acompanhe seu progresso com insights inteligentes de economia.
            </p>
        </div>

        {/* Add Goal Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="button-glass w-full py-4 mb-8 text-white font-semibold flex items-center justify-center"
        >
          <Plus className="mr-2" size={20} />
          Adicionar Nova Meta
        </button>
      </div>

      {/* Overall Progress Card */}
      <div className="px-6 space-y-6">
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm">PROGRESSO GERAL</h3>
              <Target className="text-white/60" size={20} />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-white font-medium">Total Poupado</span>
                <span className="text-white text-2xl font-semibold">
                  ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-end mb-3">
                <span className="text-white/80 text-sm">{overallProgress.toFixed(1)}%</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-fill bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Metas Alcançadas</div>
                <div className="text-white text-xl font-semibold">0</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/60 text-sm">Metas Ativas</div>
                <div className="text-white text-xl font-semibold">{goals.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Goals */}
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          
          return (
            <div key={goal.id} className="glass-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-semibold text-lg">{goal.title}</h4>
                        <div className="flex items-center text-white/60 text-sm mt-1">
                          <Calendar className="mr-1" size={14} />
                          <span className="mr-3">{goal.deadline}</span>
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                            {goal.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddToGoal(goal.id, 100)}
                          className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Adicionar R$100"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Excluir Meta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <div className="text-white font-semibold">
                        ${goal.current.toLocaleString()}
                      </div>
                      <div className="text-white/60 text-sm">
                        of ${goal.target.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">{progress.toFixed(1)}% completo</span>
                    <span className="text-white/80">R${remaining.toLocaleString()} restante</span>
                  </div>
                  <div className="progress-bar h-3">
                    <div 
                      className={`progress-fill bg-gradient-to-r ${goal.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Monthly Target */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/80 text-sm">
                      <DollarSign className="mr-1" size={14} />
                      Meta mensal para alcançar objetivo
                    </div>
                    <span className="text-white font-semibold">
                      R${goal.monthlyTarget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Tip */}
      <div className="px-6 pt-8 pb-4">
        <div className="glass-card p-4">
          <div className="text-white/90 text-sm text-center">
            💡 <strong>Dica:</strong> Configure transferências automáticas para alcançar suas metas mais rápido e manter consistência com seu plano de poupança.
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Goals;
import { useState } from "react";
import { X, Plus, Minus, Target, Calendar, Edit3, DollarSign } from "lucide-react";

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: any;
  onUpdateGoal: (id: string, updates: any) => void;
}

const GoalDetailModal = ({ isOpen, onClose, goal, onUpdateGoal }: GoalDetailModalProps) => {
  const [contributionAmount, setContributionAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(goal);

  if (!isOpen || !goal) return null;

  const progress = (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100;
  const remaining = parseFloat(goal.target_amount) - parseFloat(goal.current_amount);
  const monthsLeft = goal.deadline ? Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))) : 1;
  const monthlyTarget = remaining / monthsLeft;

  const handleContribution = async (amount: number) => {
    const newAmount = Math.min(parseFloat(goal.current_amount) + amount, parseFloat(goal.target_amount));
    await onUpdateGoal(goal.id, { current_amount: newAmount });
    setContributionAmount("");
  };

  const handleCustomContribution = async () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      await handleContribution(amount);
    }
  };

  const handleSaveEdits = async () => {
    await onUpdateGoal(goal.id, {
      title: editedGoal.title,
      target_amount: editedGoal.target_amount,
      deadline: editedGoal.deadline,
      category: editedGoal.category
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedGoal.title}
                  onChange={(e) => setEditedGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-heading text-white bg-transparent border-b border-white/20 focus:border-white/60 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-heading text-white">{goal.title}</h2>
              )}
              <p className="text-white/80 mt-1">{goal.category}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <Edit3 size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Progress Overview */}
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-white font-medium">Progresso</span>
              <div className="text-right">
                <span className="text-white text-2xl font-semibold">
                  R$ {parseFloat(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="text-white/80 text-sm">
                  de R$ {parseFloat(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">{progress.toFixed(1)}% completo</span>
                <span className="text-white/80">R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} restante</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className={`progress-fill bg-gradient-to-r ${goal.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {progress >= 100 && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-center">
                <div className="text-green-400 text-2xl mb-2">🎉</div>
                <div className="text-green-400 font-semibold">Parabéns! Meta alcançada!</div>
              </div>
            )}
          </div>

          {/* Goal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Calendar className="mr-2" size={16} />
                <span className="text-sm">Prazo</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={editedGoal.deadline}
                  onChange={(e) => setEditedGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="text-white font-semibold bg-transparent border-b border-white/20 focus:border-white/60 outline-none"
                />
              ) : (
                <div className="text-white font-semibold">
                  {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Sem prazo definido'}
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center text-white/80 mb-2">
                <Target className="mr-2" size={16} />
                <span className="text-sm">Meta Mensal</span>
              </div>
              <div className="text-white font-semibold">
                R$ {monthlyTarget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {isEditing && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center text-white/80 mb-2">
                  <DollarSign className="mr-2" size={16} />
                  <span className="text-sm">Valor da Meta</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={editedGoal.target_amount}
                  onChange={(e) => setEditedGoal(prev => ({ ...prev, target_amount: e.target.value }))}
                  className="text-white font-semibold bg-transparent border-b border-white/20 focus:border-white/60 outline-none w-full"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleSaveEdits}
                className="button-glass px-6 py-3 text-white font-semibold flex-1"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-white/20 rounded-xl text-white/80 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : progress < 100 && (
            <>
              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Adicionar Contribuição</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    onClick={() => handleContribution(50)}
                    className="button-glass py-3 text-white font-medium"
                  >
                    +R$ 50
                  </button>
                  <button
                    onClick={() => handleContribution(100)}
                    className="button-glass py-3 text-white font-medium"
                  >
                    +R$ 100
                  </button>
                  <button
                    onClick={() => handleContribution(500)}
                    className="button-glass py-3 text-white font-medium"
                  >
                    +R$ 500
                  </button>
                </div>

                {/* Custom Amount */}
                <div className="flex space-x-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor personalizado"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
                  />
                  <button
                    onClick={handleCustomContribution}
                    disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
                    className="button-glass px-6 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Timeline & Tips */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Dicas para Alcançar sua Meta</h3>
            <div className="space-y-2 text-white/80 text-sm">
              <p>• Configure transferências automáticas mensais de R$ {monthlyTarget.toFixed(2)}</p>
              <p>• Acompanhe seu progresso semanalmente</p>
              <p>• Considere investir o dinheiro em uma conta que renda juros</p>
              {monthsLeft <= 3 && (
                <p className="text-yellow-400">⚠️ Prazo se aproximando - considere aumentar as contribuições</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailModal;
import { useState } from "react";
import { X, Target, Calendar, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: any) => void;
}

const AddGoalModal = ({ isOpen, onClose, onAdd }: AddGoalModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    deadline: "",
    category: "savings",
    description: ""
  });

  const categories = [
    { id: "savings", label: "Reserva de Emergência", icon: "🛡️", color: "from-blue-400 to-blue-600" },
    { id: "tech", label: "Tecnologia", icon: "💻", color: "from-purple-400 to-purple-600" },
    { id: "travel", label: "Viagem", icon: "✈️", color: "from-green-400 to-green-600" },
    { id: "housing", label: "Casa", icon: "🏠", color: "from-orange-400 to-orange-600" },
    { id: "education", label: "Educação", icon: "🎓", color: "from-indigo-400 to-indigo-600" },
    { id: "health", label: "Saúde", icon: "🏥", color: "from-red-400 to-red-600" },
    { id: "investment", label: "Investimento", icon: "📈", color: "from-yellow-400 to-yellow-600" },
    { id: "other", label: "Outros", icon: "🎯", color: "from-pink-400 to-pink-600" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.deadline) return;

    const selectedCategory = categories.find(cat => cat.id === formData.category);
    const targetAmount = parseFloat(formData.target);
    const deadline = new Date(formData.deadline);
    const today = new Date();
    const monthsToDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));

    const goal = {
      id: Date.now(),
      title: formData.title,
      target: targetAmount,
      current: 0,
      deadline: deadline.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: selectedCategory?.label || "Other",
      color: selectedCategory?.color || "from-gray-400 to-gray-600",
      monthlyTarget: monthsToDeadline > 0 ? Math.ceil(targetAmount / monthsToDeadline) : targetAmount,
      description: formData.description,
      createdAt: new Date().toISOString()
    };

    onAdd(goal);
    onClose();
    setFormData({
      title: "",
      target: "",
      deadline: "",
      category: "savings",
      description: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md animate-slide-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-heading font-semibold text-xl">Criar Meta Financeira</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Goal Title */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Título da Meta
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="ex: Reserva de Emergência, Notebook Novo"
                required
              />
            </div>

            {/* Target Amount */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Valor da Meta
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-white/60" size={20} />
                <Input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="5000.00"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Categoria
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      formData.category === category.id
                        ? 'bg-primary/20 border-primary text-white'
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Data Alvo
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-white/60" size={20} />
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Descrição (Opcional)
              </Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Por que essa meta é importante para você?"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
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
              className="flex-1 button-primary"
            >
              Criar Meta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
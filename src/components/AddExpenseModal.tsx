import { useState } from "react";
import { X, DollarSign, Calendar, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: any) => void;
}

const AddExpenseModal = ({ isOpen, onClose, onAdd }: AddExpenseModalProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "food",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: "food", label: "Food & Dining", icon: "🍕" },
    { id: "transport", label: "Transport", icon: "🚗" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "bills", label: "Bills & Utilities", icon: "⚡" },
    { id: "entertainment", label: "Entertainment", icon: "🎬" },
    { id: "health", label: "Healthcare", icon: "🏥" },
    { id: "other", label: "Other", icon: "💳" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const expense = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      timestamp: new Date().toISOString()
    };

    onAdd(expense);
    onClose();
    setFormData({
      amount: "",
      category: "food",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md animate-slide-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-heading font-semibold text-xl">Add Expense</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-white/60" size={20} />
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Description
              </Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="What did you spend on?"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Category
              </Label>
              <div className="grid grid-cols-2 gap-2">
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

            {/* Date */}
            <div>
              <Label className="text-white/80 text-sm font-medium mb-2 block">
                Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-white/60" size={20} />
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-primary"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
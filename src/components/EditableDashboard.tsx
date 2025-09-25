import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useManualAssets } from '@/hooks/useManualAssets';
import { useManualLiabilities } from '@/hooks/useManualLiabilities';
import { useExpenses, useGoals, useInvestments } from '@/hooks/useSupabaseData';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PiggyBank,
  Home,
  Car,
  Wallet,
  CreditCard
} from 'lucide-react';

interface AssetFormData {
  name: string;
  type: 'cash' | 'savings' | 'real_estate' | 'vehicle' | 'other';
  value: number;
  description: string;
}

interface LiabilityFormData {
  name: string;
  type: 'mortgage' | 'car_loan' | 'credit_card' | 'personal_loan' | 'other';
  balance: number;
  interest_rate?: number;
  monthly_payment?: number;
  description: string;
}

const EditableDashboard = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'assets' | 'liabilities'>('overview');
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isAddingLiability, setIsAddingLiability] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editingLiability, setEditingLiability] = useState<any>(null);
  
  const [assetForm, setAssetForm] = useState<AssetFormData>({
    name: '',
    type: 'cash',
    value: 0,
    description: ''
  });

  const [liabilityForm, setLiabilityForm] = useState<LiabilityFormData>({
    name: '',
    type: 'credit_card',
    balance: 0,
    interest_rate: 0,
    monthly_payment: 0,
    description: ''
  });

  const { assets, loading: assetsLoading, addAsset, updateAsset, deleteAsset } = useManualAssets();
  const { liabilities, loading: liabilitiesLoading, addLiability, updateLiability, deleteLiability } = useManualLiabilities();
  const { expenses } = useExpenses();
  const { goals } = useGoals();
  const { investments } = useInvestments();
  const { toast } = useToast();

  const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value), 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + Number(liability.balance), 0);
  const netWorth = totalAssets - totalLiabilities;
  const totalInvestments = investments.reduce((sum, inv) => sum + (Number(inv.shares) * Number(inv.price)), 0);

  const resetAssetForm = () => {
    setAssetForm({
      name: '',
      type: 'cash',
      value: 0,
      description: ''
    });
    setEditingAsset(null);
  };

  const resetLiabilityForm = () => {
    setLiabilityForm({
      name: '',
      type: 'credit_card',
      balance: 0,
      interest_rate: 0,
      monthly_payment: 0,
      description: ''
    });
    setEditingLiability(null);
  };

  const handleAddAsset = async () => {
    try {
      await addAsset(assetForm);
      toast({
        title: "Ativo adicionado!",
        description: "O ativo foi registrado com sucesso.",
      });
      setIsAddingAsset(false);
      resetAssetForm();
    } catch (error) {
      toast({
        title: "Erro ao adicionar ativo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditAsset = async () => {
    if (!editingAsset) return;
    
    try {
      await updateAsset(editingAsset.id, assetForm);
      toast({
        title: "Ativo atualizado!",
        description: "As alterações foram salvas.",
      });
      setEditingAsset(null);
      resetAssetForm();
    } catch (error) {
      toast({
        title: "Erro ao atualizar ativo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAsset(id);
      toast({
        title: "Ativo removido",
        description: "O ativo foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover ativo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAddLiability = async () => {
    try {
      await addLiability(liabilityForm);
      toast({
        title: "Passivo adicionado!",
        description: "O passivo foi registrado com sucesso.",
      });
      setIsAddingLiability(false);
      resetLiabilityForm();
    } catch (error) {
      toast({
        title: "Erro ao adicionar passivo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditLiability = async () => {
    if (!editingLiability) return;
    
    try {
      await updateLiability(editingLiability.id, liabilityForm);
      toast({
        title: "Passivo atualizado!",
        description: "As alterações foram salvas.",
      });
      setEditingLiability(null);
      resetLiabilityForm();
    } catch (error) {
      toast({
        title: "Erro ao atualizar passivo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLiability = async (id: string) => {
    try {
      await deleteLiability(id);
      toast({
        title: "Passivo removido",
        description: "O passivo foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover passivo",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const startEditAsset = (asset: any) => {
    setAssetForm({
      name: asset.name,
      type: asset.type,
      value: asset.value,
      description: asset.description || ''
    });
    setEditingAsset(asset);
  };

  const startEditLiability = (liability: any) => {
    setLiabilityForm({
      name: liability.name,
      type: liability.type,
      balance: liability.balance,
      interest_rate: liability.interest_rate || 0,
      monthly_payment: liability.monthly_payment || 0,
      description: liability.description || ''
    });
    setEditingLiability(liability);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'cash': return <Wallet className="w-5 h-5" />;
      case 'savings': return <PiggyBank className="w-5 h-5" />;
      case 'real_estate': return <Home className="w-5 h-5" />;
      case 'vehicle': return <Car className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getLiabilityIcon = (type: string) => {
    switch (type) {
      case 'mortgage': return <Home className="w-5 h-5" />;
      case 'car_loan': return <Car className="w-5 h-5" />;
      case 'credit_card': return <CreditCard className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const ViewToggle = () => (
    <div className="flex bg-white/60 p-1 rounded-lg mb-6 mx-4 backdrop-blur-sm">
      {(['overview', 'assets', 'liabilities'] as const).map((view) => (
        <button
          key={view}
          onClick={() => setSelectedView(view)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            selectedView === view
              ? 'bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
          }`}
        >
          {view === 'overview' && 'Resumo'}
          {view === 'assets' && 'Ativos'}
          {view === 'liabilities' && 'Passivos'}
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="px-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-white/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-800">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-600">
              {assets.length} {assets.length === 1 ? 'item' : 'itens'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-800">Passivos</span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              R$ {totalLiabilities.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-600">
              {liabilities.length} {liabilities.length === 1 ? 'item' : 'itens'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-800">Patrimônio Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`text-3xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              R$ {Math.abs(netWorth).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {netWorth < 0 && ' (Negativo)'}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Ativos: R$ {totalAssets.toLocaleString('pt-BR')}</span>
                <span>Passivos: R$ {totalLiabilities.toLocaleString('pt-BR')}</span>
              </div>
              <Progress 
                value={totalAssets > 0 ? (totalAssets / (totalAssets + totalLiabilities)) * 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-white/80">
          <CardContent className="p-3 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold text-gray-800">{expenses.length}</p>
            <p className="text-xs text-gray-600">Gastos</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/80">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-600" />
            <p className="text-lg font-bold text-gray-800">{goals.length}</p>
            <p className="text-xs text-gray-600">Metas</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/80">
          <CardContent className="p-3 text-center">
            <PiggyBank className="w-6 h-6 mx-auto mb-1 text-cyan-600" />
            <p className="text-lg font-bold text-gray-800">
              R$ {totalInvestments.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-600">Investimentos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="px-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-lg">Meus Ativos</h3>
        <Dialog open={isAddingAsset} onOpenChange={setIsAddingAsset}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetAssetForm} className="button-glass">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/80">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Adicionar Ativo</DialogTitle>
              <DialogDescription className="text-gray-600">
                Registre um novo ativo em seu patrimônio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name" className="text-white">Nome</Label>
                <Input
                  id="asset-name"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Conta corrente, Casa, Carro..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="asset-type" className="text-white">Tipo</Label>
                <Select value={assetForm.type} onValueChange={(value: any) => setAssetForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="savings">Poupança</SelectItem>
                    <SelectItem value="real_estate">Imóvel</SelectItem>
                    <SelectItem value="vehicle">Veículo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="asset-value" className="text-white">Valor (R$)</Label>
                <Input
                  id="asset-value"
                  type="number"
                  step="0.01"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="asset-description" className="text-white">Descrição (opcional)</Label>
                <Textarea
                  id="asset-description"
                  value={assetForm.description}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Informações adicionais..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAsset} className="button-primary">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="glass-card border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-white">{getAssetIcon(asset.type)}</div>
                <div>
                  <p className="font-medium text-white">{asset.name}</p>
                  <p className="text-sm text-white/70">
                    R$ {Number(asset.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEditAsset(asset)} className="button-glass">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteAsset(asset.id)} className="button-glass">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {assets.length === 0 && (
          <Card className="glass-card border-white/10 p-8 text-center">
            <p className="text-white/70">Nenhum ativo registrado ainda.</p>
            <p className="text-sm text-white/50 mt-1">Adicione seus ativos para começar.</p>
          </Card>
        )}
      </div>
    </div>
  );

  const renderLiabilities = () => (
    <div className="px-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white text-lg">Meus Passivos</h3>
        <Dialog open={isAddingLiability} onOpenChange={setIsAddingLiability}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetLiabilityForm} className="button-glass">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Adicionar Passivo</DialogTitle>
              <DialogDescription className="text-white/70">
                Registre um novo passivo ou dívida.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="liability-name" className="text-white">Nome</Label>
                <Input
                  id="liability-name"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cartão de crédito, Financiamento..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="liability-type" className="text-white">Tipo</Label>
                <Select value={liabilityForm.type} onValueChange={(value: any) => setLiabilityForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="mortgage">Hipoteca</SelectItem>
                    <SelectItem value="car_loan">Financiamento de Carro</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="personal_loan">Empréstimo Pessoal</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="liability-balance" className="text-white">Saldo Devedor (R$)</Label>
                <Input
                  id="liability-balance"
                  type="number"
                  step="0.01"
                  value={liabilityForm.balance}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="liability-interest" className="text-white">Taxa de Juros (% ao ano)</Label>
                <Input
                  id="liability-interest"
                  type="number"
                  step="0.01"
                  value={liabilityForm.interest_rate}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, interest_rate: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="liability-payment" className="text-white">Pagamento Mensal (R$)</Label>
                <Input
                  id="liability-payment"
                  type="number"
                  step="0.01"
                  value={liabilityForm.monthly_payment}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, monthly_payment: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="liability-description" className="text-white">Descrição (opcional)</Label>
                <Textarea
                  id="liability-description"
                  value={liabilityForm.description}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Informações adicionais..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddLiability} className="button-primary">
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {liabilities.map((liability) => (
          <Card key={liability.id} className="glass-card border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-white">{getLiabilityIcon(liability.type)}</div>
                <div>
                  <p className="font-medium text-white">{liability.name}</p>
                  <p className="text-sm text-white/70">
                    R$ {Number(liability.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {liability.monthly_payment && (
                    <p className="text-xs text-white/50">
                      Mensal: R$ {Number(liability.monthly_payment).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEditLiability(liability)} className="button-glass">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteLiability(liability.id)} className="button-glass">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {liabilities.length === 0 && (
          <Card className="glass-card border-white/10 p-8 text-center">
            <p className="text-white/70">Nenhum passivo registrado ainda.</p>
            <p className="text-sm text-white/50 mt-1">Adicione seus passivos para começar.</p>
          </Card>
        )}
      </div>
    </div>
  );

  if (assetsLoading || liabilitiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center text-white pt-8 pb-4">
        <h1 className="text-3xl font-bold mb-2">Dashboard Financeiro</h1>
        <p className="text-white/80">Gerencie seus ativos e passivos com controle total</p>
      </div>

      <ViewToggle />

      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'assets' && renderAssets()}
      {selectedView === 'liabilities' && renderLiabilities()}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Ativo</DialogTitle>
              <DialogDescription className="text-white/70">
                Atualize as informações do ativo selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-asset-name" className="text-white">Nome</Label>
                <Input
                  id="edit-asset-name"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-asset-type" className="text-white">Tipo</Label>
                <Select value={assetForm.type} onValueChange={(value: any) => setAssetForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="savings">Poupança</SelectItem>
                    <SelectItem value="real_estate">Imóvel</SelectItem>
                    <SelectItem value="vehicle">Veículo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-asset-value" className="text-white">Valor (R$)</Label>
                <Input
                  id="edit-asset-value"
                  type="number"
                  step="0.01"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-asset-description" className="text-white">Descrição (opcional)</Label>
                <Textarea
                  id="edit-asset-description"
                  value={assetForm.description}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditAsset} className="button-primary">Atualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Liability Modal */}
      {editingLiability && (
        <Dialog open={!!editingLiability} onOpenChange={() => setEditingLiability(null)}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Passivo</DialogTitle>
              <DialogDescription className="text-white/70">
                Atualize as informações do passivo selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-liability-name" className="text-white">Nome</Label>
                <Input
                  id="edit-liability-name"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-liability-type" className="text-white">Tipo</Label>
                <Select value={liabilityForm.type} onValueChange={(value: any) => setLiabilityForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="mortgage">Hipoteca</SelectItem>
                    <SelectItem value="car_loan">Financiamento de Carro</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="personal_loan">Empréstimo Pessoal</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-liability-balance" className="text-white">Saldo Devedor (R$)</Label>
                <Input
                  id="edit-liability-balance"
                  type="number"
                  step="0.01"
                  value={liabilityForm.balance}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-liability-interest" className="text-white">Taxa de Juros (% ao ano)</Label>
                <Input
                  id="edit-liability-interest"
                  type="number"
                  step="0.01"
                  value={liabilityForm.interest_rate}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, interest_rate: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-liability-payment" className="text-white">Pagamento Mensal (R$)</Label>
                <Input
                  id="edit-liability-payment"
                  type="number"
                  step="0.01"
                  value={liabilityForm.monthly_payment}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, monthly_payment: Number(e.target.value) }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-liability-description" className="text-white">Descrição (opcional)</Label>
                <Textarea
                  id="edit-liability-description"
                  value={liabilityForm.description}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditLiability} className="button-primary">Atualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditableDashboard;
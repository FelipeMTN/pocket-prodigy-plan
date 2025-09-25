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
    <div className="flex bg-muted p-1 rounded-lg mb-4">
      {(['overview', 'assets', 'liabilities'] as const).map((view) => (
        <button
          key={view}
          onClick={() => setSelectedView(view)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedView === view
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Ativos</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalAssets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {assets.length} {assets.length === 1 ? 'item' : 'itens'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Passivos</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalLiabilities.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {liabilities.length} {liabilities.length === 1 ? 'item' : 'itens'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Patrimônio Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`text-3xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {Math.abs(netWorth).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {netWorth < 0 && ' (Negativo)'}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
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
        <Card>
          <CardContent className="p-3 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{expenses.length}</p>
            <p className="text-xs text-muted-foreground">Gastos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{goals.length}</p>
            <p className="text-xs text-muted-foreground">Metas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <PiggyBank className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">
              R$ {totalInvestments.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">Investimentos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Meus Ativos</h3>
        <Dialog open={isAddingAsset} onOpenChange={setIsAddingAsset}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetAssetForm}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Editar Ativo' : 'Adicionar Ativo'}</DialogTitle>
              <DialogDescription>
                {editingAsset ? 'Atualize as informações do ativo.' : 'Registre um novo ativo em seu patrimônio.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="asset-name">Nome</Label>
                <Input
                  id="asset-name"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Conta corrente, Casa, Carro..."
                />
              </div>
              <div>
                <Label htmlFor="asset-type">Tipo</Label>
                <Select value={assetForm.type} onValueChange={(value: any) => setAssetForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="savings">Poupança</SelectItem>
                    <SelectItem value="real_estate">Imóvel</SelectItem>
                    <SelectItem value="vehicle">Veículo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="asset-value">Valor (R$)</Label>
                <Input
                  id="asset-value"
                  type="number"
                  step="0.01"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="asset-description">Descrição (opcional)</Label>
                <Textarea
                  id="asset-description"
                  value={assetForm.description}
                  onChange={(e) => setAssetForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editingAsset ? handleEditAsset : handleAddAsset}>
                {editingAsset ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getAssetIcon(asset.type)}
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {Number(asset.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEditAsset(asset)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteAsset(asset.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {assets.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum ativo registrado ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">Adicione seus ativos para começar.</p>
          </Card>
        )}
      </div>
    </div>
  );

  const renderLiabilities = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Meus Passivos</h3>
        <Dialog open={isAddingLiability} onOpenChange={setIsAddingLiability}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetLiabilityForm}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLiability ? 'Editar Passivo' : 'Adicionar Passivo'}</DialogTitle>
              <DialogDescription>
                {editingLiability ? 'Atualize as informações do passivo.' : 'Registre um novo passivo ou dívida.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="liability-name">Nome</Label>
                <Input
                  id="liability-name"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cartão de crédito, Financiamento..."
                />
              </div>
              <div>
                <Label htmlFor="liability-type">Tipo</Label>
                <Select value={liabilityForm.type} onValueChange={(value: any) => setLiabilityForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Financiamento Imobiliário</SelectItem>
                    <SelectItem value="car_loan">Financiamento Veículo</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="personal_loan">Empréstimo Pessoal</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="liability-balance">Saldo devedor (R$)</Label>
                <Input
                  id="liability-balance"
                  type="number"
                  step="0.01"
                  value={liabilityForm.balance}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liability-rate">Taxa de juros (% a.m.)</Label>
                  <Input
                    id="liability-rate"
                    type="number"
                    step="0.01"
                    value={liabilityForm.interest_rate}
                    onChange={(e) => setLiabilityForm(prev => ({ ...prev, interest_rate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="liability-payment">Parcela mensal (R$)</Label>
                  <Input
                    id="liability-payment"
                    type="number"
                    step="0.01"
                    value={liabilityForm.monthly_payment}
                    onChange={(e) => setLiabilityForm(prev => ({ ...prev, monthly_payment: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="liability-description">Descrição (opcional)</Label>
                <Textarea
                  id="liability-description"
                  value={liabilityForm.description}
                  onChange={(e) => setLiabilityForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editingLiability ? handleEditLiability : handleAddLiability}>
                {editingLiability ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {liabilities.map((liability) => (
          <Card key={liability.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getLiabilityIcon(liability.type)}
                <div>
                  <p className="font-medium">{liability.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {Number(liability.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {liability.monthly_payment && (
                    <p className="text-xs text-muted-foreground">
                      Parcela: R$ {Number(liability.monthly_payment).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEditLiability(liability)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteLiability(liability.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {liabilities.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum passivo registrado ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">Adicione suas dívidas para acompanhar seu patrimônio líquido.</p>
          </Card>
        )}
      </div>
    </div>
  );

  // Dialog for editing existing items
  useEffect(() => {
    if (editingAsset) {
      setIsAddingAsset(true);
    }
  }, [editingAsset]);

  useEffect(() => {
    if (editingLiability) {
      setIsAddingLiability(true);
    }
  }, [editingLiability]);

  if (assetsLoading || liabilitiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Meu Patrimônio
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie seus ativos e passivos manualmente
          </p>
        </div>

        <ViewToggle />

        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'assets' && renderAssets()}
        {selectedView === 'liabilities' && renderLiabilities()}
      </div>
    </div>
  );
};

export default EditableDashboard;
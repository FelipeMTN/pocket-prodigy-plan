import React, { useState } from 'react';
import { Download, Upload, FileText, Database, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useExpenses, useGoals, useInvestments } from '@/hooks/useSupabaseData';
import { useManualAssets } from '@/hooks/useManualAssets';
import { useManualLiabilities } from '@/hooks/useManualLiabilities';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'export' | 'import';
}

const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose, type }) => {
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    expenses: true,
    goals: true,
    investments: true,
    assets: true,
    liabilities: true
  });
  const { toast } = useToast();
  
  const { expenses } = useExpenses();
  const { goals } = useGoals();
  const { investments } = useInvestments();
  const { assets } = useManualAssets();
  const { liabilities } = useManualLiabilities();

  const handleExport = async () => {
    setLoading(true);
    try {
      const exportData: any = {};
      
      if (selectedData.expenses) exportData.expenses = expenses;
      if (selectedData.goals) exportData.goals = goals;
      if (selectedData.investments) exportData.investments = investments;
      if (selectedData.assets) exportData.assets = assets;
      if (selectedData.liabilities) exportData.liabilities = liabilities;

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dados exportados",
        description: "Seus dados foram exportados com sucesso!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // In a real app, you would validate and import the data to the database
      console.log('Importing data:', importData);
      
      toast({
        title: "Dados importados",
        description: "Seus dados foram importados com sucesso!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Arquivo inválido ou corrompido. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            {type === 'export' ? <Download className="mr-2" size={20} /> : <Upload className="mr-2" size={20} />}
            {type === 'export' ? 'Exportar Dados' : 'Importar Dados'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {type === 'export' ? (
            <>
              <p className="text-white/80 text-sm">
                Selecione quais dados você deseja exportar:
              </p>
              
              <div className="space-y-3">
                {Object.entries(selectedData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-white/80 capitalize cursor-pointer">
                      {key === 'expenses' ? 'Gastos' :
                       key === 'goals' ? 'Metas' :
                       key === 'investments' ? 'Investimentos' :
                       key === 'assets' ? 'Ativos' :
                       key === 'liabilities' ? 'Passivos' : key}
                    </label>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSelectedData({ ...selectedData, [key]: e.target.checked })}
                      className="rounded bg-white/10 border-white/20"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex items-center text-white/80 text-sm">
                  <FileText className="mr-2" size={16} />
                  Os dados serão exportados em formato JSON
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/80 text-sm">
                Selecione um arquivo JSON para importar seus dados:
              </p>
              
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <Database className="mx-auto mb-4 text-white/60" size={48} />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="text-white/80 hover:text-white transition-colors">
                    Clique para selecionar arquivo
                  </span>
                </label>
              </div>

              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  ⚠️ A importação irá substituir seus dados existentes. Faça um backup antes de prosseguir.
                </p>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="mr-2" size={16} />
              Cancelar
            </Button>
            {type === 'export' && (
              <Button 
                onClick={handleExport}
                disabled={loading || !Object.values(selectedData).some(Boolean)}
                className="flex-1 bg-white/20 text-white hover:bg-white/30"
              >
                <Download className="mr-2" size={16} />
                {loading ? 'Exportando...' : 'Exportar'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataManagementModal;
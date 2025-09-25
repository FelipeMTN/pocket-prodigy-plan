import React, { useState, useEffect } from 'react';
import { Settings, Bell, Eye, Palette, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    notifications: {
      expenses: true,
      goals: true,
      investments: false,
      aiAgent: true,
      email: true,
      push: false
    },
    display: {
      theme: 'dark',
      currency: 'BRL',
      language: 'pt-BR',
      compactView: false
    },
    privacy: {
      shareAnalytics: false,
      publicProfile: false,
      dataBackup: true
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences({ ...preferences, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      toast({
        title: "Preferências salvas",
        description: "Suas configurações foram atualizadas com sucesso!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updateDisplay = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      display: { ...prev.display, [key]: value }
    }));
  };

  const updatePrivacy = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-white/20 max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Settings className="mr-2" size={20} />
            Preferências
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Notifications Section */}
          <div>
            <h3 className="text-white font-medium flex items-center mb-4">
              <Bell className="mr-2" size={16} />
              Notificações
            </h3>
            <div className="space-y-3">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-white/80 capitalize">
                    {key === 'aiAgent' ? 'Assistente IA' : 
                     key === 'email' ? 'Email' :
                     key === 'push' ? 'Push' : key}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateNotification(key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Display Section */}
          <div>
            <h3 className="text-white font-medium flex items-center mb-4">
              <Eye className="mr-2" size={16} />
              Exibição
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-white/80">Tema</Label>
                <select
                  value={preferences.display.theme}
                  onChange={(e) => updateDisplay('theme', e.target.value)}
                  className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              
              <div>
                <Label className="text-white/80">Idioma</Label>
                <select
                  value={preferences.display.language}
                  onChange={(e) => updateDisplay('language', e.target.value)}
                  className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white/80">Visualização Compacta</Label>
                <Switch
                  checked={preferences.display.compactView}
                  onCheckedChange={(checked) => updateDisplay('compactView', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div>
            <h3 className="text-white font-medium flex items-center mb-4">
              <Palette className="mr-2" size={16} />
              Privacidade
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Compartilhar Analytics</Label>
                <Switch
                  checked={preferences.privacy.shareAnalytics}
                  onCheckedChange={(checked) => updatePrivacy('shareAnalytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Perfil Público</Label>
                <Switch
                  checked={preferences.privacy.publicProfile}
                  onCheckedChange={(checked) => updatePrivacy('publicProfile', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white/80">Backup Automático</Label>
                <Switch
                  checked={preferences.privacy.dataBackup}
                  onCheckedChange={(checked) => updatePrivacy('dataBackup', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="mr-2" size={16} />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-white/20 text-white hover:bg-white/30"
            >
              <Save className="mr-2" size={16} />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
import { useState } from "react";
import { User, Settings, Download, Upload, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const More = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    expenses: true,
    goals: true,
    investments: false,
    aiAgent: true
  });

  const handleExportData = () => {
    toast({
      title: "Exportando dados",
      description: "Seus dados serão exportados em breve",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Importar dados",
      description: "Selecione um arquivo para importar",
    });
  };

  const menuSections = [
    {
      title: "Perfil",
      items: [
        { icon: User, label: "Informações Pessoais", action: () => {} },
        { icon: Settings, label: "Preferências", action: () => {} }
      ]
    },
    {
      title: "Dados",
      items: [
        { icon: Download, label: "Exportar Dados", action: handleExportData },
        { icon: Upload, label: "Importar Dados", action: handleImportData }
      ]
    },
    {
      title: "Suporte",
      items: [
        { icon: HelpCircle, label: "Central de Ajuda", action: () => {} },
        { icon: Shield, label: "Privacidade", action: () => {} }
      ]
    }
  ];

  return (
    <div className="min-h-screen gradient-blue relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-16 pb-8 relative z-10">
        <h1 className="heading-display text-white italic mb-2">
          Configurações
        </h1>
        <p className="text-white/80 text-lg max-w-xs leading-relaxed">
          Gerencie suas preferências e dados da conta
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6 relative z-10">
        
        {/* Profile Card */}
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-semibold">Usuário</h3>
                <p className="text-white/60 text-sm">usuario@exemplo.com</p>
              </div>
            </div>
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
              Editar Perfil
            </Button>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="glass-card animate-slide-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold flex items-center">
                <Bell size={20} className="mr-2" />
                Notificações
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-white/80 capitalize">
                    {key === 'aiAgent' ? 'Assistente AI' : key}
                  </span>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <div key={section.title} className="glass-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="p-6">
              <h3 className="text-white/60 font-medium tracking-wider text-sm mb-4">
                {section.title.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} className="text-white/80" />
                      <span className="text-white">{item.label}</span>
                    </div>
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="glass-card animate-fade-in">
          <div className="p-6">
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => toast({ title: "Logout realizado", description: "Você foi desconectado" })}
            >
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
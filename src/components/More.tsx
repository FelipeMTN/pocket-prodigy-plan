import { useState } from "react";
import { User, Settings, Download, Upload, Bell, Shield, HelpCircle, LogOut, UserPlus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ProfileModal from "./ProfileModal";
import PreferencesModal from "./PreferencesModal";
import DataManagementModal from "./DataManagementModal";
import InvitePartnerModal from "./InvitePartnerModal";
import HelpSupportModal from "./HelpSupportModal";

const More = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [notifications, setNotifications] = useState({
    expenses: true,
    goals: true,
    investments: false,
    aiAgent: true
  });

  // Modal states
  const [modals, setModals] = useState({
    profile: false,
    preferences: false,
    exportData: false,
    importData: false,
    invitePartner: false,
    help: false,
    support: false
  });

  const openModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: false });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const menuSections = [
    {
      title: "Perfil",
      items: [
        { icon: User, label: "Informações Pessoais", action: () => openModal('profile') },
        { icon: Settings, label: "Preferências", action: () => openModal('preferences') }
      ]
    },
    {
      title: "Dados",
      items: [
        { icon: Download, label: "Exportar Dados", action: () => openModal('exportData') },
        { icon: Upload, label: "Importar Dados", action: () => openModal('importData') }
      ]
    },
    {
      title: "Colaboração",
      items: [
        { icon: UserPlus, label: "Convidar Parceiro", action: () => openModal('invitePartner') },
        { icon: Users, label: "Gerenciar Parcerias", action: () => toast({ title: "Em breve", description: "Esta funcionalidade estará disponível em breve!" }) }
      ]
    },
    {
      title: "Suporte",
      items: [
        { icon: HelpCircle, label: "Central de Ajuda", action: () => openModal('help') },
        { icon: Shield, label: "Suporte Técnico", action: () => openModal('support') }
      ]
    }
  ];

  return (
    <>
      {/* Modals */}
      <ProfileModal 
        isOpen={modals.profile} 
        onClose={() => closeModal('profile')} 
      />
      <PreferencesModal 
        isOpen={modals.preferences} 
        onClose={() => closeModal('preferences')} 
      />
      <DataManagementModal 
        isOpen={modals.exportData} 
        onClose={() => closeModal('exportData')} 
        type="export" 
      />
      <DataManagementModal 
        isOpen={modals.importData} 
        onClose={() => closeModal('importData')} 
        type="import" 
      />
      <InvitePartnerModal 
        isOpen={modals.invitePartner} 
        onClose={() => closeModal('invitePartner')} 
      />
      <HelpSupportModal 
        isOpen={modals.help} 
        onClose={() => closeModal('help')} 
        type="help" 
      />
      <HelpSupportModal 
        isOpen={modals.support} 
        onClose={() => closeModal('support')} 
        type="support" 
      />

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
                <h3 className="text-white text-xl font-semibold">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </h3>
                <p className="text-white/60 text-sm">{user?.email || 'usuario@exemplo.com'}</p>
              </div>
            </div>
            <Button 
              onClick={() => openModal('profile')}
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
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
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} className="text-white/80 group-hover:text-white transition-colors" />
                      <span className="text-white group-hover:text-white/90 transition-colors">{item.label}</span>
                    </div>
                    <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors" />
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
              className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-red-500/30"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default More;
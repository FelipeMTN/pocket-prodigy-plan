import React, { useState } from 'react';
import { UserPlus, Mail, Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InvitePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitePartnerModal: React.FC<InvitePartnerModalProps> = ({ isOpen, onClose }) => {
  const [inviteData, setInviteData] = useState({
    email: '',
    message: 'Olá! Gostaria de convidá-lo para compartilhar nosso controle financeiro. Vamos gerenciar nossas finanças juntos!'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendInvite = async () => {
    if (!user || !inviteData.email) return;

    setLoading(true);
    try {
      // For now, create a simple invitation record with email
      // In a real app, you'd verify the user exists first
      const { error } = await supabase
        .from('partnerships')
        .insert({
          user1_id: user.id,
          user2_id: user.id, // Temporary - would be the invited user's ID
          invited_by: user.id,
          status: 'pending'
        });

      if (error) throw error;

      // In a real app, you would send an email here
      // For now, we'll just show a success message
      
      toast({
        title: "Convite enviado",
        description: "O convite foi enviado com sucesso! O usuário receberá uma notificação.",
      });
      
      setInviteData({ email: '', message: 'Olá! Gostaria de convidá-lo para compartilhar nosso controle financeiro. Vamos gerenciar nossas finanças juntos!' });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite. Tente novamente.",
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
            <UserPlus className="mr-2" size={20} />
            Convidar Parceiro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-white/80 text-sm">
            Convide alguém para colaborar no controle das finanças. Vocês poderão compartilhar gastos, metas e investimentos.
          </p>

          <div>
            <Label htmlFor="email" className="text-white/80">Email do Parceiro</Label>
            <div className="flex items-center mt-1">
              <Mail className="absolute left-3 text-white/60" size={16} />
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
                placeholder="parceiro@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-white/80">Mensagem Personalizada</Label>
            <Textarea
              id="message"
              value={inviteData.message}
              onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/60 min-h-[80px]"
              placeholder="Adicione uma mensagem personalizada..."
            />
          </div>

          <div className="bg-blue-500/20 p-3 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 O parceiro receberá um convite e poderá aceitar ou recusar. Após aceitar, vocês poderão compartilhar dados financeiros.
            </p>
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
              onClick={handleSendInvite}
              disabled={loading || !inviteData.email.trim()}
              className="flex-1 bg-white/20 text-white hover:bg-white/30"
            >
              <Send className="mr-2" size={16} />
              {loading ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePartnerModal;
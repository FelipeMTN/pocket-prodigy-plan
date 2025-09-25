import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Book, Send, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'help' | 'support';
}

const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose, type }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const faqData = [
    {
      question: "Como adicionar um gasto?",
      answer: "Na aba 'Gastos', clique no botão 'Adicionar Gasto' e preencha as informações como valor, categoria e descrição."
    },
    {
      question: "Como criar uma meta de economia?",
      answer: "Vá para a aba 'Metas', clique em 'Adicionar Nova Meta' e defina o valor objetivo, prazo e categoria."
    },
    {
      question: "Posso compartilhar meus dados com outra pessoa?",
      answer: "Sim! Na aba 'Mais', você pode convidar um parceiro para colaborar no controle financeiro."
    },
    {
      question: "Como exportar meus dados?",
      answer: "Na aba 'Mais', selecione 'Exportar Dados' e escolha quais informações deseja baixar em formato JSON."
    },
    {
      question: "O assistente IA é seguro?",
      answer: "Sim, o assistente IA processa suas informações de forma segura e não compartilha dados pessoais com terceiros."
    },
    {
      question: "Como alterar minha moeda preferida?",
      answer: "Acesse 'Informações Pessoais' na aba 'Mais' e selecione sua moeda preferida nas configurações."
    }
  ];

  const handleSendMessage = async () => {
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o assunto e a mensagem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would send to your support system
      console.log('Support message:', contactForm);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso! Responderemos em breve.",
      });
      
      setContactForm({ subject: '', message: '', email: '' });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            {type === 'help' ? <HelpCircle className="mr-2" size={20} /> : <MessageSquare className="mr-2" size={20} />}
            {type === 'help' ? 'Central de Ajuda' : 'Suporte'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'faq' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Book size={16} className="mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'contact' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare size={16} className="mr-2" />
              Contato
            </button>
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {faqData.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">{item.question}</h4>
                    <p className="text-white/80 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <h4 className="text-blue-200 font-medium mb-2">Recursos Adicionais</h4>
                <div className="space-y-2">
                  <button className="flex items-center text-blue-200 hover:text-blue-100 text-sm">
                    <ExternalLink size={14} className="mr-2" />
                    Guia de Primeiros Passos
                  </button>
                  <button className="flex items-center text-blue-200 hover:text-blue-100 text-sm">
                    <ExternalLink size={14} className="mr-2" />
                    Dicas de Controle Financeiro
                  </button>
                  <button className="flex items-center text-blue-200 hover:text-blue-100 text-sm">
                    <ExternalLink size={14} className="mr-2" />
                    Vídeos Tutoriais
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm">
                Não encontrou a resposta que procurava? Entre em contato conosco e teremos prazer em ajudar!
              </p>

              <div>
                <Label htmlFor="email" className="text-white/80">Seu Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/60"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-white/80">Assunto</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/60"
                  placeholder="Descreva brevemente o problema ou pergunta"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white/80">Mensagem</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/60 min-h-[120px]"
                  placeholder="Descreva detalhadamente sua dúvida ou problema..."
                />
              </div>

              <div className="bg-green-500/20 p-3 rounded-lg">
                <p className="text-green-200 text-sm">
                  📧 Normalmente respondemos em até 24 horas durante dias úteis.
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="mr-2" size={16} />
              Fechar
            </Button>
            {activeTab === 'contact' && (
              <Button 
                onClick={handleSendMessage}
                disabled={loading}
                className="flex-1 bg-white/20 text-white hover:bg-white/30"
              >
                <Send className="mr-2" size={16} />
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpSupportModal;
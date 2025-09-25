import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AITab = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Olá! Sou seu assistente financeiro pessoal. Como posso ajudá-lo hoje? Posso fornecer insights sobre seus gastos, sugerir metas de economia ou responder perguntas sobre finanças pessoais.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: `Entendo sua pergunta sobre "${userMessage.content}". Com base nos seus dados financeiros, posso oferecer algumas sugestões personalizadas. Gostaria que eu analise seus gastos recentes, suas metas de poupança ou forneça dicas de investimento?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Analise meus gastos do mês",
    "Como posso economizar mais?",
    "Sugestões de investimento",
    "Revisar minhas metas"
  ];

  return (
    <div className="min-h-screen gradient-purple relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-6 relative z-10 flex-shrink-0">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="heading-display text-white italic">
              Assistente IA
            </h1>
            <p className="text-white/80 text-sm">
              Seu consultor financeiro inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start space-x-3">
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`glass-card p-4 ${
                      message.type === 'user'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs text-white/60 mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[80%]">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="glass-card p-4 bg-white/10">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <div className="glass-card p-4">
            <h3 className="text-white/80 text-sm font-medium mb-3">Sugestões rápidas:</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action)}
                  className="text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-sm transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 pb-6 relative z-10 flex-shrink-0">
        <div className="glass-card p-4">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre finanças..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITab;
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useExpenses, useGoals, useInvestments } from "@/hooks/useSupabaseData";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Eu sou o MTN, seu assistente financeiro pessoal. Posso ajudá-lo a adicionar gastos, metas de economia, investimentos e responder perguntas sobre suas finanças. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { addExpense } = useExpenses();
  const { addGoal } = useGoals();
  const { addInvestment } = useInvestments();

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Erro no reconhecimento de voz",
          description: "Tente novamente",
          variant: "destructive"
        });
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Recurso não disponível",
        description: "Seu navegador não suporta reconhecimento de voz",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for expense addition
    const expenseMatch = lowerMessage.match(/adicionar?.* (\d+(?:\.\d+)?).* (?:reais?|dollars?|\$|r\$).* (?:em|para|de|com) (.+)/);
    if (expenseMatch || lowerMessage.includes('gastos') || lowerMessage.includes('despesa')) {
      try {
        const amount = expenseMatch ? parseFloat(expenseMatch[1]) : 100; // Default amount
        const description = expenseMatch ? expenseMatch[2] : 'Despesa adicionada via assistente';
        const category = lowerMessage.includes('médic') ? 'Saúde' : 
                        lowerMessage.includes('comida') || lowerMessage.includes('restaurante') ? 'Alimentação' :
                        lowerMessage.includes('transporte') || lowerMessage.includes('gasolina') ? 'Transporte' :
                        'Outros';

        await addExpense({
          amount,
          description,
          category,
          date: new Date().toISOString().split('T')[0],
          user_id: 'temp-user-id'
        });

        return `✅ Gasto adicionado com sucesso! $${amount} em ${category} - ${description}`;
      } catch (error) {
        return `❌ Erro ao adicionar gasto. Tente novamente.`;
      }
    }

    // Check for goal addition
    if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo') || lowerMessage.includes('economizar')) {
      const goalMatch = lowerMessage.match(/economizar.* (\d+(?:\.\d+)?).* (?:reais?|dollars?|\$|r\$)/);
      if (goalMatch) {
        try {
          const amount = parseFloat(goalMatch[1]);
          await addGoal({
            title: `Meta de economia de $${amount}`,
            target_amount: amount,
            current_amount: 0,
            category: 'Poupança',
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
            user_id: 'temp-user-id'
          });

          return `✅ Meta criada com sucesso! Objetivo de economizar $${amount}`;
        } catch (error) {
          return `❌ Erro ao criar meta. Tente novamente.`;
        }
      }
    }

    return null; // No command processed
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // First try to process as a command
      const commandResult = await processCommand(userMessage.content);
      
      if (commandResult) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: commandResult,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // If not a command, send to AI
      const response = await supabase.functions.invoke('ai-assistant', {
        body: { 
          message: userMessage.content,
          context: "financial_assistant"
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response || "Desculpe, não consegui processar sua solicitação.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desculpe, ocorreu um erro. Tente novamente ou use comandos simples como 'adicionar 50 reais em gastos médicos'.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-card border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">MTN</h3>
              <p className="text-xs text-muted-foreground">Assistente Financeiro</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot size={16} className="mt-1 text-primary" />
                  )}
                  {message.role === 'user' && (
                    <User size={16} className="mt-1" />
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <Loader2 className="animate-spin" size={16} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem ou use comandos como 'adicionar 100 reais em gastos médicos'"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="text-destructive" size={16} />
                ) : (
                  <Mic size={16} />
                )}
              </Button>
            </div>
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <Send size={16} />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Exemplos: "adicionar 50 reais em gastos médicos", "criar meta de economizar 1000 reais", "como estão minhas finanças?"
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
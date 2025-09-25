import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const systemPrompt = `Você é MTN, um assistente financeiro pessoal especializado em ajudar usuários brasileiros com suas finanças. Suas principais funções incluem:

1. Ajudar com gastos e despesas
2. Criar e acompanhar metas financeiras  
3. Gerenciar investimentos
4. Fornecer insights financeiros
5. Responder perguntas sobre finanças pessoais

Diretrizes:
- Seja amigável, profissional e útil
- Use português brasileiro
- Forneça respostas práticas e acionáveis
- Se não souber algo específico, seja honesto
- Mantenha foco em finanças pessoais
- Use emojis ocasionalmente para tornar as respostas mais amigáveis

Você pode executar comandos diretos quando o usuário pedir para:
- Adicionar gastos (ex: "adicionar 100 reais em gastos médicos")
- Criar metas (ex: "criar meta de economizar 1000 reais")
- Adicionar investimentos

Sempre confirme quando uma ação foi executada com sucesso.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
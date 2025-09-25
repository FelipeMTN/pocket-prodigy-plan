// Simplified Dashboard.tsx to isolate TanStack Query v5 issue
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Target, Settings } from "lucide-react";

const Dashboard: React.FC = () => {
  // Temporarily remove useQuery calls to test if the issue is elsewhere
  return (
    <div className="p-4 space-y-6">
      {/* Net worth card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Track your net worth</CardTitle>
          <CardDescription>
            Unite your financial life to see how your assets and liabilities change
            over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <div className="text-3xl font-bold">R$ 325.472</div>
            <p className="text-muted-foreground text-sm">
              Ativos: R$ 540.000 • Passivos: R$ 214.528
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button>Conectar suas contas</Button>
        </CardFooter>
      </Card>

      {/* Cash flow card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Track your spending</CardTitle>
          <CardDescription>
            Veja suas despesas e receitas claramente com AI que ajuda a manter o
            controle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            Gráfico de fluxo de caixa aparecerá aqui
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button>Adicionar despesa</Button>
        </CardFooter>
      </Card>

      {/* Benefits section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Benefícios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Home className="h-6 w-6" />
            <div>
              <p className="font-medium">Saiba seu patrimônio líquido futuro</p>
              <p className="text-muted-foreground text-sm">
                Veja como seu dinheiro cresce com o tempo e como grandes eventos
                de vida o impactam.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6" />
            <div>
              <p className="font-medium">Planeje grandes eventos</p>
              <p className="text-muted-foreground text-sm">
                Modele mudanças como ter um filho ou mudar de trabalho e
                compare cenários facilmente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Settings className="h-6 w-6" />
            <div>
              <p className="font-medium">Orientação profissional</p>
              <p className="text-muted-foreground text-sm">
                Planeje com confiança usando previsões baseadas em especialistas
                que calculam suas chances de sucesso automaticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
// New Dashboard.tsx implementing the "Home/Início" page following the desired
// glassmorphism aesthetic.  This version focuses on summarising the user's
// net worth and cash flow at a glance.  Detailed editing of assets and
// liabilities should be moved into modals or separate pages to avoid
// cluttering the dashboard.

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Home, Target, Settings } from "lucide-react";

// Helper for formatting currency values
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);

// Fetch aggregated assets/liabilities and cash flow from Supabase.
// These queries should correspond to your tables and RLS policies.
const useNetWorth = () => {
  return useQuery(["net-worth"], async () => {
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select("value")
      .eq("user_id", supabase.auth.getUser().data?.user?.id ?? "");
    const { data: liabilities, error: liabilitiesError } = await supabase
      .from("liabilities")
      .select("balance")
      .eq("user_id", supabase.auth.getUser().data?.user?.id ?? "");
    if (assetsError || liabilitiesError) {
      throw assetsError || liabilitiesError;
    }
    const totalAssets = (assets ?? []).reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = (liabilities ?? []).reduce(
      (sum, l) => sum + l.balance,
      0
    );
    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    };
  });
};

// Example hook for cash flow; adjust based on your schema
const useCashFlow = () => {
  return useQuery(["cash-flow"], async () => {
    const { data, error } = await supabase
      .from("cash_flow_view")
      .select("month, income, expenses")
      .eq("user_id", supabase.auth.getUser().data?.user?.id ?? "");
    if (error) throw error;
    return data ?? [];
  });
};

const Dashboard: React.FC = () => {
  const {
    data: netWorthData,
    isLoading: netWorthLoading,
    error: netWorthError,
  } = useNetWorth();
  const {
    data: cashFlowData,
    isLoading: cashFlowLoading,
    error: cashFlowError,
  } = useCashFlow();

  // State for toggling between overview, assets and liabilities
  const [selectedView, setSelectedView] = useState<'overview' | 'assets' | 'liabilities'>('overview');

  // Placeholder breakdown data; replace with real calculations or queries
  const assetsBreakdown = [
    { name: "Investimentos", amount: 100000, percentage: 60 },
    { name: "Dinheiro", amount: 20000, percentage: 12 },
    { name: "Imóveis", amount: 50000, percentage: 28 },
  ];
  const liabilitiesBreakdown = [
    { name: "Cartões de Crédito", amount: 8000, percentage: 40 },
    { name: "Financiamentos", amount: 12000, percentage: 60 },
  ];

  // Render functions for each view
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Assets Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Ativos</h3>
        <div className="space-y-2">
          {assetsBreakdown.map((asset) => (
            <div key={asset.name} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{asset.name}</span>
                <span>{asset.percentage}%</span>
              </div>
              <Progress value={asset.percentage} />
            </div>
          ))}
        </div>
      </div>
      {/* Liabilities Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Passivos</h3>
        <div className="space-y-2">
          {liabilitiesBreakdown.map((liability) => (
            <div key={liability.name} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{liability.name}</span>
                <span>{liability.percentage}%</span>
              </div>
              <Progress value={liability.percentage} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      {assetsBreakdown.map((asset) => (
        <div key={asset.name} className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>{asset.name}</span>
            <span>{formatCurrency(asset.amount)}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {asset.percentage}% do total de ativos
          </p>
          <Progress value={asset.percentage} />
        </div>
      ))}
    </div>
  );

  const renderLiabilities = () => (
    <div className="space-y-4">
      {liabilitiesBreakdown.map((liability) => (
        <div key={liability.name} className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>{liability.name}</span>
            <span>{formatCurrency(liability.amount)}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {liability.percentage}% do total de passivos
          </p>
          <Progress value={liability.percentage} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 space-y-6 gradient-home-blue">
      {/* Header and AI button card */}
      <Card className="glass-card relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Seu Patrimônio</CardTitle>
          <CardDescription>
            Acompanhe seus ativos e passivos em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Net worth summary */}
          {netWorthLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : netWorthError ? (
            <p className="text-destructive">Erro ao carregar dados.</p>
          ) : netWorthData ? (
            <div className="flex flex-col items-start gap-2">
              <div className="text-3xl font-bold">
                {formatCurrency(netWorthData.netWorth)}
              </div>
              <p className="text-muted-foreground text-sm">
                Ativos: {formatCurrency(netWorthData.totalAssets)} • Passivos: {formatCurrency(netWorthData.totalLiabilities)}
              </p>
            </div>
          ) : null}
          {/* Toggle buttons */}
          <div className="flex gap-2">
            {(['overview', 'assets', 'liabilities'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  selectedView === view
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {view === 'overview'
                  ? 'Geral'
                  : view === 'assets'
                  ? 'Ativos'
                  : 'Passivos'}
              </button>
            ))}
          </div>
          {/* Conditional rendering based on selected view */}
          {selectedView === 'overview' && renderOverview()}
          {selectedView === 'assets' && renderAssets()}
          {selectedView === 'liabilities' && renderLiabilities()}
        </CardContent>
        <CardFooter className="justify-center pt-4">
          <Button
            className="button-primary"
            onClick={() => {
              /* open account linking modal */
            }}
          >
            Conectar suas contas
          </Button>
        </CardFooter>
      </Card>

      {/* Cash flow card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Acompanhe seu fluxo de caixa</CardTitle>
          <CardDescription>
            Veja suas despesas e receitas claramente com AI que ajuda a manter o controle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cashFlowLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : cashFlowError ? (
            <p className="text-destructive">Erro ao carregar dados.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cashFlowData as any[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fillOpacity={0.6} />
                <Bar dataKey="expenses" fillOpacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            className="button-primary"
            onClick={() => {
              /* open add expense dialog */
            }}
          >
            Adicionar despesa
          </Button>
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
                Veja como seu dinheiro cresce com o tempo e como grandes eventos de vida o impactam.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6" />
            <div>
              <p className="font-medium">Planeje grandes eventos</p>
              <p className="text-muted-foreground text-sm">
                Modele mudanças como ter um filho ou mudar de trabalho e compare cenários facilmente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Settings className="h-6 w-6" />
            <div>
              <p className="font-medium">Orientação profissional</p>
              <p className="text-muted-foreground text-sm">
                Planeje com confiança usando previsões baseadas em especialistas que calculam suas chances de sucesso automaticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

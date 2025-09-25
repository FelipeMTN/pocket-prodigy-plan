// New Dashboard.tsx implementing the "Home/Início" page following the desired
// glassmorphism aesthetic.  This version focuses on summarising the user's
// net worth and cash flow at a glance.  Detailed editing of assets and
// liabilities should be moved into modals or separate pages to avoid
// cluttering the dashboard.

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
import { Skeleton } from "@/components/ui/skeleton";
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
  return useQuery({
    queryKey: ["net-worth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data: assets, error: assetsError } = await supabase
        .from("manual_assets")
        .select("value")
        .eq("user_id", user.id);
        
      const { data: liabilities, error: liabilitiesError } = await supabase
        .from("manual_liabilities")
        .select("balance")
        .eq("user_id", user.id);
        
      if (assetsError || liabilitiesError) {
        throw assetsError || liabilitiesError;
      }
      
      const totalAssets = (assets ?? []).reduce((sum, a) => sum + (a.value || 0), 0);
      const totalLiabilities = (liabilities ?? []).reduce(
        (sum, l) => sum + (l.balance || 0),
        0
      );
      
      return {
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
      };
    }
  });
};

// Example hook for cash flow; adjust based on your schema
const useCashFlow = () => {
  return useQuery({
    queryKey: ["cash-flow"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      // For now return empty array since we don't have cash flow view
      // This can be replaced with actual expenses data later
      return [];
    }
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
                Ativos: {formatCurrency(netWorthData.totalAssets)} • Passivos:
                {" "}
                {formatCurrency(netWorthData.totalLiabilities)}
              </p>
            </div>
          ) : null}
          {/* Placeholder for future net worth chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="netWorth" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => {/* open account linking modal */}}>
            Conectar suas contas
          </Button>
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
          <Button onClick={() => {/* open add expense dialog */}}>
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
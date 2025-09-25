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
  return useQuery({
    queryKey: ["net-worth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
    }
  });
};

// Example hook for cash flow; using mock data since we don't have cash_flow_view
const useCashFlow = () => {
  return useQuery({
    queryKey: ["cash-flow"],
    queryFn: async () => {
      // Mock data for now - replace with real data when available
      return [
        { month: "Jan", income: 5000, expenses: 3500 },
        { month: "Fev", income: 5200, expenses: 3800 },
        { month: "Mar", income: 4800, expenses: 3200 },
        { month: "Abr", income: 5300, expenses: 3900 },
        { month: "Mai", income: 5100, expenses: 3600 },
        { month: "Jun", income: 5400, expenses: 4100 },
      ];
    }
  });
};

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "overview" | "ativos" | "passivos"
  >("overview");

  const { data: netWorthData, isLoading: netWorthLoading } = useNetWorth();
  const { data: cashFlowData, isLoading: cashFlowLoading } = useCashFlow();

  console.log("Dashboard rendered", { netWorthData, cashFlowData });

  return (
    // Apply the home-blue gradient to match the reference design
    <div className="p-4 space-y-6 gradient-home-blue min-h-screen">
      {/* Net worth summary card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Seu Patrimônio</CardTitle>
          <CardDescription>
            Veja rapidamente o valor de seus ativos, passivos e patrimônio
            líquido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {netWorthLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : netWorthData ? (
            <div className="space-y-4">
              {/* Toggle buttons for different views */}
              <div className="flex space-x-2">
                {(["overview", "ativos", "passivos"] as const).map((view) => (
                  <Button
                    key={view}
                    variant={activeView === view ? "default" : "secondary"}
                    onClick={() => setActiveView(view)}
                    className="capitalize"
                  >
                    {view === "overview" ? "Visão Geral" : view}
                  </Button>
                ))}
              </div>

              {/* Summary based on active view */}
              {activeView === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(netWorthData.netWorth)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Patrimônio Líquido
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {formatCurrency(netWorthData.totalAssets)}
                    </div>
                    <div className="text-sm text-muted-foreground">Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-400">
                      -{formatCurrency(netWorthData.totalLiabilities)}
                    </div>
                    <div className="text-sm text-muted-foreground">Passivos</div>
                  </div>
                </div>
              )}

              {activeView === "ativos" && (
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {formatCurrency(netWorthData.totalAssets)}
                  </div>
                  <div className="text-muted-foreground">Total em Ativos</div>
                </div>
              )}

              {activeView === "passivos" && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {formatCurrency(netWorthData.totalLiabilities)}
                  </div>
                  <div className="text-muted-foreground">Total em Passivos</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button className="button-primary">Conectar suas contas</Button>
        </CardFooter>
      </Card>

      {/* Cash flow chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
          <CardDescription>
            Receitas vs gastos nos últimos 6 meses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cashFlowLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : cashFlowData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF" }}
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Receitas"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                    name="Gastos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Nenhum dado de fluxo de caixa disponível
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
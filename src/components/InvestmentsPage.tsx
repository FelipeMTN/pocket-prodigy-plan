// New InvestmentsPage.tsx representing the "Investimentos" tab.  This page
// summarises the user's portfolio allocation and offers a quick view of
// current market indices.  Real data fetching should be implemented via
// appropriate hooks.
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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Placeholder portfolio allocation; replace with live data
const sampleAllocation = [
  { name: 'Ações EUA', value: 40.2 },
  { name: 'Ações Int.', value: 14.2 },
  { name: 'Cripto', value: 25.0 },
  { name: 'Caixa', value: 20.6 },
];

const COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1' ];

// Placeholder market data for mini charts; replace with real data as needed
const marketData = {
  djia: [
    { name: 'Mon', value: 41800 },
    { name: 'Tue', value: 42000 },
    { name: 'Wed', value: 41950 },
    { name: 'Thu', value: 42100 },
    { name: 'Fri', value: 42050 },
  ],
  nasdaq: [
    { name: 'Mon', value: 15200 },
    { name: 'Tue', value: 15300 },
    { name: 'Wed', value: 15250 },
    { name: 'Thu', value: 15400 },
    { name: 'Fri', value: 15380 },
  ],
  sp500: [
    { name: 'Mon', value: 4500 },
    { name: 'Tue', value: 4510 },
    { name: 'Wed', value: 4495 },
    { name: 'Thu', value: 4520 },
    { name: 'Fri', value: 4515 },
  ],
  vix: [
    { name: 'Mon', value: 18 },
    { name: 'Tue', value: 17 },
    { name: 'Wed', value: 19 },
    { name: 'Thu', value: 18.5 },
    { name: 'Fri', value: 17.8 },
  ],
};

const InvestmentsPage: React.FC = () => {
  return (
    // Use the invest-green gradient to match the reference
    <div className="p-4 space-y-6 gradient-invest-green">
      {/* Asset allocation card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Acompanhe seus investimentos</CardTitle>
          <CardDescription>
            Veja a composição da sua carteira e como ela se compara ao modelo
            recomendado.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sampleAllocation}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {sampleAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>

        {/* Markets at a glance mini charts */}
        <CardContent className="pt-0">
          <h3 className="text-lg font-semibold mb-2">Mercado em um piscar</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(marketData).map(([key, data]) => (
              <div
                key={key}
                className="p-2 rounded-lg bg-background/50 backdrop-blur"
              >
                <p className="text-sm font-medium capitalize mb-1">
                  {key === 'djia' && 'DJIA'}
                  {key === 'nasdaq' && 'NASDAQ'}
                  {key === 'sp500' && 'S&P 500'}
                  {key === 'vix' && 'VIX'}
                </p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data as any}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="currentColor"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            className="button-primary"
            onClick={() => {
              /* open connect investments modal */
            }}
          >
            Conectar corretoras
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvestmentsPage;

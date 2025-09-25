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
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Placeholder portfolio allocation; replace with live data
const sampleAllocation = [
  { name: 'Ações EUA', value: 40.2 },
  { name: 'Ações Int.', value: 14.2 },
  { name: 'Cripto', value: 25.0 },
  { name: 'Caixa', value: 20.6 },
];

const COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1' ];

const InvestmentsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
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
        <CardFooter className="justify-center">
          <Button onClick={() => {/* open connect investments modal */}}>
            Conectar corretoras
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvestmentsPage;
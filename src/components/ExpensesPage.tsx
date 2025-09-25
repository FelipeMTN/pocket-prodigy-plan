// New ExpensesPage.tsx representing the "Gastos" tab.  This page summarises the
// user's expenses and budget progress and keeps the editing forms in a modal
// rather than cluttering the main view.
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

// Placeholder data; replace with real data from hooks or API
const sampleBudgetData = [
  { category: 'Comida', percentage: 44.7 },
  { category: 'Automóvel', percentage: 8.3 },
  { category: 'Transporte', percentage: 7.0 },
  { category: 'Tudo mais', percentage: 47.9 },
];

const ExpensesPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Budget progress card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Acompanhe seu orçamento</CardTitle>
          <CardDescription>
            Veja claramente para onde seu dinheiro está indo e mantenha-se no
            controle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleBudgetData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span>{item.category}</span>
                <div className="flex-1 mx-4 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => {/* open add expense modal */}}>
            Conectar suas contas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpensesPage;

// New GoalsPage.tsx representing the "Metas" tab.  This page summarises the
// user's goals and progress towards them in a clear, decluttered way.
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

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

// Placeholder data; replace with data from Supabase
const sampleGoals: Goal[] = [
  { id: '1', name: 'Fundo de emergência', currentAmount: 2500, targetAmount: 10000 },
  { id: '2', name: 'Viagem', currentAmount: 1500, targetAmount: 5000 },
];

const GoalsPage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Acompanhe suas metas</CardTitle>
          <CardDescription>
            Estabeleça objetivos financeiros e visualize seu progresso rumo a
            alcançá-los.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleGoals.map((goal) => {
            const progress = Math.min(
              (goal.currentAmount / goal.targetAmount) * 100,
              100
            );
            return (
              <div key={goal.id} className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{goal.name}</span>
                  <span>
                    {progress.toFixed(0)}% ({goal.currentAmount} / {goal.targetAmount})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => {/* open add goal modal */}}>
            Nova meta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoalsPage;
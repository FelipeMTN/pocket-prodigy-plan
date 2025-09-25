// New AITabPage.tsx representing the "IA" tab.  This tab could host a chat
// interface or AI assistant suggestions.  Here we provide a simple placeholder.
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AITabPage: React.FC = () => {
  return (
    // Apply a dark gradient to the AI page for consistency
    <div className="p-4 space-y-6 gradient-goals-dark">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Assistente de IA</CardTitle>
          <CardDescription>
            Faça perguntas financeiras e obtenha insights personalizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Digite sua pergunta aqui..." />
          <Button>Enviar</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITabPage;

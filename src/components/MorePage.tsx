// New MorePage.tsx representing the "Mais" tab.  This page can host
// miscellaneous settings or options.  For now it provides simple navigation
// links.
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const MorePage: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Mais opções</CardTitle>
          <CardDescription>Configurações e recursos adicionais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Perfil do usuário</li>
            <li>Configurações de privacidade</li>
            <li>Suporte & feedback</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MorePage;
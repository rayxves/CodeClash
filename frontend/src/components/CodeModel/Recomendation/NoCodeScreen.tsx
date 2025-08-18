import { Stars } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

interface NoCodeScreenProps {
  language?: string;
  name?: string;
  navigate: NavigateFunction;
}

export default function NoCodeScreen({ language, name, navigate }: NoCodeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
      <div className="max-w-md p-8 bg-card rounded-2xl shadow-card text-center border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stars className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-card-foreground mb-3">
          Nenhum código para analisar
        </h2>
        <p className="text-muted-foreground mb-6">
          {language && name 
            ? "Não foi possível carregar o código modelo."
            : "Envie um código ou acesse um código modelo para receber recomendações."}
        </p>
        <button
          onClick={() => navigate(language && name ? `/code-model` : "/submission")}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift"
        >
          {language && name ? "Voltar" : "Ir para Submissão"}
        </button>
      </div>
    </div>
  );
}
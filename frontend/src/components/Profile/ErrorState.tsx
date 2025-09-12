import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-elegant border border-border/50 overflow-hidden p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar perfil</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="sm:space-x-4 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-center">
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg font-medium transition-all"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

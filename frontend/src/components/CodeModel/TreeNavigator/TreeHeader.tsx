
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TreeHeaderProps {
  language?: string;
}

export default function TreeHeader({ language }: TreeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border">
      <button
        onClick={() => navigate("/code-model")}
        className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all group mb-6"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Voltar</span>
      </button>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            Navegador de Árvore Interativo
          </h1>
          <p className="text-muted-foreground">
            Explore a estrutura de algoritmos de forma interativa
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
            {language?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
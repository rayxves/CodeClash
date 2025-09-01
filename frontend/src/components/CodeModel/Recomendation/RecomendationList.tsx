import { Code2, Stars } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { CodeReference } from "../../../types/code";
import type { NavigateFunction } from "react-router-dom";

interface RecommendationsListProps {
  recommendations: CodeReference[];
  onSelectCode: (code: CodeReference) => void;
  navigate: NavigateFunction;
  loading: boolean;
}

export default function RecommendationsList({
  recommendations,
  onSelectCode,
  navigate,
  loading,
}: RecommendationsListProps) {
  return (
    <div className="w-full overflow-x-hidden">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
        {loading || recommendations.length > 0 ? (
          <div className="flex items-center gap-3">
            <Stars className="w-6 h-6 text-primary" />
            Recomendações
          </div>
        ) : null}
      </h2>

      {loading ? (
        <div className="grid gap-6 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid gap-6 w-full">
          {recommendations.map((code) => (
            <RecommendationCard
              key={code.id}
              code={code}
              onSelect={() => onSelectCode(code)}
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
        <NoRecommendationsScreen
          onRetry={() => window.location.reload()}
          onExplore={() => navigate("/code-model")}
        />
      )}
    </div>
  );
}

function RecommendationCard({
  code,
  onSelect,
  navigate,
}: {
  code: CodeReference;
  onSelect: () => void;
  navigate: NavigateFunction;
}) {
  return (
    <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-border p-6 w-full group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
            <Code2 className="text-primary w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
              {code.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {code.description}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {code.language}
              </span>
              {code.category && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary-foreground rounded-full">
                  {code.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 lg:flex-shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift text-sm"
            onClick={onSelect}
          >
            Ver código
            <ArrowRight className="w-4 h-4" />
          </button>
          {code.category && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-all hover-lift text-sm"
              onClick={() =>
                navigate(
                  `/code-model/${encodeURIComponent(
                    code.language
                  )}/${encodeURIComponent(code.category)}`
                )
              }
            >
              Ver categoria
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 w-full animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 bg-muted rounded-xl flex-shrink-0 w-12 h-12" />
          <div className="min-w-0 flex-1">
            <div className="h-5 bg-muted rounded w-2/3 mb-3" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 lg:flex-shrink-0">
          <div className="h-9 w-28 bg-muted rounded-lg" />
          <div className="h-9 w-32 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function NoRecommendationsScreen({
  onRetry,
  onExplore,
}: {
  onRetry: () => void;
  onExplore: () => void;
}) {
  return (
    <div className="bg-card p-8 rounded-2xl shadow-card text-center border border-border">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Stars className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        Nenhuma recomendação encontrada
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Não encontramos códigos similares. Tente modificar seu código ou buscar
        em outra categoria.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift"
        >
          Tentar novamente
        </button>
        <button
          onClick={onExplore}
          className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-all hover-lift"
        >
          Explorar códigos
        </button>
      </div>
    </div>
  );
}

import { Code2, Stars } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { CodeReference } from "../../../types/code";
import type { NavigateFunction } from "react-router-dom";

interface RecommendationsListProps {
  recommendations: CodeReference[];
  onSelectCode: (code: CodeReference) => void;
  navigate: NavigateFunction;
}

export default function RecommendationsList({
  recommendations,
  onSelectCode,
  navigate,
}: RecommendationsListProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Stars className="w-6 h-6 text-yellow-500 mr-2" />
        {recommendations.length > 0
          ? "Recomendações baseadas neste código"
          : "Nenhuma recomendação encontrada"}
      </h2>

      {recommendations.length > 0 ? (
        <div className="grid gap-4">
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
    </>
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
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Code2 className="text-blue-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{code.name}</h2>
            <p className="text-gray-600 text-sm">{code.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-md">
                {code.language}
              </span>
              {code.category && (
                <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-md">
                  {code.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-center mt-3 sm:mt-0">
          <button
            className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
            onClick={onSelect}
          >
            Ver código
            <ArrowRight className="w-4 h-4" />
          </button>
          {code.category && (
            <button
              className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-lg transition-colors"
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

function NoRecommendationsScreen({
  onRetry,
  onExplore,
}: {
  onRetry: () => void;
  onExplore: () => void;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
      <Stars className="w-10 h-10 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Nenhuma recomendação encontrada
      </h3>
      <p className="text-gray-600 mb-4">
        Não encontramos códigos similares. Tente modificar seu código ou buscar
        em outra categoria.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
      >
        Tentar novamente
      </button>
      <button
        onClick={onExplore}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Explorar códigos
      </button>
    </div>
  );
}

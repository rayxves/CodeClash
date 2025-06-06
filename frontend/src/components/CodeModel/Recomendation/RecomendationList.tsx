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
    <div className="w-full overflow-x-hidden px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center w-full">
        {recommendations.length > 0 ? (
          <div className="flex items-center">
            <Stars className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
            Recomendações
          </div>
        ) : (
          ""
        )}
      </h2>

      {recommendations.length > 0 ? (
        <div className="grid gap-4 w-full">
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
    <div className="p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <Code2 className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              {code.name}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm break-words">
              {code.description}
            </p>
            <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
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
        <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
          <button
            className="flex items-center gap-1 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
            onClick={onSelect}
          >
            Ver código
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          {code.category && (
            <button
              className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg transition-colors whitespace-nowrap"
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
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm text-center">
      <Stars className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
        Nenhuma recomendação encontrada
      </h3>
      <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
        Não encontramos códigos similares. Tente modificar seu código ou buscar
        em outra categoria.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={onRetry}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Tentar novamente
        </button>
        <button
          onClick={onExplore}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          Explorar códigos
        </button>
      </div>
    </div>
  );
}
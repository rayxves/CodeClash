import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { Skeleton } from "./Skeleton";
import { useNavigate } from "react-router-dom";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
}

interface Solution {
  id: number;
  problem: Problem;
  pointsEarned: number;
  solvedAt: string;
  language: string;
  isApproved: boolean;
  messageOutput: string;
  code: string;
}

interface SolutionsCardProps {
  isLoading: boolean;
  userProblemSolutions: Solution[];
  currentSolutions: Solution[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  expandedSolutions: Set<number>;
  setExpandedSolutions: (expanded: Set<number>) => void;
  showCode: Set<number>;
  setShowCode: (show: Set<number>) => void;
}

export function SolutionsCard({
  isLoading,
  userProblemSolutions,
  currentSolutions,
  totalPages,
  currentPage,
  setCurrentPage,
  expandedSolutions,
  setExpandedSolutions,
  showCode,
  setShowCode,
}: SolutionsCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "text-green-700 bg-green-100 border-green-200";
      case "Médio":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "Difícil":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const toggleSolutionExpansion = (solutionId: number) => {
    const newExpanded = new Set(expandedSolutions);
    if (newExpanded.has(solutionId)) {
      newExpanded.delete(solutionId);
    } else {
      newExpanded.add(solutionId);
    }
    setExpandedSolutions(newExpanded);
  };

  const toggleCodeVisibility = (solutionId: number) => {
    const newShowCode = new Set(showCode);
    if (newShowCode.has(solutionId)) {
      newShowCode.delete(solutionId);
    } else {
      newShowCode.add(solutionId);
    }
    setShowCode(newShowCode);
  };

  return (
    <div className="bg-background rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Problemas Resolvidos
        </h2>
        {isLoading ? (
          <Skeleton className="h-6 w-10 rounded-full" />
        ) : (
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
            {userProblemSolutions.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-border/50 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-36" />
            </div>
          ))}
        </div>
      ) : userProblemSolutions.length === 0 ? (
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum problema resolvido ainda
          </h3>
          <p className="text-muted-foreground">
            Comece a resolver problemas para aparecerem aqui!
          </p>
          <button
            onClick={() => navigate("/problems")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explorar Problemas
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {currentSolutions.map((solution) => (
              <div
                key={solution.id}
                className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {solution.problem.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(
                        solution.problem.difficulty
                      )}`}
                    >
                      {solution.problem.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    {solution.pointsEarned > 0 && (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" />+
                        {solution.pointsEarned} pontos
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(solution.solvedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Linguagem: {solution.language}</span>
                  <span>•</span>
                  <span
                    className={
                      solution.isApproved ? "text-green-600" : "text-red-600"
                    }
                  >
                    {solution.messageOutput}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleSolutionExpansion(solution.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                  >
                    {expandedSolutions.has(solution.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Menos detalhes
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Mais detalhes
                      </>
                    )}
                  </button>
                  {expandedSolutions.has(solution.id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCodeVisibility(solution.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                      >
                        {showCode.has(solution.id) ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Ocultar código
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Ver código
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/submission?problemId=${solution.problem.id}`)
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-green-700 hover:bg-blue-200 rounded-md transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        Ver problema
                      </button>
                    </div>
                  )}
                </div>

                {expandedSolutions.has(solution.id) &&
                  showCode.has(solution.id) && (
                    <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">
                          Solução:
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {solution.language}
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-gray-200 overflow-x-auto max-h-60 overflow-y-auto">
                        {solution.code}
                      </pre>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

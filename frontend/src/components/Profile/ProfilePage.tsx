import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getRankTitle, type UserProblemSolution } from "../../types/auth";
import {
  User,
  Mail,
  Trophy,
  Star,
  LogOut,
  Code,
  CheckCircle,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, getUserProblemSolutions } from "../../../api";
import * as data from "../../types/auth";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className}`} />
);

export default function ProfilePage() {
  const [userData, setUserData] = useState<data.User | null>(null);
  const [userProblemSolutions, setUserProblemSolutions] = useState<
    UserProblemSolution[]
  >([]);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isSolutionsLoading, setIsSolutionsLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [solutionsError, setSolutionsError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSolutions, setExpandedSolutions] = useState<Set<number>>(
    new Set()
  );
  const [showCode, setShowCode] = useState<Set<number>>(new Set());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsUserLoading(true);
      setIsSolutionsLoading(true);
      setUserError(null);
      setSolutionsError(null);

      try {
        const [userRes, solutionsRes] = await Promise.allSettled([
          getUser(),
          getUserProblemSolutions(),
        ]);

        if (userRes.status === "fulfilled") {
          setUserData(userRes.value);
        } else {
          setUserError("Não foi possível carregar as informações do perfil.");
        }

        if (solutionsRes.status === "fulfilled") {
          setUserProblemSolutions(solutionsRes.value || []);
        } else {
          setSolutionsError(
            "Não foi possível carregar o histórico de problemas."
          );
        }
      } finally {
        setIsUserLoading(false);
        setIsSolutionsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  const totalPages = Math.ceil(userProblemSolutions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSolutions = userProblemSolutions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-elegant border border-border/50 overflow-hidden">
          <div className="bg-gradient-primary p-8 text-center">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            {isUserLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-primary-foreground mb-2">
                  {userData?.username || user.username}
                </h1>
                <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">
                    {getRankTitle(userData?.totalPoints || 0)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-background rounded-lg p-6 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Ranking
                </h2>
              </div>
              {isUserLoading || isSolutionsLoading ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              ) : userError ? (
                <div className="text-center text-red-500">{userError}</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Pontos totais:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {userData?.totalPoints || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Título atual:</span>
                    <span className="font-medium text-foreground">
                      {getRankTitle(userData?.totalPoints || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Problemas resolvidos:
                    </span>
                    <span className="font-medium text-foreground">
                      {
                        userProblemSolutions.filter((up) => up.isApproved)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Problemas pendentes:
                    </span>
                    <span className="font-medium text-foreground">
                      {
                        userProblemSolutions.filter((up) => !up.isApproved)
                          .length
                      }
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progresso para o próximo nível</span>
                      <span>
                        {userData?.totalPoints || user.totalPoints >= 800
                          ? "Nível máximo!"
                          : userData?.totalPoints || user.totalPoints >= 500
                          ? `${userData?.totalPoints || user.totalPoints}/800`
                          : userData?.totalPoints || user.totalPoints >= 200
                          ? `${userData?.totalPoints || user.totalPoints}/500`
                          : userData?.totalPoints || user.totalPoints >= 100
                          ? `${userData?.totalPoints || user.totalPoints}/200`
                          : `${userData?.totalPoints || user.totalPoints}/100`}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all"
                        style={{
                          width:
                            (userData?.totalPoints || user.totalPoints || 0) >=
                            800
                              ? "100%"
                              : (userData?.totalPoints ||
                                  user.totalPoints ||
                                  0) >= 500
                              ? `${
                                  (((userData?.totalPoints ||
                                    user.totalPoints ||
                                    0) -
                                    500) /
                                    300) *
                                  100
                                }%`
                              : (userData?.totalPoints ||
                                  user.totalPoints ||
                                  0) >= 200
                              ? `${
                                  (((userData?.totalPoints ||
                                    user.totalPoints ||
                                    0) -
                                    200) /
                                    300) *
                                  100
                                }%`
                              : (userData?.totalPoints ||
                                  user.totalPoints ||
                                  0) >= 100
                              ? `${
                                  (((userData?.totalPoints ||
                                    user.totalPoints ||
                                    0) -
                                    100) /
                                    100) *
                                  100
                                }%`
                              : `${
                                  ((userData?.totalPoints ||
                                    user.totalPoints ||
                                    0) /
                                    100) *
                                  100
                                }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-background rounded-lg p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Informações Pessoais
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Nome de usuário:
                    </span>
                    <p className="font-medium text-foreground">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Email:
                    </span>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Problemas Resolvidos
                </h2>
                {isSolutionsLoading ? (
                  <Skeleton className="h-6 w-10 rounded-full" />
                ) : (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                    {userProblemSolutions.length}
                  </span>
                )}
              </div>

              {isSolutionsLoading ? (
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
              ) : solutionsError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>{solutionsError}</p>
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
                              solution.isApproved
                                ? "text-green-600"
                                : "text-red-600"
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
                                onClick={() =>
                                  toggleCodeVisibility(solution.id)
                                }
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
                                  navigate(
                                    `/submission?problemId=${solution.problem.id}`
                                  )
                                }
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-green-700 hover:bg-blue-200 rounded-md transition-colors"
                              >
                                <>
                                  <Code className="w-4 h-4" />
                                  Ver problema
                                </>
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
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
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

            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Play,
  Clock,
  Lock,
  CheckCircle,
  ArrowLeft,
  Stars,
  Terminal,
} from "lucide-react";
import { getProblemById } from "../api/problemServices";
import { useAuth } from "../contexts/AuthContext";
import type { Problem } from "../types/problem";
import NotificationToast from "../components/Submission/NotificationToast";
import type { Notification } from "../components/Submission/NotificationToast";
import ProblemDetail from "../components/Submission/ProblemDetail";
import ProblemDetailSkeleton from "../components/Submission/ProblemDetailSkeleton";
import CodeEditor from "../components/Submission/CodeEditor";
import SubmissionResultDisplay from "../components/Submission/SubmissionResultDisplay";
import { submitCode } from "../api/codeReferenceServices";

export default function EnhancedSubmissionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get("problemId");
  const { isAuthenticated } = useAuth();

  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("python");
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: "error" | "success" | "info", message: string, duration = 4000) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchProblem = useCallback(async () => {
    if (!problemId) {
      setIsLoadingProblem(false);
      return;
    }
    try {
      const problemData = await getProblemById(Number(problemId));
      setProblem(problemData);
    } catch {
      addNotification(
        "error",
        "Erro ao carregar o problema. Tente novamente mais tarde."
      );
    } finally {
      setIsLoadingProblem(false);
    }
  }, [problemId, addNotification]);

  useEffect(() => {
    setIsLoadingProblem(true);
    fetchProblem();
  }, [fetchProblem]);

  const handleSubmit = async (language: string, code: string) => {
    if (!isAuthenticated) {
      addNotification(
        "error",
        "Você precisa estar logado para executar código. Faça login ou crie uma conta."
      );
      navigate("/login");
      return;
    }

    if (!code.trim() || code === "// Write your code here\n") {
      addNotification("error", "O código não pode estar vazio.");
      return;
    }

    setIsLoading(true);
    setIsSubmittingProblem(!!problemId);

    try {
      const response = await submitCode(
        language,
        code,
        problemId ? Number(problemId) : null
      );
      setOutput(response);

      const isAccepted = response.overallStatus === 0;
      const isSimpleExecutionSuccess =
        !problemId && response.simpleExecutionResult?.status?.id === 3;

      if (isAccepted || isSimpleExecutionSuccess) {
        addNotification(
          "success",
          problemId
            ? "Solução aceita com sucesso!"
            : "Código executado com sucesso!"
        );
      } else {
        addNotification(
          "info",
          problemId
            ? "Solução avaliada. Confira o resultado."
            : "Código executado. Confira a saída."
        );
      }

      if (response.pointsGained && response.pointsGained > 0) {
        setTimeout(() => {
          addNotification(
            "success",
            `Parabéns! Você ganhou ${response.pointsGained} pontos!`,
            5000
          );
        }, 1000);
      }
    } catch (error: any) {
      let errorMessage =
        "Erro ao executar o código. Tente novamente mais tarde.";

      if (error.message && error.status === 400) {
        setOutput({ error: error.message });
        return;
      } else if (error.message && error.status === 500) {
        setOutput("");
        errorMessage = "Erro no servidor ao processar sua solicitação.";
      } else if (error.request) {
        setOutput("");
        errorMessage =
          "Não foi possível conectar ao servidor. Verifique sua conexão.";
      }

      addNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
      setIsSubmittingProblem(false);
    }
  };

  const handleGetRecommendations = () => {
    if (!code.trim() || code === "// Write your code here\n") {
      addNotification(
        "error",
        "O código não pode estar vazio para obter recomendações."
      );
      return;
    }
    navigate(
      `/recommendations/${encodeURIComponent(
        language
      )}/by-code/${encodeURIComponent(code)}`
    );
  };

  const isProblemsMode = !!problemId;

  return (
    <div className="min-h-screen bg-gradient-surface pt-8 pb-8 px-4 sm:px-6">
      <div className="fixed top-20 right-4 z-50 w-80 max-w-full">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to={isProblemsMode ? "/problems" : "/"}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar {isProblemsMode ? "aos problemas" : "ao início"}
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              {isProblemsMode && problem && !isLoadingProblem
                ? `Resolvendo: ${problem.title}`
                : isProblemsMode
                ? "Carregando Problema..."
                : "Code Playground"}
            </h1>
          </div>

          {isProblemsMode &&
            (isLoadingProblem ? (
              <ProblemDetailSkeleton />
            ) : problem ? (
              <ProblemDetail problem={problem} />
            ) : (
              <div className="text-center py-8 text-red-500">
                <p>O problema não pôde ser carregado.</p>
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Ações
              </h3>

              <div className="space-y-3 md:flex md:space-y-0 gap-3">
                {isProblemsMode ? (
                  <button
                    onClick={() => handleSubmit(language, code)}
                    disabled={isSubmittingProblem || !code.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                  >
                    {!isAuthenticated ? (
                      <>
                        <Lock className="w-4 h-4" /> Login Necessário
                      </>
                    ) : isSubmittingProblem ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> Avaliando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Submeter Solução
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit(language, code)}
                    disabled={isLoading || !code.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                  >
                    {!isAuthenticated ? (
                      <>
                        <Lock className="w-4 h-4" /> Login Necessário
                      </>
                    ) : isLoading ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> Executando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Executar Código
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleGetRecommendations}
                  disabled={!code.trim() || code === "// Write your code here\n"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                >
                  <Stars className="w-4 h-4" /> Ver Códigos Similares
                </button>
              </div>
            </div>

            {output && (
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    {isProblemsMode
                      ? "Resultado da Avaliação"
                      : "Saída do Código"}
                  </span>
                </div>

                <div className="p-6">
                  <SubmissionResultDisplay
                    result={output}
                    isProblemsMode={isProblemsMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

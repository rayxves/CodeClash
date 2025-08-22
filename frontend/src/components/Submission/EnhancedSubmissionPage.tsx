import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Play,
  Terminal,
  Code2,
  Settings,
  Stars,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  X,
} from "lucide-react";
import MonacoEditor from "react-monaco-editor";

import type { Problem } from "../../types/problem";
import { getProblemById, submitCode } from "../../../api";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../contexts/AuthContext";
import SubmissionResultDisplay from "./SubmissionResultDisplay";

interface Notification {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  duration?: number;
}

const NotificationToast = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) => {
  const { type, message, id } = notification;

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [id, notification.duration, onDismiss]);

  const bgColor =
    type === "error"
      ? "bg-red-100 border-red-300 text-red-800"
      : type === "success"
      ? "bg-green-100 border-green-300 text-green-800"
      : "bg-blue-100 border-blue-300 text-blue-800";

  const icon =
    type === "error" ? (
      <XCircle className="w-5 h-5" />
    ) : type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <Clock className="w-5 h-5" />
    );

  return (
    <div
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border ${bgColor} shadow-lg animate-fadeIn`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const languages = [
  { name: "Python", id: "python", icon: <Code2 className="w-4 h-4" /> },
  { name: "C++", id: "cpp", icon: <Code2 className="w-4 h-4" /> },
  { name: "Java", id: "java", icon: <Code2 className="w-4 h-4" /> },
  { name: "C#", id: "csharp", icon: <Code2 className="w-4 h-4" /> },
];

export default function EnhancedSubmissionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get("problemId");
  const { isAuthenticated } = useAuth();

  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: "error" | "success" | "info",
    message: string,
    duration = 5000
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  useEffect(() => {
    const fetchProblem = async () => {
      if (problemId) {
        try {
          const problem = await getProblemById(Number(problemId));
          setProblem(problem);
        } catch (error) {
          addNotification(
            "error",
            "Erro ao carregar o problema. Tente novamente mais tarde."
          );
        }
      }
    };
    fetchProblem();
  }, [problemId, language]);

  const handleSubmit = async (language: string, code: string) => {
    if (!isAuthenticated) {
      addNotification(
        "error",
        "Você precisa estar logado para executar código. Faça login ou crie uma conta."
      );
      navigate("/login");
      return;
    }

    if (!code.trim()) {
      addNotification("error", "O código não pode estar vazio.");
      return;
    }

    setIsLoading(true);
    setIsSubmittingProblem(!!problemId);
    try {
      const response = await submitCode(
        language,
        code,
        problemId ? Number(problemId) : undefined
      );

      setOutput(response);

      if (problemId) {
        addNotification("success", "Solução submetida com sucesso!");
      } else {
        addNotification("success", "Código executado com sucesso!");
      }

      if (response.pointsGained && response.pointsGained > 0) {
        setTimeout(() => {
          addNotification(
            "success",
            `Parabéns! Você ganhou ${response.pointsGained} pontos!`,
            7000
          );
        }, 1000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);

      let errorMessage =
        "Erro ao executar o código. Tente novamente mais tarde.";

      if (error.message) {
        setOutput({
          error: error.message,
        });
      } else if (error.response?.data) {
        setOutput(error.response.data);
        errorMessage = "Erro no servidor ao processar sua solicitação.";
      } else if (error.request) {
        errorMessage =
          "Não foi possível conectar ao servidor. Verifique sua conexão.";
      } else {
        setOutput("");
      }

      addNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
      setIsSubmittingProblem(false);
    }
  };

  const handleGetRecommendations = () => {
    if (!code.trim()) {
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
    <div className="min-h-screen bg-gradient-surface pt-20 pb-8 px-4 sm:px-6">
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
            <Code2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              {isProblemsMode && problem
                ? `Resolvendo: ${problem.title}`
                : "Code Playground"}
            </h1>
          </div>

          {isProblemsMode && problem && (
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    problem.difficulty === "Fácil"
                      ? "text-green-600 font-semibold bg-green-50 border-green-200"
                      : problem.difficulty === "Médio"
                      ? "text-amber-600 font-semibold bg-amber-50 border-amber-200"
                      : "text-red-600 font-semibold bg-red-50 border-red-200"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                  {problem.category}
                </span>
              </div>
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => (
                    <h2
                      className="text-lg font-bold text-muted-foreground mt-4 mb-1"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      className="text-muted-foreground leading-relaxed"
                      {...props}
                    />
                  ),
                }}
              >
                {problem.description || ""}
              </ReactMarkdown>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-card-foreground mb-2">
                  Exemplos:
                </h4>
                <div className="space-y-2">
                  {problem.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((testCase, index) => (
                      <div
                        key={index}
                        className="bg-muted rounded-lg p-3 text-sm"
                      >
                        <div className="flex gap-4">
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Entrada:
                            </span>
                            <span className="ml-2 font-mono">
                              {testCase.input}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Saída:
                            </span>
                            <span className="ml-2 font-mono">
                              {testCase.expectedOutput}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1  gap-6">
          <div className="">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-mono text-card-foreground">
                    editor.
                    {languages
                      .find((l) => l.id === language)
                      ?.name.toLowerCase() || "py"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 bg-card border border-border rounded-lg text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>

                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-card text-sm rounded px-2 py-1 border border-border text-card-foreground focus:outline-none"
                  >
                    {[12, 14, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-card">
                <MonacoEditor
                  height="500px"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 15, bottom: 15 },
                    renderWhitespace: "selection",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Ações
              </h3>

              <div className="space-y-3">
                {isProblemsMode ? (
                  <button
                    onClick={() => handleSubmit(language, code)}
                    disabled={isSubmittingProblem || !code.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                  >
                    {!isAuthenticated ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Login Necessário
                      </>
                    ) : isSubmittingProblem ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Avaliando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Submeter Solução
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
                        <Lock className="w-4 h-4" />
                        Login Necessário
                      </>
                    ) : isLoading ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Executar Código
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleGetRecommendations}
                  disabled={!code.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground text-secondary-foreground rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                >
                  <Stars className="w-4 h-4" />
                  Ver Códigos Similares
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

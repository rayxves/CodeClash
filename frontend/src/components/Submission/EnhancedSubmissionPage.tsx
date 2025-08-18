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
} from "lucide-react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";
import ExecutionOutput from "./ExecutionOutput";
import type {
  Problem,
  SubmissionResult,
  TestResult,
} from "../../types/problem";
import { getProblemById } from "../../../api";
import ReactMarkdown from "react-markdown";

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message?: string;
  status?: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: string;
}

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

  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<Judge0Response | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (problemId) {
        try {
          const problem = await getProblemById(Number(problemId));
          setProblem(problem);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProblem();
  }, [problemId, language]);

  const handleSimpleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<Judge0Response>(
        "http://localhost:5070/api/code/submit",
        {
          language: language,
          code: code,
          input: null,
        }
      );

      setOutput(response.data);
    } catch (error: any) {
      console.error("Submission error:", error);

      if (error.response?.data?.error) {
        setOutput({
          stderr: null,
          stdout: null,
          compile_output: null,
          message: error.response.data.error,
          status: {
            id: 13,
            description: "Error",
          },
        });
      } else {
        setOutput(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemSubmit = async () => {
    if (!problem || !code.trim()) return;

    setIsSubmittingProblem(true);
    setSubmissionResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results: TestResult[] = problem.testCases.map((testCase) => {
      const mockPassed = Math.random() > 0.3;
      return {
        testCase,
        userOutput: mockPassed ? testCase.expectedOutput : "Wrong output",
        passed: mockPassed,
        error: mockPassed ? undefined : "Output não corresponde ao esperado",
      };
    });

    const passed = results.filter((r) => r.passed).length;
    const result: SubmissionResult = {
      passed,
      total: results.length,
      results,
      allPassed: passed === results.length,
    };

    setSubmissionResult(result);
    setIsSubmittingProblem(false);
  };

  const handleGetRecommendations = () => {
    navigate(`/recommendations?code=${encodeURIComponent(code)}`);
  };

  const isProblemsMode = !!problem;

  return (
    <div className="min-h-screen bg-gradient-surface pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              {isProblemsMode
                ? `Resolvendo: ${problem?.title}`
                : "Code Playground"}
            </h1>
          </div>

          {isProblemsMode && (
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    problem?.difficulty === "Fácil"
                      ? "text-green-600 font-semibold bg-green-50 border-green-200"
                      : problem?.difficulty === "Médio"
                      ? "text-amber-600 font-semibold bg-amber-50 border-amber-200"
                      : "text-red-600 font-semibold bg-red-50 border-red-200"
                  }`}
                >
                  {problem?.difficulty}
                </span>
                <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                  {problem?.category}
                </span>
              </div>
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => (
                    <h2
                      className="text-lg font-bold text-gray-300 mt-4 mb-1"
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
                {problem?.description || ""}
              </ReactMarkdown>

              {/* Test Cases Preview */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-card-foreground mb-2">
                  Exemplos:
                </h4>
                <div className="space-y-2">
                  {problem?.testCases
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              {/* Editor Header */}
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

              {/* Monaco Editor */}
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

          {/* Actions and Output */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Ações
              </h3>

              <div className="space-y-3">
                {isProblemsMode ? (
                  <button
                    onClick={handleProblemSubmit}
                    disabled={isSubmittingProblem || !code.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                  >
                    {isSubmittingProblem ? (
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
                    onClick={handleSimpleSubmit}
                    disabled={isLoading || !code.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg font-medium transition-all hover-lift disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
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

            {/* Results */}
            {(output || submissionResult) && (
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
                  {isProblemsMode && submissionResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        {submissionResult.allPassed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span
                          className={`font-semibold ${
                            submissionResult.allPassed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {submissionResult.allPassed
                            ? "Todos os testes passaram!"
                            : `${submissionResult.passed}/${submissionResult.total} testes passaram`}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {submissionResult.results.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              result.passed
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {result.passed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm font-medium">
                                Teste {index + 1}{" "}
                                {result.testCase.isHidden ? "(Oculto)" : ""}
                              </span>
                            </div>
                            {!result.testCase.isHidden && (
                              <div className="text-xs space-y-1 text-muted-foreground">
                                <div>
                                  <strong>Entrada:</strong>{" "}
                                  {result.testCase.input}
                                </div>
                                <div>
                                  <strong>Esperado:</strong>{" "}
                                  {result.testCase.expectedOutput}
                                </div>
                                <div>
                                  <strong>Obtido:</strong> {result.userOutput}
                                </div>
                              </div>
                            )}
                            {result.error && (
                              <div className="text-xs text-red-600 mt-1">
                                {result.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ExecutionOutput result={output} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

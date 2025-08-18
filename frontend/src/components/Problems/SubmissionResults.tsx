import type { SubmissionResult } from "../../types/problem";
import { CheckCircle, XCircle, AlertTriangle, Trophy } from "lucide-react";

interface SubmissionResultsProps {
  result: SubmissionResult;
}

export default function SubmissionResults({ result }: SubmissionResultsProps) {
  const { passed, total, results, allPassed } = result;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        {allPassed ? (
          <Trophy className="w-6 h-6 text-green-600" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        )}
        <h2 className="text-xl font-bold text-card-foreground">
          Resultado da Submissão
        </h2>
      </div>

      <div className="mb-6">
        <div
          className={`p-4 rounded-xl border-2 ${
            allPassed
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {allPassed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {allPassed
                ? "🎉 Todos os testes passaram!"
                : `${passed}/${total} testes passaram`}
            </span>
          </div>
          <p className="text-sm">
            {allPassed
              ? "Parabéns! Sua solução está correta."
              : "Sua solução precisa de ajustes. Revise os casos que falharam."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Detalhes dos Testes
        </h3>
        
        {results.map((testResult, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 ${
              testResult.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {testResult.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      testResult.passed ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Teste {index + 1}
                    {testResult.testCase.isHidden && " (Oculto)"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      testResult.passed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {testResult.passed ? "PASSOU" : "FALHOU"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Entrada:</span>
                    <code className="block mt-1 p-2 bg-white rounded border text-gray-800">
                      {testResult.testCase.input}
                    </code>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Esperado:</span>
                    <code className="block mt-1 p-2 bg-white rounded border text-gray-800">
                      {testResult.testCase.expectedOutput}
                    </code>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Seu resultado:</span>
                    <code
                      className={`block mt-1 p-2 rounded border ${
                        testResult.passed
                          ? "bg-white text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {testResult.userOutput}
                    </code>
                  </div>
                </div>

                {testResult.error && (
                  <div className="mt-2">
                    <span className="font-medium text-red-700 text-sm">Erro:</span>
                    <p className="text-red-700 text-sm mt-1">{testResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
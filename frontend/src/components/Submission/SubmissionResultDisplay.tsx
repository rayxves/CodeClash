import { CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import {  useState } from "react";
import type { SubmissionResultDisplayProps } from "../../types/submission";
import TestCaseDetail from "./TestCaseDetail";

export default function SubmissionResultDisplay({
  result,
  isProblemsMode,
}: SubmissionResultDisplayProps) {
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

  const toggleTestExpansion = (index: number) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTests(newExpanded);
  };

  if (!result) {
    return (
      <div className="text-muted-foreground text-sm p-4">
        Os resultados aparecerão aqui após a execução...
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-red-500 font-medium">
          <AlertCircle className="w-5 h-5" />
          Erro de Execução
        </div>
        <div className="bg-gray-800 p-3 rounded">
          <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">
            {result.error}
          </pre>
        </div>
      </div>
    );
  }

  if (isProblemsMode && result.testResults && result.testResults.length > 0) {
    const passedTests = result.testResults.filter((test) => test.passed).length;
    const totalTests = result.testResults.length;
    const allPassed = result.overallStatus === "Accepted";
  return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}
            <div>
              <h3 className="font-semibold text-gray-100">
                {allPassed ? "Todos os testes passaram!" : "Alguns testes falharam"}
              </h3>
              <p className="text-sm text-gray-400">
                {passedTests} de {totalTests} testes passaram
              </p>
            </div>
          </div>
          
          {result.pointsGained !== null && result.pointsGained > 0 && (
            <div className="flex w-fit items-center gap-2 bg-amber-900/30 text-amber-300 px-3 py-2 rounded-full text-sm font-medium border border-amber-700/30">
              <Star className="w-4 h-4 fill-amber-500" />
              +{result.pointsGained} pontos
            </div>
          )}
        </div>

        <div className="space-y-3">
          {result.testResults.map((testResult, index) => (
            <TestCaseDetail
              key={testResult.testCaseId}
              test={testResult}
              index={index}
              isExpanded={expandedTests.has(index)}
              onToggle={() => toggleTestExpansion(index)}
            />
          ))}
        </div>

        {result.compilationError && (
          <div className="mt-4 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-300 font-medium mb-2">
              <AlertCircle className="w-5 h-5" />
              Erro de Compilação
            </div>
            <pre className="whitespace-pre-wrap text-sm text-amber-300 bg-amber-900/20 p-3 rounded">
              {result.compilationError}
            </pre>
          </div>
        )}

        {result.testResults.length > 1 && (
          <div className="text-center text-sm text-gray-400">
            Clique em cada teste para ver detalhes
          </div>
        )}
      </div>
    );
  }

  if (result.simpleExecutionResult) {
    const execution = result.simpleExecutionResult;
    const isSuccess = execution.status.id === 3;
    const isCompilationError = execution.status.id === 6;
    const isRuntimeError = execution.status.id >= 7 && execution.status.id <= 12;

    return (
      <div className="space-y-4">
        <div className={`p-3 rounded-lg border ${
          isSuccess ? "bg-emerald-900/20 border-emerald-500/30" : 
          isCompilationError || isRuntimeError ? "bg-rose-900/20 border-rose-500/30" : 
          "bg-amber-900/20 border-amber-500/30"
        }`}>
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : isCompilationError || isRuntimeError ? (
              <XCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <span className="font-medium text-gray-100">
              Status: {execution.status.description}
            </span>
            {execution.time && (
              <span className="ml-auto text-sm text-gray-400">
                Tempo: {execution.time}s
              </span>
            )}
          </div>
        </div>

        {execution.stdout && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Output:</h4>
            <pre className="bg-gray-800 p-3 rounded text-sm font-mono text-emerald-300 whitespace-pre-wrap border border-gray-700">
              {execution.stdout}
            </pre>
          </div>
        )}

        {execution.stderr && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Erros:</h4>
            <pre className="bg-gray-800 p-3 rounded text-sm font-mono text-rose-300 whitespace-pre-wrap border border-gray-700">
              {execution.stderr}
            </pre>
          </div>
        )}

        {execution.compileOutput && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Compilação:</h4>
            <pre className="bg-gray-800 p-3 rounded text-sm font-mono text-amber-300 whitespace-pre-wrap border border-gray-700">
              {execution.compileOutput}
            </pre>
          </div>
        )}

        {execution.message && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Mensagem:</h4>
            <pre className="bg-gray-800 p-3 rounded text-sm font-mono text-gray-300 whitespace-pre-wrap border border-gray-700">
              {execution.message}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-gray-400 text-sm p-4 text-center">
      Nenhum resultado disponível
    </div>
  );
}
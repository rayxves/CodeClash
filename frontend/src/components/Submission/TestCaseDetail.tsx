import { CheckCircle, XCircle, ChevronUp, ChevronDown } from "lucide-react";
import type { TestResult } from "../../types/submission";

export default function TestCaseDetail({
  test,
  index,
  isExpanded,
  onToggle,
}: {
  test: TestResult;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        test.passed
          ? "bg-emerald-900/20 border-emerald-500/30"
          : "bg-rose-900/20 border-rose-500/30"
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {test.passed ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <div className="flex flex-col sm:flex-row">
            <span className="font-medium text-secondary-foreground">
              Teste {index + 1}
            </span>
            <span className="sm:ml-2 text-xs text-center px-2 py-1 rounded-full bg-muted text-card-foreground">
              {test.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-secondary-foreground">
            {test.time}s
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-secondary-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-secondary-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-3">
          {test.input && (
            <div>
              <span className="text-xs font-medium text-card-foreground">
                Entrada:
              </span>
              <pre className="mt-1 p-2 bg-gray-800 rounded text-sm font-mono text-gray-200 overflow-x-auto">
                {test.input}
              </pre>
            </div>
          )}

          <div>
            <span className="text-xs font-medium text-card-foreground">
              Saída esperada:
            </span>
            <pre className="mt-1 p-2 bg-emerald-900/30 rounded text-sm font-mono text-secondary-foreground overflow-x-auto">
              {test.expectedOutput}
            </pre>
          </div>

          <div>
            <span className="text-xs font-medium text-card-foreground">
              Sua saída:
            </span>
            <pre
              className={`mt-1 p-2 rounded text-sm font-mono overflow-x-auto ${
                test.passed
                  ? "bg-emerald-900/30 text-secondary-foreground"
                  : "bg-rose-900/30 text-secondary-foreground"
              }`}
            >
              {test.output || "(nenhuma saída)"}
            </pre>
          </div>

          {test.compileOutput && (
            <div>
              <span className="text-xs font-medium text-card-foreground">
                Saída da compilação:
              </span>
              <pre className="mt-1 p-2 bg-rose-900/30 rounded text-sm font-mono text-rose-300 overflow-x-auto">
                {test.compileOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

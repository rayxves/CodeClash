import ReactMarkdown from "react-markdown";
import type { Problem } from "../../types/problem";

interface Props {
  problem: Problem;
}

export default function ProblemDetail({ problem }: Props) {
  return (
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
            <h2 className="text-lg font-bold text-muted-foreground mt-4 mb-1" {...props} />
          ),
          p: ({ ...props }) => <p className="text-muted-foreground leading-relaxed" {...props} />,
        }}
      >
        {problem.description || ""}
      </ReactMarkdown>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-card-foreground mb-2">Exemplos:</h4>
        <div className="space-y-2">
          {problem.testCases
            .filter((tc) => !tc.isHidden)
            .map((tc, idx) => (
              <div key={idx} className="bg-muted rounded-lg p-3 text-sm">
                <div className="flex gap-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Entrada:</span>
                    <span className="ml-2 font-mono">{tc.input}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Saída:</span>
                    <span className="ml-2 font-mono">{tc.expectedOutput}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

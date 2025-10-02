import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Problem } from "../../types/problem";

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  const navigate = useNavigate();

  const handleSolveProblem = () => {
    navigate(`/submission?problemId=${problem.id}`);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              #{problem.id}
            </span>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border font-medium ${
              problem.difficulty === "Fácil"
                ? "text-green-600 bg-green-50 border-green-200"
                : problem.difficulty === "Médio"
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : "text-red-600 bg-red-50 border-red-200"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {problem.title}
        </h3>
        <div
          className="prose prose-sm max-w-none text-muted-foreground overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            maxHeight: "4.5rem",
          }}
        >
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2 className="text-lg font-bold text-gray-300 mt-20 mb-1" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-muted-foreground leading-relaxed m-0" style={{ display: "inline" }} {...props} />
              ),
            }}
          >
            {problem?.description || ""}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
          {problem.category}
        </span>
        <button
          onClick={handleSolveProblem}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift text-sm"
        >
          Resolver
        </button>
      </div>
    </div>
  );
}

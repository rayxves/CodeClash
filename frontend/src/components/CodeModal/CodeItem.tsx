import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
import type { CodeReference } from "../../types/code";

interface CodeItemProps {
  code: CodeReference;
  language: string;
}
export default function CodeItem({ code, language }: CodeItemProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(
          `/code-modal/${encodeURIComponent(code.id)}/${encodeURIComponent(
            code.name
          )}`
        )
      }
      className="flex items-start sm:items-center gap-3 sm:gap-4 py-3 px-3 sm:py-4 sm:px-4 bg-muted hover:bg-accent/30 ring-1 ring-offset-primary/500 rounded-lg cursor-pointer transition-colors duration-200 group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" &&
        navigate(
          `/code-modal/${encodeURIComponent(code.id)}/${encodeURIComponent(
            code.name
          )}`
        )
      }
    >
      <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
        <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-card-foreground text-sm sm:text-base break-words">
          {code.name}
        </h3>
        {code.description && (
          <p className="text-xs sm:text-sm text-foreground mt-1 line-clamp-2">
            {code.description}
          </p>
        )}
        <div className="flex gap-2 mt-2 sm:mt-3">
          <span className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-200 text-blue-800 rounded-full whitespace-nowrap">
            {language}
          </span>
        </div>
      </div>
    </div>
  );
}

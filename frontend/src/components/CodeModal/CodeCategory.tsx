import { useState, useEffect } from "react";
import { Folder, ChevronRight } from "lucide-react";
import type { CodeReference } from "../../types/code";
import CodeItem from "./CodeItem";

interface CodeCategoryProps {
  categoryItem: CodeReference;
  language: string;
  defaultOpen?: boolean;
}
export default function CodeCategory({
  categoryItem,
  language,
  defaultOpen = false,
}: CodeCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-6 bg-card hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <span className="font-semibold text-card-foreground block text-sm sm:text-base break-words">
              {categoryItem.name}
            </span>
            {categoryItem.description && (
              <span className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {categoryItem.description}
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && categoryItem.children && (
        <div className="bg-muted/30 p-3 sm:p-6 space-y-3 sm:space-y-4 border-t border-border">
          {categoryItem.children.map((child) =>
            child.children && child.children.length > 0 ? (
              <CodeCategory
                key={child.id}
                categoryItem={child}
                language={language}
                defaultOpen={defaultOpen}
              />
            ) : (
              <CodeItem key={child.id} code={child} language={language} />
            )
          )}
        </div>
      )}
    </div>
  );
}

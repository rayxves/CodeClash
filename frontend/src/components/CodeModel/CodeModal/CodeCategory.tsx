import { useState } from "react";
import { Folder, ChevronRight } from "lucide-react";
import type { CodeReference } from "../../../types/code";
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

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-card hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <Folder className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-left">
            <span className="font-semibold text-card-foreground block">
              {categoryItem.name}
            </span>
            {categoryItem.description && (
              <span className="text-sm text-muted-foreground">
                {categoryItem.description}
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && categoryItem.children && (
        <div className="bg-muted/30 p-6 space-y-4 border-t border-border">
          {categoryItem.children.map((child) =>
            child.children && child.children.length > 0 ? (
              <CodeCategory
                key={child.id}
                categoryItem={child}
                language={language}
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

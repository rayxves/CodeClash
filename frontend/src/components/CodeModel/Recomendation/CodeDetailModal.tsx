import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ChevronLeft } from "lucide-react";
import type { CodeReference } from "../../../types/code";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { getLanguageExtension } from "../../../utils/getLanguageExtensions";

interface CodeDetailModalProps {
  code: CodeReference;
  onBackToCategory: () => void;
}

export default function CodeDetailModal({
  code,
  onBackToCategory,
}: CodeDetailModalProps) {
  return (
    <div className="w-full bg-card rounded-2xl shadow-card overflow-hidden border border-border mb-8">
      <div className="bg-muted/50 px-6 py-3 flex justify-between items-center border-b border-border">
        <div className="flex items-center overflow-hidden">
          <div className="flex space-x-1.5 mr-3 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h2 className="text-card-foreground font-mono text-sm truncate">
            {code.name}.{getLanguageExtension(code.language.toLowerCase())}
          </h2>
        </div>
        <span className="text-muted-foreground text-xs font-mono bg-muted px-3 py-1 rounded-full">
          {code.language}
        </span>
      </div>

      <div className="bg-muted/20 overflow-auto max-h-[60vh] text-sm">
        <SyntaxHighlighter
          language={getLanguageExtension(code.language.toLowerCase())}
          style={nightOwl}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            lineHeight: "1.6",
            overflowX: "auto",
            wordBreak: "break-word",
          }}
          lineNumberStyle={{
            minWidth: "2em",
            paddingRight: "1em",
            marginRight: "0.5em",
            textAlign: "right",
            fontFamily: "var(--font-mono)",
          }}
        >
          {code.code}
        </SyntaxHighlighter>
      </div>

      <div className="bg-card p-6 border-t border-border">
        <h3 className="font-semibold text-card-foreground mb-3">Descrição</h3>
        <p className="text-muted-foreground mb-4">{code.description}</p>
        <button
          onClick={onBackToCategory}
          className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Ver todos os códigos desta categoria
        </button>
      </div>
    </div>
  );
}

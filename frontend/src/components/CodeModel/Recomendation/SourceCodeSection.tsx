import { Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getLanguageExtension } from "../../../utils/getLanguageExtensions";

interface SourceCodeSectionProps {
  sourceCode: string;
  sourceType: "user" | "model" | null;
  language?: string;
}

export default function SourceCodeSection({
  sourceCode,
  sourceType,
  language,
}: SourceCodeSectionProps) {
  return (
    <div className="mb-8 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
        {sourceType === "model" ? (
          <>
            <Code2 className="w-6 h-6 text-primary mr-3" />
            Código modelo analisado
          </>
        ) : (
          <>
            <Code2 className="w-6 h-6 text-primary mr-3" />
            Seu código analisado
          </>
        )}
      </h2>
      <div className="bg-muted/20 overflow-auto max-h-[50vh] sm:max-h-[65vh] rounded-xl border border-border text-xs sm:text-sm text-muted">
        <SyntaxHighlighter
          language={getLanguageExtension(language ?? "py")}
          style={nightOwl}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: "1rem",
            lineHeight: "1.6",
            overflowX: "auto",
            wordBreak: "break-word",
            borderRadius: "0.75rem",
          }}
          lineNumberStyle={{
            minWidth: "2em",
            paddingRight: "1em",
            marginRight: "0.5em",
            textAlign: "right",
            fontFamily: "var(--font-mono)",
          }}
        >
          {sourceCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

import { Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    <div className="mb-8 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        {sourceType === "model" ? (
          <>
            <Code2 className="w-5 h-5 text-blue-600 mr-2" />
            Código modelo analisado
          </>
        ) : (
          <>
            <Code2 className="w-5 h-5 text-blue-600 mr-2" />
            Seu código analisado
          </>
        )}
      </h2>
      <div className="bg-[#1e1e2f] overflow-auto max-h-[50vh] sm:max-h-[65vh] rounded-lg  text-xs sm:text-sm">
        <SyntaxHighlighter
          language={language?.toLowerCase()}
          style={nightOwl}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: "0.5rem",
            background: "#1e1e2f",
            lineHeight: "1.4",
            overflowX: "auto",
            wordBreak: "break-word",
          }}
          lineNumberStyle={{
            minWidth: "1.75em",
            paddingRight: "0.75em",
            marginRight: "0.25em",
            color: "#6e7681",
            textAlign: "right",
          }}
        >
          {sourceCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

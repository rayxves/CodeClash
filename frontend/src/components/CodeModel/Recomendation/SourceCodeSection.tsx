import { Code2, Stars } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        {sourceType === "model" ? (
          <>
            <Code2 className="w-5 h-5 text-blue-600 mr-2" />
            Código modelo analisado
          </>
        ) : (
          <>
            <Stars className="w-5 h-5 text-yellow-500 mr-2" />
            Seu código analisado
          </>
        )}
      </h2>
      <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh] sm:max-h-[65vh]">
        <SyntaxHighlighter
          language={language?.toLowerCase()}
          style={vscDarkPlus}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "#1e1e2f",
            fontSize: "0.85rem",
            lineHeight: "1.5",
            overflowX: "hidden",
            wordBreak: "break-word",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
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

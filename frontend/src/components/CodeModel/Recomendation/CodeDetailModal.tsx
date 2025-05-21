import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ChevronLeft } from "lucide-react";
import type { CodeReference } from "../../../types/code";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeDetailModalProps {
  code: CodeReference;
  onBackToCategory: () => void;
}

export default function CodeDetailModal({
  code,
  onBackToCategory,
}: CodeDetailModalProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8 mt-16">
      <div className="bg-gray-800 px-4 sm:px-5 py-2 flex justify-between items-center">
        <div className="flex items-center overflow-hidden">
          <div className="flex space-x-1.5 mr-2 sm:mr-3 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <h2 className="text-white font-mono text-xs sm:text-sm truncate">
            {code.name}.{getExtension(code.language.toLowerCase())}
          </h2>
        </div>
        <span className="text-gray-400 text-xs font-mono bg-gray-700 px-2 py-0.5 rounded-md">
          {code.language}
        </span>
      </div>

      <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh] sm:max-h-[65vh]">
        <SyntaxHighlighter
          language={code.language.toLowerCase()}
          style={nightOwl}
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
          {code.code}
        </SyntaxHighlighter>
      </div>

      <div className="bg-white p-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
        <p className="text-gray-600">{code.description}</p>
        <div className="mt-3">
          <button
            onClick={onBackToCategory}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Ver todos os códigos desta categoria
          </button>
        </div>
      </div>
    </div>
  );
}

function getExtension(language: string): string {
  switch (language.toLowerCase()) {
    case "python":
      return "py";
    case "java":
      return "java";
    case "c#":
    case "csharp":
      return "cs";
    case "cpp":
    case "c++":
      return "cpp";
    default:
      return "txt";
  }
}

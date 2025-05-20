import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import type { CodeReference } from "../../../types/code";
import CodeHeader from "./CodeHeader";
import CodeFooter from "./CodeFooter";
import {
  getByLanguageAndCategory,
  getByLanguageAndName,
} from "../../../../api";
import type { CodeModalParams } from "../../../types/routes";

export default function CodeModal() {
  const {
    language = "",
    category = "",
    name = "",
  } = useParams<CodeModalParams>();

  const [code, setCode] = useState<CodeReference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const decodedLanguage = decodeURIComponent(language);
        const decodedCategory = decodeURIComponent(category);
        const decodedCodeName = decodeURIComponent(name);

        if (decodedCodeName) {
          const response = await getByLanguageAndName(
            decodedLanguage,
            decodedCodeName
          );

          const filteredCodes = response;

          if (filteredCodes.length > 0) {
            setCode(filteredCodes[0]);
          } else {
            throw new Error("Código não encontrado para esta linguagem");
          }
        } else {
          const response = await getByLanguageAndCategory(
            decodedLanguage,
            decodedCategory
          );
          const firstValidCode = findFirstValidCode(response);
          if (firstValidCode) {
            setCode(firstValidCode);
          }
        }
      } catch (error) {
        console.error("Error fetching code:", error);
        setCode(null);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchCode();
  }, [language, category, name]);

  const findFirstValidCode = (data: CodeReference[]): CodeReference | null => {
    for (const item of data) {
      if (item.code) {
        return item;
      }

      if (item.children) {
        const validChild = item.children.find((child) => child.code);
        if (validChild) {
          return validChild;
        }
      }
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (!code) return <div>Nenhum código encontrado</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-2 sm:px-4 sm:py-10">
      <div className="w-full max-w-6xl mt-12">
        <CodeHeader language={language} category={category} name={name} />

        <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
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
              {code.code}
            </SyntaxHighlighter>
          </div>

          <CodeFooter description={code.description} />
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

import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import type { CodeReference } from "../../../types/code";
import CodeHeader from "./CodeHeader";
import CodeFooter from "./CodeFooter";
import {
  getByLanguageAndCategory,
  getByLanguageAndName,
  searchByName,
} from "../../../../api";
import type { CodeModalParams } from "../../../types/routes";
import RecommendationsList from "../Recomendation/RecomendationList";
import { Code2 } from "lucide-react";

export default function CodeModal() {
  const {
    language = "",
    category = "",
    name = "",
  } = useParams<CodeModalParams>();
  const navigate = useNavigate();

  const [code, setCode] = useState<CodeReference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nameSearchResults, setNameSearchResults] = useState<CodeReference[]>(
    []
  );

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setError(null);
        setNameSearchResults([]);

        const decodedLanguage = decodeURIComponent(language);
        const decodedCategory = decodeURIComponent(category);
        const decodedCodeName = decodeURIComponent(name);

        if (decodedCodeName) {
          const languageSpecificResults = await getByLanguageAndName(
            decodedLanguage,
            decodedCodeName
          );

          if (languageSpecificResults.length > 0) {
            setCode(languageSpecificResults[0]);
          } else {
            const nameSearchResults = await searchByName(decodedCodeName);
            setNameSearchResults(
              nameSearchResults.filter(
                (code) => code.language.toLowerCase() === decodedLanguage
              )
            );

            throw new Error(
              `Algoritmo "${decodedCodeName}" não encontrado. ` +
                `Mostrando ${nameSearchResults.length} resultados com nomes similares em ${decodedLanguage}.`
            );
          }
        } else {
          const categoryResults = await getByLanguageAndCategory(
            decodedLanguage,
            decodedCategory
          );
          const firstValidCode = findFirstValidCode(categoryResults);

          if (firstValidCode) {
            setCode(firstValidCode);
          } else {
            throw new Error(
              `Nenhum código encontrado para ${decodedCategory} em ${decodedLanguage}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching code:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
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

  const handleSelectRecommendedCode = (code: CodeReference) => {
    navigate(
      `/code-model/${encodeURIComponent(code.language)}/${encodeURIComponent(
        code.category || ""
      )}/${encodeURIComponent(code.name)}`
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Carregando código...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-2 sm:px-4 sm:py-10">
        <div className="w-full max-w-6xl mt-12">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center mb-6">
            <Code2 className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {error.split(". ")[0]}.
            </h3>
            <p className="text-gray-600 mb-4">
              {error.split(". ").slice(1).join(". ")}
            </p>
            <button
              onClick={() => navigate("/code-model")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar códigos
            </button>
          </div>

          {nameSearchResults.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <RecommendationsList
                recommendations={nameSearchResults}
                onSelectCode={handleSelectRecommendedCode}
                navigate={navigate}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum código encontrado
          </h3>
          <button
            onClick={() => navigate("/code-model")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para a lista de códigos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-2 sm:px-4 sm:py-10">
      <div className="w-full max-w-6xl mt-12">
        <CodeHeader language={language} category={category} name={name} />

        <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
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

        {/* Recomendações padrão (se houver) */}
        {code.recommendations && code.recommendations.length > 0 && (
          <RecommendationsList
            recommendations={code.recommendations}
            onSelectCode={handleSelectRecommendedCode}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}

function getExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: "py",
    java: "java",
    "c#": "cs",
    csharp: "cs",
    cpp: "cpp",
    "c++": "cpp",
  };

  return extensions[language.toLowerCase()] || "txt";
}

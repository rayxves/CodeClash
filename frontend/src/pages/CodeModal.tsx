import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState, useEffect, useCallback } from "react";
import type { CodeReference } from "../types/code";
import CodeHeader from "../components/CodeModal/CodeHeader";
import CodeFooter from "../components/CodeModal/CodeFooter";
import {
  getCodeReferenceById,
  getCodeReferenceByFilters,
} from "../api/codeReferenceServices";
import type { CodeModalParams } from "../types/routes";
import RecommendationsList from "../components/Recomendation/RecomendationList";
import { ClipboardCopy, Code2 } from "lucide-react";
import { getLanguageExtension } from "../utils/getLanguageExtensions";

export default function CodeModal() {
  const { id, name } = useParams<CodeModalParams>();
  const [copySuccess, setCopySuccess] = useState("");
  const [code, setCode] = useState<CodeReference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameSearchResults, setNameSearchResults] = useState<CodeReference[]>(
    []
  );
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [codeRes, recsRes] = await Promise.all([
        getCodeReferenceById(Number(id)),
        getCodeReferenceByFilters(undefined, undefined, name),
      ]);
      setCode(codeRes);
      setNameSearchResults(recsRes || []);
      if (!codeRes) {
        setError("Erro ao carregar código.");
      }
    } catch {
      setError("Erro desconhecido ao buscar dados.");
    } finally {
      setIsLoading(false);
    }
  }, [id, name]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Código copiado!");
    } catch {
      setCopySuccess("Falha ao copiar.");
    }
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleSelectRecommendedCode = (code: CodeReference) => {
    navigate(
      `/code-modal/${encodeURIComponent(code.id)}/${encodeURIComponent(
        code.name
      )}`
    );
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando código...</p>
        </div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="w-full min-h-screen bg-gradient-surface flex flex-col items-center justify-center px-2 sm:px-4 sm:py-6">
        <div className="w-full max-w-6xl">
          <div className="bg-card p-8 rounded-2xl shadow-card text-center mb-6 border border-border">
            <Code2 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {error ? error.split(". ")[0] + "." : "Código não encontrado."}
            </h3>
            <p className="text-muted-foreground mb-4">
              {error ? error.split(". ").slice(1).join(". ") : ""}
            </p>
            <button
              onClick={() => navigate("/code-model")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift"
            >
              Explorar códigos
            </button>
          </div>

          {nameSearchResults.length > 0 && (
            <div className="bg-card p-6 rounded-2xl shadow-card border border-border">
              <RecommendationsList
                recommendations={nameSearchResults}
                onSelectCode={handleSelectRecommendedCode}
                navigate={navigate}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-surface flex flex-col items-center justify-center py-6 px-2 sm:px-4 sm:py-10">
      {copySuccess && (
        <div className="text-gray-900 text-sm text-center absolute top-52 right-10 sm:right-20 lg:right-28 bg-gray-300 px-2 py-1 rounded-md">
          {copySuccess}
        </div>
      )}

      <div className="w-full max-w-6xl h-full">
        <CodeHeader
          language={code.language}
          category={code.category}
          name={name || code.name}
        />

        <div className="w-full bg-card rounded-2xl shadow-card overflow-hidden border border-border mb-8">
          <div className="bg-gray-800 px-4 sm:px-5 py-2 flex justify-between items-center">
            <div className="flex items-center overflow-hidden">
              <div className="flex space-x-1.5 mr-2 sm:mr-3 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <h2 className="text-white font-mono text-xs sm:text-sm truncate">
                {code.name}.{getLanguageExtension(code.language.toLowerCase())}
              </h2>
            </div>

            <div className="w-fit flex gap-4 items-center justify-end">
              <span className="text-gray-400 text-center text-xs font-mono bg-gray-700 px-2 py-0.5 rounded-md">
                {code.language}
              </span>
              <ClipboardCopy
                className="hover:cursor-copy text-white"
                size={16}
                onClick={async () => await handleCopyClick(code.code)}
              />
            </div>
          </div>

          <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh] sm:max-h-[65vh] text-xs sm:text-sm">
            <SyntaxHighlighter
              language={getLanguageExtension(code.language.toLowerCase())}
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              customStyle={{
                margin: 0,
                padding: "0.75rem 1rem",
                background: "#1e1e2f",
                fontSize: "0.8rem sm:0.85rem",
                lineHeight: "1.5",
                overflowX: "auto",
                wordBreak: "break-word",
              }}
              lineNumberStyle={{
                minWidth: "2em",
                paddingRight: "1.5em",
                marginRight: "0.5em",
                color: "#6e7681",
                textAlign: "right",
              }}
            >
              {code.code}
            </SyntaxHighlighter>
          </div>

          <CodeFooter description={code.description} />
        </div>

        {code.recommendations && code.recommendations.length > 0 && (
          <RecommendationsList
            recommendations={code.recommendations}
            onSelectCode={handleSelectRecommendedCode}
            navigate={navigate}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

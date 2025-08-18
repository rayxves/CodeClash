import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import NoCodeScreen from "./NoCodeScreen";
import SourceCodeSection from "./SourceCodeSection";
import CodeDetailModal from "./CodeDetailModal";
import { getCodeReferenceByFilters, recommendSimilar } from "../../../../api";
import type { CodeReference } from "../../../types/code";
import { ChevronLeft } from "lucide-react";
import HeaderSection from "./HeaderSection";
import RecommendationsList from "./RecomendationList";

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { language, name } = useParams<{ language?: string; name?: string }>();

  const [recommendations, setRecommendations] = useState<CodeReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCode, setSelectedCode] = useState<CodeReference | null>(null);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [sourceType, setSourceType] = useState<"user" | "model" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (language && name) {
          const decodedLanguage = decodeURIComponent(language);
          const decodedName = decodeURIComponent(name);

          const response = await getCodeReferenceByFilters(
            decodedLanguage,
            undefined,
            decodedName
          );
          if (response.length > 0) {
            const modelCode = response[0];
            setSourceCode(modelCode.code);
            setSourceType("model");
            fetchRecommendations(modelCode.code);
          }
        } else {
          const queryParams = new URLSearchParams(location.search);
          const codeParam = queryParams.get("code");

          if (codeParam) {
            const userCode = decodeURIComponent(codeParam);
            setSourceCode(userCode);
            setSourceType("user");
            fetchRecommendations(userCode);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location, language, name]);

  const fetchRecommendations = async (code: string) => {
    try {
      const data = await recommendSimilar(code);
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <LoadingScreen />;
  if (!sourceCode)
    return <NoCodeScreen language={language} name={name} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mt-12">
        {selectedCode ? (
          <div className="space-y-6">
            <CodeDetailModal
              code={selectedCode}
              onBackToCategory={() =>
                navigate(
                  `/code-model/${encodeURIComponent(
                    selectedCode.language
                  )}/${encodeURIComponent(selectedCode.category || "")}`
                )
              }
            />
            <button
              onClick={() => setSelectedCode(null)}
              className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-muted/50 text-card-foreground rounded-xl border border-border transition-all hover:shadow-card font-medium hover-lift"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar para lista de recomendações
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <HeaderSection onBack={() => navigate(-2)} />
            <SourceCodeSection
              sourceCode={sourceCode}
              sourceType={sourceType}
              language={language}
            />
            <RecommendationsList
              recommendations={recommendations}
              onSelectCode={setSelectedCode}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

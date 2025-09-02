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
  const { language, name, code } = useParams<{ language?: string; name?: string; code?: string }>();

  const [recommendations, setRecommendations] = useState<CodeReference[]>([]);
  const [loadingCode, setLoadingCode] = useState<boolean>(true);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<CodeReference | null>(null);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [sourceType, setSourceType] = useState<"user" | "model" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCode(true);
      setLoadingRecs(true);
      try {
        if (language && name) {
          const [response, recs] = await Promise.allSettled([
            getCodeReferenceByFilters(decodeURIComponent(language), undefined, decodeURIComponent(name)),
            recommendSimilar(""),
          ]);
          if (response.status === "fulfilled" && response.value.length > 0) {
            const modelCode = response.value[0];
            setSourceCode(modelCode.code);
            setSourceType("model");
            if (recs.status === "fulfilled") setRecommendations(recs.value || []);
          } else {
            setSourceCode("");
          }
        } else if (code) {
          const userCode = decodeURIComponent(code);
          setSourceCode(userCode);
          setSourceType("user");
          const recs = await recommendSimilar(userCode);
          setRecommendations(recs || []);
        } else {
          setSourceCode("");
        }
      } catch {
        setSourceCode("");
      } finally {
        setLoadingCode(false);
        setLoadingRecs(false);
      }
    };

    fetchData();
  }, [language, name, code]);

  if (loadingCode) return <LoadingScreen />;
  if (!sourceCode) return <NoCodeScreen language={language} name={name} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mt-12">
        {selectedCode ? (
          <div className="space-y-6">
            <CodeDetailModal
              code={selectedCode}
              onBackToCategory={() =>
                navigate(
                  `/code-model/${encodeURIComponent(selectedCode.language)}/${encodeURIComponent(
                    selectedCode.category || ""
                  )}`
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
            <SourceCodeSection sourceCode={sourceCode} sourceType={sourceType} language={language} />
            <RecommendationsList
              recommendations={recommendations}
              onSelectCode={setSelectedCode}
              navigate={navigate}
              loading={loadingRecs}
            />
          </div>
        )}
      </div>
    </div>
  );
}

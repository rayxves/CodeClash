import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, useMemo } from "react";
import { getCategoryView } from "../../../api/codeReferenceServices";
import { useDebounce } from "../../../hooks/useDebounce";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import type { CategoryPageParams } from "../../../types/routes";
import type { CategoryViewData, ChildCategory } from "../../../types/code";

const CodeList = lazy(() => import("../CodeModal/CodeList"));

export default function CategoryPage() {
  const { language = "", category = "" } = useParams<CategoryPageParams>();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState<CategoryViewData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const data = await getCategoryView(language, category);
        setCategoryData(data);
      } catch {
        setCategoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [language, category]);

  const handleBack = () => {
    navigate(`/code-model`);
  };

  const matchesSearch = useMemo(() => {
    const search = debouncedSearchTerm.toLowerCase().trim();

    function checkMatch(child: ChildCategory): boolean {
      if (
        child.name?.toLowerCase().includes(search) ||
        child.category?.toLowerCase().includes(search) ||
        child.code?.toLowerCase().includes(search)
      ) {
        return true;
      }

      if (child.children && child.children.length > 0) {
        return child.children.some(checkMatch);
      }

      return false;
    }

    return checkMatch;
  }, [debouncedSearchTerm]);

  const filteredChildren = useMemo(() => {
    if (!categoryData?.children) return [];
    if (!debouncedSearchTerm.trim()) return categoryData.children;

    return categoryData.children.filter(matchesSearch);
  }, [debouncedSearchTerm, categoryData, matchesSearch]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 gap-6 flex flex-col bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all group w-fit"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Voltar</span>
          </button>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placehoder="Buscar algoritmos..."
          />
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-muted/30 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : categoryData ? (
          <div className="space-y-6">
            {filteredChildren.length > 0 ? (
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 hover:shadow-elegant transition-all">
                <Suspense
                  fallback={
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Carregando conteúdo...
                      </p>
                    </div>
                  }
                >
                  <CodeList
                    codes={filteredChildren.map((child) => ({
                      ...child,
                      language: child.language || language,
                      category: child.category || category,
                      parentId: child.parentId || null,
                      description: child.description || "",
                      code: child.code || "",
                    }))}
                    language={language}
                    isSearching={debouncedSearchTerm.trim().length > 0}
                  />
                </Suspense>
              </div>
            ) : (
              <EmptyState searchTerm={debouncedSearchTerm} />
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-12">
              <p className="text-muted-foreground text-lg">
                Nenhum dado encontrado para esta categoria
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

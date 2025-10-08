import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, useMemo } from "react";
import { Code2, Filter } from "lucide-react";
import { getCategoryView } from "../api/codeReferenceServices";
import EmptyState from "../components/CodeModel/Category/EmptyState";
import SearchBar from "../components/CodeModel/Category/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import type { CategoryViewData, ChildCategory } from "../types/code";
import type { CategoryPageParams } from "../types/routes";

const CodeList = lazy(() => import("../components/CodeModel/CodeModal/CodeList"));

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

  const filterAndHighlight = useMemo(() => {
    const search = debouncedSearchTerm.toLowerCase().trim();
    const matchedIds = new Set<number>();

    function deepSearch(child: ChildCategory): ChildCategory | null {
      const nameMatch = child.name?.toLowerCase().includes(search);
      const categoryMatch = child.category?.toLowerCase().includes(search);
      const codeMatch = child.code?.toLowerCase().includes(search);

      const currentMatches = nameMatch || categoryMatch || codeMatch;

      if (currentMatches && child.id) {
        matchedIds.add(parseInt(child.id));
      }

      let matchedChildren: ChildCategory[] = [];
      if (child.children && child.children.length > 0) {
        matchedChildren = child.children
          .map(deepSearch)
          .filter((c): c is ChildCategory => c !== null);
      }

      if (currentMatches || matchedChildren.length > 0) {
        return {
          ...child,
          children:
            matchedChildren.length > 0 ? matchedChildren : child.children,
        };
      }

      return null;
    }

    return { deepSearch, matchedIds };
  }, [debouncedSearchTerm]);

  const filteredChildren = useMemo(() => {
    if (!categoryData?.children) return [];
    if (!debouncedSearchTerm.trim()) {
      return categoryData.children;
    }

    const filtered = categoryData.children
      .map(filterAndHighlight.deepSearch)
      .filter((c): c is ChildCategory => c !== null);

    return filtered;
  }, [debouncedSearchTerm, categoryData, filterAndHighlight]);

  const hasSearchResults = useMemo(() => {
    return debouncedSearchTerm.trim().length > 0 && filteredChildren.length > 0;
  }, [debouncedSearchTerm, filteredChildren]);

  const categoryTitle = useMemo(() => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [category]);

  const resultsCount = useMemo(() => {
    return filterAndHighlight.matchedIds.size;
  }, [filterAndHighlight.matchedIds]);

  return (
    <main className="min-h-screen bg-gradient-surface py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-6 sm:mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl sm:rounded-3xl blur-xl"></div>
          <div className="relative bg-card/50 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-border/50 shadow-xl">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 sm:gap-3 text-primary hover:text-primary/80 transition-all group w-fit mb-4 sm:mb-6"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"
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
              <span className="font-semibold text-sm sm:text-base">Voltar</span>
            </button>

            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground break-words">
                  {categoryTitle}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 flex items-center gap-2">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
                  <span className="truncate">
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placehoder="Buscar algoritmos..."
            />

            {debouncedSearchTerm.trim() && resultsCount > 0 && (
              <div className="mt-3 sm:mt-4 flex items-start gap-2 text-xs sm:text-sm">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  Encontrado{resultsCount > 1 ? "s" : ""}{" "}
                  <strong className="text-primary font-semibold">
                    {resultsCount}
                  </strong>{" "}
                  resultado{resultsCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 sm:space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 sm:h-32 bg-card/30 rounded-2xl sm:rounded-3xl animate-pulse border border-border/30"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : categoryData ? (
          <div className="space-y-4 sm:space-y-6">
            {filteredChildren.length > 0 ? (
              <div className="bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-border/50 p-3 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all">
                <Suspense
                  fallback={
                    <div className="p-8 sm:p-12 text-center">
                      <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"></div>
                      <p className="text-muted-foreground text-base sm:text-lg">
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
                    isSearching={hasSearchResults}
                  />
                </Suspense>
              </div>
            ) : (
              <EmptyState searchTerm={debouncedSearchTerm} />
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
              <div className="relative bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-border/50 p-8 sm:p-12 lg:p-16 shadow-xl">
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                  <Code2 className="relative w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
                </div>
                <p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-medium">
                  Nenhum dado encontrado para esta categoria
                </p>
                <button
                  onClick={handleBack}
                  className="mt-4 sm:mt-6 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
                >
                  Voltar às categorias
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
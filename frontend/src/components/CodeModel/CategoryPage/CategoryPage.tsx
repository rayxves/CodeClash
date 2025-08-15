import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, useMemo } from "react";
import { getCategoryView } from "../../../../api";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import type { CategoryPageParams } from "../../../types/routes";
import type { CategoryViewData } from "../../../types/code";

const CodeList = lazy(() => import("../CodeModal/CodeList"));

export default function CategoryPage() {
  const { language = "", category = "" } = useParams<CategoryPageParams>();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState<CategoryViewData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const data = await getCategoryView(language, category);
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category data:", error);
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

  const filteredChildren = useMemo(() => {
    if (!categoryData?.children) return [];
    if (!searchTerm.trim()) return categoryData.children;
    return categoryData.children.filter((child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categoryData]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 gap-3 flex flex-col">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
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
            Voltar
          </button>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : categoryData ? (
          <div className="space-y-4">
            {filteredChildren.length > 0 ? (
              <div className="bg-white rounded-lg shadow p-4">
                <Suspense
                  fallback={
                    <div className="p-4 text-center">
                      Carregando conteúdo...
                    </div>
                  }
                >
                  <CodeList
                    codes={filteredChildren}
                    language={language}
                    isSearching={searchTerm.trim().length > 0}
                  />
                </Suspense>
              </div>
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum dado encontrado para esta categoria
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

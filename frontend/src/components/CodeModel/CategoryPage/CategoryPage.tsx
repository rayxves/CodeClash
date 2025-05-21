import { useParams, Link } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { getByLanguageAndCategory } from "../../../../api";
import type { CodeReference } from "../../../types/code";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import type { CategoryPageParams } from "../../../types/routes";

const CodeList = lazy(() => import("../CodeModal/CodeList"));

export default function CategoryPage() {
  const { language = "", category = "" } = useParams<CategoryPageParams>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [codes, setCodes] = useState<CodeReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredCodes, setFilteredCodes] = useState<CodeReference[]>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCodes = async () => {
      setLoading(true);
      try {
        const data = await getByLanguageAndCategory(language, category, {
          signal: controller.signal,
        });
        if (isMounted) {
          setCodes(data);
          setFilteredCodes(data);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching codes:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCodes, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [language, category]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCodes(codes);
    } else {
      const filtered = codes.filter((code) =>
        code.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCodes(filtered);
    }
  }, [searchTerm, codes]);

  useEffect(() => {
    document.title = `${category} em ${language} | Algoritmos de Programação`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Coleção de algoritmos de ${category} implementados em ${language}. Inclui exemplos práticos e explicações.`
      );
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = `Coleção de algoritmos de ${category} implementados em ${language}. Inclui exemplos práticos e explicações.`;
      document.head.appendChild(newMeta);
    }
  }, [category, language]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link
            to="/code-model"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-0.5 transition-transform flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap">Voltar</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            <span className="text-blue-600">{category}</span> em{" "}
            <span className="text-green-600">{language}</span>
          </h1>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-busy="true"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : filteredCodes.length > 0 ? (
          <Suspense
            fallback={
              <div className="h-20 bg-gray-200 animate-pulse rounded-lg" />
            }
          >
            <CodeList
              codes={filteredCodes}
              language={language}
              category={category}
            />
          </Suspense>
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    </main>
  );
}

import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getByLanguageAndCategory } from "../../../../api";
import type { CodeReference } from "../../../types/code";
import CodeList from "../CodeModal/CodeList";
import EmptyState from "./EmptyState";
import SearchBar from "./SearchBar";
import type { CategoryPageParams } from "../../../types/routes";

export default function CategoryPage() {
  const { language = "", category = "" } = useParams<CategoryPageParams>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [codes, setCodes] = useState<CodeReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredCodes, setFilteredCodes] = useState(codes);

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const data = await getByLanguageAndCategory(language, category);
        setCodes(data);
      } catch (error) {
        console.error("Error fetching codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link
            to="/code-model"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-0.5 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap">Voltar </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            <span className="text-blue-600">{category}</span> em{" "}
            <span className="text-green-600">{language}</span>
          </h1>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {loading ? (
          <div>Loading...</div>
        ) : filteredCodes.length > 0 ? (
          <CodeList
            codes={filteredCodes}
            language={language}
            category={category}
          />
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
}

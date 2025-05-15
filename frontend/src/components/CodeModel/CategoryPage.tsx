import { useParams, Link, useNavigate } from "react-router-dom";
import { Code2, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

const MOCK_CODES = [
  {
    name: "Bubble Sort",
    description:
      "Algoritmo de ordenação simples que funciona trocando elementos adjacentes se estiverem na ordem errada. Complexidade: O(n²)",
    language: "python",
    category: "sort",
    difficulty: "Iniciante",
  },
  {
    name: "Quick Sort",
    description:
      "Algoritmo eficiente que usa a abordagem 'dividir para conquistar'. Complexidade média: O(n log n)",
    language: "python",
    category: "sort",
    difficulty: "Intermediário",
  },
];

export default function CategoryPage() {
  const { language, category } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCodes = MOCK_CODES.filter(
    (code) => code.language === language && code.category === category
  ).filter(
    (code) =>
      code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar algoritmos..."
            className="block w-full pl-10 pr-3 py-2 text-gray-900 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredCodes.length > 0 ? (
          <div className="grid gap-4">
            {filteredCodes.map((code) => (
              <div
                key={code.name}
                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between ">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Code2 className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {code.name}
                      </h2>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-lg transition-colors shadow-sm hover:shadow-md self-end sm:self-center"
                    onClick={() =>
                      navigate(`/code-model/${language}/${category}/code`)
                    }
                  >
                    Ver código
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-gray-700 font-medium">
              Nenhum algoritmo encontrado
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Esta categoria ainda não tem conteúdos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

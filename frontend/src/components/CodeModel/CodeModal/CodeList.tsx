import { useNavigate } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import type { CodeReference } from "../../../types/code";

interface CodeListProps {
  codes: CodeReference[];
  language: string;
  category: string;
}

export default function CodeList({ codes, language, category }: CodeListProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-hidden px-2 sm:px-0">
      <div
        className="grid grid-cols-1 mt-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
        role="list"
      >
        {codes.map((code) => (
          <article
            key={code.id}
            className="p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 w-full"
            role="listitem"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="p-2 bg-blue-50 rounded-lg flex-shrink-0"
                  aria-hidden="true"
                >
                  <Code2 className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                    {code.name}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 break-words">
                    {code.description}
                  </p>
                  <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                    <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-md">
                      {language}
                    </span>
                    {category && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-md">
                        {category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-end">
                <button
                  className="flex items-center justify-center gap-1 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  onClick={() =>
                    navigate(
                      `/code-model/${encodeURIComponent(
                        language
                      )}/${encodeURIComponent(category)}/${encodeURIComponent(
                        code.name
                      )}`
                    )
                  }
                  aria-label={`Ver código do algoritmo ${code.name}`}
                >
                  Ver código
                  <ArrowRight
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

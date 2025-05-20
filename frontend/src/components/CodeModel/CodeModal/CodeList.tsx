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
    <div className="grid gap-4">
      {codes.map((code) => (
        <div
          key={code.id}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Code2 className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {code.name}
                </h2>
                <p className="text-gray-600 text-sm">{code.description}</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-lg transition-colors shadow-sm hover:shadow-md self-end sm:self-center"
              onClick={() =>
                navigate(
                  `/code-model/${encodeURIComponent(
                    language
                  )}/${encodeURIComponent(category)}/${encodeURIComponent(
                    code.name
                  )}`
                )
              }
            >
              Ver código
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

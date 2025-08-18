import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
import type { CodeReference } from "../../../types/code";

interface CodeItemProps {
  code: CodeReference;
  language: string;
}
export default function CodeItem({ code, language }: CodeItemProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/code-modal/${encodeURIComponent(code.id)}/${encodeURIComponent(code.name)}`)}
      className="flex items-center p-4 bg-gradient-to-br from-background via-gray-900/20 to-background hover:bg-gray-800 rounded-lg border border-l-gray-500 cursor-pointer transition-colors duration-200 group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/code-modal/${encodeURIComponent(code.id)}/${encodeURIComponent(code.name)}`)}
    >
      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
        <Code2 className="w-5 h-5 text-blue-600" />
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <h3 className="font-medium text-gray-100">{code.name}</h3>
        {code.description && (
          <p className="text-sm text-gray-300 mt-1">{code.description}</p>
        )}
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
            {language}
          </span>
         
        </div>
      </div>
    </div>
  );
}
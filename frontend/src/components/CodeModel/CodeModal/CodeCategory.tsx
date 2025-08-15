import { useState } from "react";
import { Folder, ChevronRight } from "lucide-react";
import type { CodeReference } from "../../../types/code";
import CodeItem from "./CodeItem";

interface CodeCategoryProps {
  categoryItem: CodeReference;
  language: string;
  defaultOpen?: boolean;
}
export default function CodeCategory({ 
  categoryItem, 
  language, 
  defaultOpen = false 
}: CodeCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div className="text-left">
            <span className="font-medium text-gray-800 block">{categoryItem.name}</span>
            {categoryItem.description && (
              <span className="text-sm text-gray-500">{categoryItem.description}</span>
            )}
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && categoryItem.children && (
        <div className="bg-gray-50 p-4 space-y-3 border-t border-gray-200">
          {categoryItem.children.map((child) => (
            child.children && child.children.length > 0 ? (
              <CodeCategory
                key={child.id}
                categoryItem={child}
                language={language}
              />
            ) : (
              <CodeItem key={child.id} code={child} language={language} />
            )
          ))}
        </div>
      )}
    </div>
  );
}
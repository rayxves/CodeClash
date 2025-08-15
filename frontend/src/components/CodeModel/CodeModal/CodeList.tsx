import type { CodeReference } from "../../../types/code";
import CodeCategory from "./CodeCategory";
import CodeItem from "./CodeItem";

interface CodeListProps {
  codes: CodeReference[];
  language: string;
  isSearching: boolean;
}

export default function CodeList({
  codes,
  language,
  isSearching,
}: CodeListProps) {
  if (!codes || codes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum item encontrado</h3>
        <p className="text-gray-500">Tente ajustar sua pesquisa ou filtrar por outra categoria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {codes.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <CodeCategory
              key={item.id}
              categoryItem={item}
              language={language}
              defaultOpen={isSearching}
            />
          );
        }
        return <CodeItem key={item.id} code={item} language={language} />;
      })}
    </div>
  );
}
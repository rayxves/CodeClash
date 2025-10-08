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
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
          Nenhum item encontrado
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Tente ajustar sua pesquisa ou filtrar por outra categoria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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
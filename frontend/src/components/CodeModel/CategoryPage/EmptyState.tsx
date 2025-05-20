import { Search } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
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
  );
}
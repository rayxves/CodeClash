import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Language, Category } from "../../../types/code";
import { Search as SearchIcon } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  selectedLanguage: Language;
}

export default function CategoryList({
  categories,
  selectedLanguage,
}: CategoryListProps) {
  const navigate = useNavigate();

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
        <SearchIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <h3 className="text-gray-700 font-medium">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-gray-500 text-sm">Tente ajustar sua busca</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {categories.map((category) => (
        <div
          key={category.name}
          onClick={() =>
            navigate(
              `/code-model/${encodeURIComponent(selectedLanguage.name.toLowerCase())}/${encodeURIComponent(
                category.alias.toLowerCase().replace(/\s/g, "-")
              )}`
            )
          }
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              {category.icon}
            </div>
            <span className="font-medium text-gray-800">{category.name}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      ))}
    </div>
  );
}

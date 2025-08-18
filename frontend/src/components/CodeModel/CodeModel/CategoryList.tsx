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
      <div className="text-center py-12 bg-card rounded-2xl border border-border shadow-card">
        <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-card-foreground font-semibold text-lg mb-2">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-muted-foreground">Tente ajustar sua busca</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          className="group flex items-center justify-between p-6 bg-card rounded-2xl border border-border hover:border-primary/50 shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer hover-lift"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors duration-300">
              {category.icon}
            </div>
            <span className="font-semibold text-card-foreground text-lg">{category.name}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      ))}
    </div>
  );
}

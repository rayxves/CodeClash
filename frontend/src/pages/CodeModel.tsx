import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Language, Category } from "../types/code";
import LanguageSelector from "../components/CodeModel/LanguageSelector";
import CategoryList from "../components/CodeModel/CategoryList";
import SearchBar from "../components/Category/SearchBar";
import {
  SortAsc,
  TreeDeciduous,
  Search as SearchIcon,
  Calculator,
  Layers,
  Type,
  SendToBack,
  Binary,
  LibraryBig,
  Atom,
  Braces,
  Code2,
  Coffee,
  LayoutGrid,
  Network,
  ChevronRight,
} from "lucide-react";
import Cookies from "js-cookie";

export const LANGUAGES: Language[] = [
  {
    name: "Python",
    icon: <Code2 className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-100",
  },
  {
    name: "C++",
    icon: <Braces className="w-5 h-5 text-indigo-600" />,
    color: "bg-indigo-100",
  },
  {
    name: "Java",
    icon: <Coffee className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-100",
  },
  {
    name: "C#",
    icon: <Atom className="w-5 h-5 text-purple-600" />,
    color: "bg-purple-100",
  },
];

export const CATEGORIES: Category[] = [
  {
    name: "Ordenação",
    alias: "sort",
    icon: <SortAsc className="w-5 h-5 text-blue-600" />,
  },
  {
    name: "Estrutura de Dados",
    alias: "data_structure",
    icon: <TreeDeciduous className="w-5 h-5 text-green-600" />,
  },
  {
    name: "Busca",
    alias: "search",
    icon: <SearchIcon className="w-5 h-5 text-red-600" />,
  },
  {
    name: "Matemática",
    alias: "math",
    icon: <Calculator className="w-5 h-5 text-yellow-600" />,
  },
  {
    name: "Programação dinâmica",
    alias: "dynamic_programming",
    icon: <Layers className="w-5 h-5 text-purple-600" />,
  },
  {
    name: "Manipulação de strings",
    alias: "strings",
    icon: <Type className="w-5 h-5 text-pink-600" />,
  },
  {
    name: "Backtracking",
    alias: "backtracking",
    icon: <SendToBack className="w-5 h-5 text-pink-600" />,
  },
  {
    name: "Manipulação de bits",
    alias: "bit_manipulation",
    icon: <Binary className="w-5 h-5 text-pink-600" />,
  },
  {
    name: "Others",
    alias: "other",
    icon: <LibraryBig className="w-5 h-5 text-gray-600" />,
  },
];

type ViewMode = "category" | "tree";

export default function CodeModel() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const saved = Cookies.get("language");
    return LANGUAGES.find((l) => l.name === saved) || LANGUAGES[0];
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (Cookies.get("codeModelViewMode") as ViewMode) || "category"
  );
  const navigate = useNavigate();

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    Cookies.set("codeModelViewMode", mode, { expires: 365 });
  };

  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-surface py-12 px-4 sm:px-6">
      <Link
        to="/"
        className="mb-8 flex items-center text-primary hover:text-primary/80 transition-colors text-sm sm:text-base group max-w-4xl mx-auto"
      >
        <svg
          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Voltar para início
      </Link>

      <div className="max-w-4xl mx-auto">
        <LanguageSelector
          languages={LANGUAGES}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-2xl border border-border shadow-card">
          <div className={`p-3 rounded-xl ${selectedLanguage.color} shadow-sm`}>
            {selectedLanguage.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {selectedLanguage.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore algoritmos e estruturas de dados
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8 bg-card p-1.5 rounded-xl border border-border w-fit mx-auto shadow-sm">
          <button
            onClick={() => handleViewModeChange("category")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              viewMode === "category"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Categorias
          </button>
          <button
            onClick={() => handleViewModeChange("tree")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              viewMode === "tree"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Network className="w-4 h-4" />
            Árvore Interativa
          </button>
        </div>

        {viewMode === "category" ? (
          <>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placehoder="Buscar categorias..."
            />
            <CategoryList
              categories={filteredCategories}
              selectedLanguage={selectedLanguage}
            />
          </>
        ) : (
          <div className="text-center py-12 px-6 bg-card rounded-2xl border border-border shadow-card">
            <Network className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-card-foreground font-semibold text-lg mb-2">
              Navegação em Árvore Interativa
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explore todos os algoritmos e categorias de{" "}
              {selectedLanguage.name} em uma estrutura visual completa.
            </p>
            <button
              onClick={() =>
                navigate(`/${encodeURIComponent(selectedLanguage.name)}`)
              }
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all"
            >
              Explorar em Árvore
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import type { Language, Category } from "../../../types/code";
import LanguageSelector from "./LanguageSelector";
import CategoryList from "./CategoryList";
import SearchBar from "../CategoryPage/SearchBar";
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

export default function CodeModel() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const saved = Cookies.get("language");
    return LANGUAGES.find((l) => l.name === saved) || LANGUAGES[0];
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const language = Cookies.get("language")
    ? LANGUAGES.find(
        (lang) =>
          lang.name.toLowerCase() === Cookies.get("language")?.toLowerCase()
      ) || LANGUAGES[0]
    : selectedLanguage;

  return (
    <div className="min-h-screen bg-gradient-surface py-12 px-4 sm:px-6">
      <Link
        to="/"
        className="mt-8 mb-8 flex items-center text-primary hover:text-primary/80 transition-colors text-sm sm:text-base group max-w-4xl mx-auto"
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
          selectedLanguage={language}
          setSelectedLanguage={setSelectedLanguage}
        />

        <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-2xl border border-border shadow-card">
          <div className={`p-3 rounded-xl ${language.color} shadow-sm`}>
            {language.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {language.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore algoritmos e estruturas de dados
            </p>
          </div>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placehoder="Buscar categorias..."
        />

        <CategoryList
          categories={filteredCategories}
          selectedLanguage={language}
        />
      </div>
    </div>
  );
}

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

const LANGUAGES: Language[] = [
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

const CATEGORIES: Category[] = [
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
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <Link
        to="/"
        className="mt-12 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group mb-6"
      >
      </Link>
      <div className="max-w-4xl mx-auto">
        <LanguageSelector
          languages={LANGUAGES}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className={`p-2 rounded-full ${selectedLanguage.color}`}>
            {selectedLanguage.icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedLanguage.name}
          </h2>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <CategoryList
          categories={filteredCategories}
          selectedLanguage={selectedLanguage}
        />
      </div>
    </div>
  );
}
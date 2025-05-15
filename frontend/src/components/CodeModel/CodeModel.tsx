"use client";
import { useState } from "react";
import {
  Atom,
  Code2,
  Coffee,
  Braces,
  SortAsc,
  TreeDeciduous,
  Search,
  Calculator,
  Layers,
  Type,
  LibraryBig,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LANGUAGES = [
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

const CATEGORIES = [
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
    icon: <Search className="w-5 h-5 text-red-600" />,
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
    name: "Others",
    alias: "other",
    icon: <LibraryBig className="w-5 h-5 text-gray-600" />,
  },
];

export default function CodeModel() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <Link
        to="/"
        className="mt-12 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-0.5 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="whitespace-nowrap">Voltar </span>
      </Link>
      <div className="max-w-4xl mx-auto ">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Linguagens disponíveis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-5/6 h-4/6">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.name}
                onClick={() => setSelectedLanguage(lang)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all ${
                  selectedLanguage.name === lang.name
                    ? "border-blue-400 bg-white shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className={`p-3 rounded-full ${lang.color} mb-2`}>
                  {lang.icon}
                </div>
                <span className="font-medium text-gray-800">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className={`p-2 rounded-full ${selectedLanguage.color}`}>
            {selectedLanguage.icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedLanguage.name}
          </h2>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar categorias..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.name}
                onClick={() =>
                  navigate(
                    `/code-model/${selectedLanguage.name.toLowerCase()}/${category.alias
                      .toLowerCase()
                      .replace(/\s/g, "-")}`
                  )
                }
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    {category.icon}
                  </div>
                  <span className="font-medium text-gray-800">
                    {category.name}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <h3 className="text-gray-700 font-medium">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "Tente ajustar sua busca"
                  : "Não há categorias disponíveis"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

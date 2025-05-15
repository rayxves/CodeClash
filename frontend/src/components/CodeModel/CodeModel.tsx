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
} from "lucide-react";

const LANGUAGES = [
  { name: "Python", icon: <Code2 className="w-5 h-5 mr-2 text-blue-500" /> },
  { name: "C++", icon: <Braces className="w-5 h-5 mr-2 text-indigo-600" /> },
  { name: "Java", icon: <Coffee className="w-5 h-5 mr-2 text-orange-500" /> },
  { name: "C#", icon: <Atom className="w-5 h-5 mr-2 text-purple-600" /> },
];

const CATEGORIES = [
  {
    name: "Ordenação",
    icon: <SortAsc className="w-5 h-5 mr-2 text-gray-500" />,
  },
  {
    name: "Estrutura de Dados",
    icon: <TreeDeciduous className="w-5 h-5 mr-2 text-gray-500" />,
  },
  { name: "Busca", icon: <Search className="w-5 h-5 mr-2 text-gray-500" /> },
  {
    name: "Matemática",
    icon: <Calculator className="w-5 h-5 mr-2 text-gray-500" />,
  },
  {
    name: "Programação dinâmica",
    icon: <Layers className="w-5 h-5 mr-2 text-gray-500" />,
  },
  {
    name: "Manipulação de strings",
    icon: <Type className="w-5 h-5 mr-2 text-gray-500" />,
  },
];

export default function CodeModel() {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  return (
    <div className="bg-whitesmoke w-full min-h-screen flex flex-col gap-4 items-start">
      <div className="w-5/6 md:w-4/6 items-center justify-center text-center mb-4 mx-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navbar mt-24 sm:mb-4 text-center">
          Repositório de códigos modelo
        </h1>
      </div>

      <div className="w-full h-full">
        {" "}
        <div className="w-full flex items-center justify-center">
          <div className="w-5/6 md:w-4/6 grid grid-cols-4 items-center justify-center text-center gap-3 mb-4 mx-6">
            {LANGUAGES.map((lang) => (
              <section
                key={lang.name}
                onClick={() => setSelectedLanguage(lang)}
                className={`cursor-pointer flex items-center justify-center py-2 rounded-md shadow hover:shadow-lg transition-shadow border ${
                  selectedLanguage.name === lang.name
                    ? "bg-white border-blue-400"
                    : "bg-white border-gray-200"
                }`}
              >
                <h2 className="text-md px-2 text-navbar font-semibold flex items-center">
                  {lang.icon}
                  {lang.name}
                </h2>
              </section>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center mb-12 ">
          <section className="flex items-start justify-start bg-blue-100 p-2 rounded-t-md ">
            <h2 className="text-md px-2 text-navbar font-semibold flex items-center ">
              {selectedLanguage.icon}
              {selectedLanguage.name}
            </h2>
          </section>
          <div className="w-11/12 md:w-4/6 grid grid-cols-1 gap-4 mx-6 bg-blue-100 px-5 py-6 pb-8 rounded">
            {CATEGORIES.map((category) => (
              <section
                key={category.name}
                className="bg-white py-2 rounded shadow hover:scale-[1.02] hover:shadow-lg transition duration-300 border border-gray-200"
              >
                <h2 className="text-lg px-5 py-3 cursor-pointer text-navbar font-semibold flex items-center gap-3">
                  {category.icon}
                  {category.name}
                </h2>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

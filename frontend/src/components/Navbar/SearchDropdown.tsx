import { useState } from "react";
import { Search } from "lucide-react";
import { LANGUAGES, CATEGORIES } from "../CodeModel/CodeModel/CodeModel";
import { useNavigate } from "react-router-dom";

interface SearchDropdownProps {
  onNavigation?: () => void;
}

export default function SearchDropdown({ onNavigation }: SearchDropdownProps) {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<
    "language" | "category" | "name"
  >("language");

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const encodeUrlParam = (param: string) => {
    return encodeURIComponent(param.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setSelectedCategory(null);
    setSearchTerm("");
    setActiveFilter("category");
  };

  const handleCategorySelect = (category: string) => {
    if (!selectedLanguage) return;
    setSelectedCategory(category);
    setSearchTerm("");
    setActiveFilter("name");
  };

  const handleApplyFilters = () => {
    if (!selectedLanguage) return;

    const encodedLanguage = encodeUrlParam(selectedLanguage);

    if (selectedCategory) {
      const encodedCategory = encodeUrlParam(selectedCategory);

      if (searchTerm.trim()) {
        const encodedName = encodeUrlParam(searchTerm.trim());
        navigate(
          `/code-model/${encodedLanguage}/${encodedCategory}/${encodedName}`
        );
      } else {
        navigate(`/code-model/${encodedLanguage}/${encodedCategory}`);
      }
    }

    if (onNavigation) onNavigation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeFilter === "language" && filteredLanguages.length > 0) {
        handleLanguageSelect(filteredLanguages[0].name);
      } else if (activeFilter === "category" && filteredCategories.length > 0) {
        handleCategorySelect(filteredCategories[0].alias);
      } else if (activeFilter === "name" && searchTerm.trim()) {
        handleApplyFilters();
      }
    }
  };

  const getPlaceholderText = () => {
    switch (activeFilter) {
      case "language":
        return "Buscar linguagem...";
      case "category":
        return selectedLanguage
          ? `Buscar categoria em ${selectedLanguage.toLowerCase()}...`
          : "Selecione uma linguagem primeiro";
      case "name":
        return selectedLanguage && selectedCategory
          ? `Buscar código em ${selectedLanguage.toLowerCase()}/${selectedCategory}...`
          : "Selecione linguagem e categoria primeiro";
      default:
        return "Buscar...";
    }
  };

  return (
    <div className="bg-navbar w-full shadow-md rounded-md p-4 z-50 text-sm text-whitesmoke xl:flex xl:flex-col xl:items-center">
      <div className="mb-3 flex items-center bg-gray-200 py-2 px-2 rounded border-gray-300 hover:shadow hover:shadow-gray-100/50 xl:w-4/6">
        <Search className="text-gray-700 w-4 h-4" />
        <input
          className="w-full pl-2 border rounded bg-gray-200 text-black placeholder-gray-700 focus:outline-0 text-sm"
          placeholder={getPlaceholderText()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      {activeFilter === "language" && (
        <div className="mt-4 w-full xl:w-4/6 max-h-60 overflow-y-auto">
          {filteredLanguages.length > 0 ? (
            <ul className="space-y-2">
              {filteredLanguages.map((lang) => (
                <li key={lang.name}>
                  <button
                    onClick={() => handleLanguageSelect(lang.name)}
                    className={`w-full flex items-center p-2 hover:bg-gray-700 rounded ${
                      selectedLanguage === lang.name ? "bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={lang.color}>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm p-2 text-center">
              Nenhuma linguagem encontrada
            </p>
          )}
        </div>
      )}

      {activeFilter === "category" && (
        <div className="mt-4 w-full xl:w-4/6 max-h-60 overflow-y-auto">
          {selectedLanguage ? (
            filteredCategories.length > 0 ? (
              <ul className="space-y-2">
                {filteredCategories.map((cat) => (
                  <li key={cat.alias}>
                    <button
                      onClick={() => handleCategorySelect(cat.alias)}
                      className={`w-full flex items-center p-2 hover:bg-gray-700 rounded ${
                        selectedCategory === cat.alias ? "bg-gray-700" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm p-2 text-center">
                Nenhuma categoria encontrada
              </p>
            )
          ) : (
            <p className="text-gray-400 text-sm p-2 text-center">
              Selecione uma linguagem primeiro
            </p>
          )}
        </div>
      )}

      {(selectedLanguage || selectedCategory || searchTerm) && (
        <div className="mt-3 flex flex-col gap-2 w-full xl:w-4/6">
          {selectedLanguage && (
            <div className="p-2 bg-gray-700 rounded text-sm">
              Linguagem selecionada: {selectedLanguage}
              <button
                onClick={() => {
                  setSelectedLanguage(null);
                  setSelectedCategory(null);
                  setSearchTerm("");
                  setActiveFilter("language");
                }}
                className="float-right text-xs text-blue-400 hover:text-blue-300"
              >
                Alterar
              </button>
            </div>
          )}
          {selectedCategory && (
            <div className="p-2 bg-gray-700 rounded text-sm">
              Categoria selecionada: {selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm("");
                  setActiveFilter("category");
                }}
                className="float-right text-xs text-blue-400 hover:text-blue-300"
              >
                Alterar
              </button>
            </div>
          )}
          {selectedLanguage && selectedCategory && activeFilter === "name" && (
            <button
              onClick={handleApplyFilters}
              disabled={!searchTerm.trim()}
              className={`px-4 py-2 rounded ${
                searchTerm.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Buscar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

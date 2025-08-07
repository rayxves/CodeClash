import type { Language } from "../../../types/code";

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
}

export default function LanguageSelector({
  languages,
  selectedLanguage,
  setSelectedLanguage,
}: LanguageSelectorProps) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Linguagens disponíveis
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-5/6 h-4/6">
        {languages.map((lang) => (
          <button
            key={lang.name}
            onClick={() => {localStorage.setItem("language", lang.name); setSelectedLanguage(lang)}}
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
  );
}

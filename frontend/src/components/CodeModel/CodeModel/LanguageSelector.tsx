import type { Language } from "../../../types/code";
import Cookies from "js-cookie";

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
  const handleSelectedLanguage = (lang: Language) => {
    if (Cookies.get("language")) {
      Cookies.remove("language");
    }

    Cookies.set("language", lang.name, { expires: 1 });
    setSelectedLanguage(lang);
  };
  return (
    <div className="mb-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Linguagens disponíveis
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
        {languages.map((lang) => (
          <button
            key={lang.name}
            onClick={() => {
              handleSelectedLanguage(lang);
            }}
            className={`group flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all duration-300 hover:shadow-elegant ${
              selectedLanguage.name === lang.name
                ? "border-primary bg-primary/5 shadow-primary"
                : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <div
              className={`p-4 rounded-full ${lang.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              {lang.icon}
            </div>
            <span className="font-semibold text-card-foreground text-center">
              {lang.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

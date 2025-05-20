import { Stars } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";

interface NoCodeScreenProps {
  language?: string;
  name?: string;
  navigate: NavigateFunction;
}

export default function NoCodeScreen({ language, name, navigate }: NoCodeScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md p-6 bg-white rounded-xl shadow-md text-center">
        <Stars className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Nenhum código para analisar
        </h2>
        <p className="text-gray-600 mb-4">
          {language && name 
            ? "Não foi possível carregar o código modelo."
            : "Envie um código ou acesse um código modelo para receber recomendações."}
        </p>
        <button
          onClick={() => navigate(language && name ? `/code-model/${language}` : "/submission")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {language && name ? "Voltar" : "Ir para Submissão"}
        </button>
      </div>
    </div>
  );
}
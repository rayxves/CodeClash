import { Link, useNavigate } from "react-router-dom";

interface CodeHeaderProps {
  language: string;
  category: string;
  name: string;
}

export default function CodeHeader({
  language,
  category,
  name,
}: CodeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
      <Link
        to={`/code-model/${encodeURIComponent(language)}/${encodeURIComponent(
          category
        )}`}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group"
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
        <span className="whitespace-nowrap">Voltar</span>
      </Link>

      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        <button
          className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center shadow-sm hover:shadow-md active:scale-95"
          aria-label="Ver recomendações"
          onClick={() =>
            navigate(
              `/recommendations/${encodeURIComponent(
                language
              )}/${encodeURIComponent(name)}`
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Recomendações
        </button>
        <button
          className="px-3 py-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center shadow-sm hover:shadow-md active:scale-95"
          aria-label="Fazer nova submissão"
        >
          <Link to="/submission" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Submeter
          </Link>
        </button>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-2 rounded-2xl">
      <Link
        to={`/code-model/${encodeURIComponent(language)}/${encodeURIComponent(
          category
        )}`}
        className="flex items-center text-primary hover:text-primary/80 transition-all text-sm sm:text-base group "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform sm:mb-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium sm:pb-6">Voltar</span>
      </Link>

      <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
        <button
          className="px-4 py-2  text-sm bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-xl transition-all flex items-center font-medium hover-lift"
          aria-label="Ver recomendações"
          onClick={() =>
            navigate(
              `/recommendations/${encodeURIComponent(
                language
              )}/by-name/${encodeURIComponent(name)}`
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Recomendações
        </button>
        <button
          className="px-4 py-2 text-sm bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)] text-white hover:text-white rounded-xl transition-all flex items-center font-medium hover-lift"
          aria-label="Fazer nova submissão"
        >
          <Link to="/submission" className="flex items-center hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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

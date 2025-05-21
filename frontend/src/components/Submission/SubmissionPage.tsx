import { useState } from "react";
import {
  Play,
  ChevronDown,
  Terminal,
  Code2,
  Settings,
  Stars,
} from "lucide-react";
import MonacoEditor from "react-monaco-editor";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ExecutionOutput from "./ExecutionOutput";

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message?: string;
  status?: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: string;
}

const languages = [
  { name: "Python", id: "python", icon: <Code2 className="w-4 h-4" /> },
  { name: "C++", id: "cpp", icon: <Code2 className="w-4 h-4" /> },
  { name: "Java", id: "java", icon: <Code2 className="w-4 h-4" /> },
  { name: "C#", id: "csharp", icon: <Code2 className="w-4 h-4" /> },
];

export default function SubmissionPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here\n");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<Judge0Response | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<Judge0Response>(
        "http://localhost:5070/api/code/submit",
        {
          language: language,
          code: code,
          input: null,
        }
      );

      setOutput(response.data);
    } catch (error: any) {
      console.error("Submission error:", error);

      if (error.response?.data?.error) {
        setOutput({
          stderr: null,
          stdout: null,
          compile_output: null,
          message: error.response.data.error,
          status: {
            id: 13,
            description: "Error",
          },
        });
      } else {
        setOutput(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = () => {
    navigate(`/recommendations?code=${encodeURIComponent(code)}`);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 mt-16 px-1 sm:px-4 md:px-6 pb-10">
      <Link
        to="/"
        className="pt-4 pl-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group mb-5"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-4">
        <div className="flex flex-col w-full md:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">Code Playground</h2>
          </div>

          <div className="flex justify-between items-center w-full mb-2 md:hidden">
            <div className="relative w-32">
              <select
                className="appearance-none outline-none cursor-pointer bg-gray-800 border border-gray-700 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative group">
              <button
                onClick={handleGetRecommendations}
                className="flex items-center gap-2 bg-button hover:ring-1 hover:ring-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!code.trim()}
              >
                <Stars className="w-4 h-4" />
                <span className="whitespace-nowrap">Códigos similares</span>
              </button>
              {!code.trim() && (
                <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 right-0">
                  Escreva algum código para obter recomendações
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-2 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 w-full  sm:w-fit sm:px-4 md:hidden mt-2"
            >
              {isLoading ? (
                "Running..."
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="whitespace-nowrap">Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <select
              className="appearance-none outline-none cursor-pointer bg-gray-800 border border-gray-700 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setLanguage(e.target.value)}
              value={language}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative group">
            <button
              onClick={handleGetRecommendations}
              className="flex items-center gap-2 bg-button hover:ring-1 hover:ring-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!code.trim()}
            >
              <Stars className="w-4 h-4" />
              <span className="whitespace-nowrap">Ver códigos similares</span>
            </button>
            {!code.trim() && (
              <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2">
                Escreva algum código para obter recomendações
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              "Running..."
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="whitespace-nowrap">Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="border border-gray-800 rounded-lg overflow-hidden mx-3">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono">
              {languages.find((l) => l.id === language)?.name ?? "Python"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-gray-400" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-gray-800 text-sm rounded px-2 py-1 border border-gray-700 outline-none"
            >
              {[12, 14, 16, 18, 20].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </div>

        <MonacoEditor
          height="60vh"
          language={
            languages.find((l) => l.id === language)?.name.toLowerCase() ??
            "python"
          }
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 15, bottom: 15 },
          }}
        />
      </div>

      <div className="mt-6 border border-gray-800 rounded-lg overflow-hidden mx-3">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center">
          <Terminal className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-sm font-medium">Output</span>
        </div>
        <div className="bg-gray-900 p-4 font-mono text-sm min-h-[100px]">
          <ExecutionOutput result={output} />
        </div>
      </div>
    </div>
  );
}

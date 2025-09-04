import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Problem } from "../../types/problem";
import { Search, Star } from "lucide-react";
import { getProblems } from "../../api/services";
import Select from "react-select";
import ReactMarkdown from "react-markdown";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--muted))",
    borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
    boxShadow: "none",
    "&:hover": {
      borderColor: "hsl(var(--primary))",
    },
    "&:active": {
      backgroundColor: "hsl(var(--muted))",
      borderColor: "hsl(var(--primary))",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--muted))",
    border: "1px solid hsl(var(--border))",
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "hsl(var(--primary))"
      : state.isFocused
      ? "hsl(var(--primary)/0.2)"
      : "transparent",
    color: state.isSelected ? "white" : "hsl(var(--foreground))",
    "&:active": {
      backgroundColor: "hsl(var(--primary)/0.5)",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "hsl(var(--foreground)/0.7)",
    "&:hover": {
      color: "hsl(var(--foreground))",
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--border))",
  }),
};

const ProblemCardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="bg-muted h-5 w-16 rounded-md"></div>
      <div className="bg-muted h-5 w-20 rounded-full"></div>
    </div>
    <div className="bg-muted h-6 w-3/4 mb-3 rounded-md"></div>
    <div className="space-y-2 mb-4">
      <div className="bg-muted h-4 w-full rounded-md"></div>
      <div className="bg-muted h-4 w-full rounded-md"></div>
      <div className="bg-muted h-4 w-2/3 rounded-md"></div>
    </div>
    <div className="flex items-center justify-between mt-6">
      <div className="bg-muted h-6 w-24 rounded-full"></div>
      <div className="bg-primary/50 h-10 w-28 rounded-lg"></div>
    </div>
  </div>
);

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<string>("Dificuldade");
  const [categoryFilter, setCategoryFilter] = useState<string>("Categoria");

  const fetchProblems = useCallback(async () => {
    setError(null);
    try {
      const problemsData = await getProblems();
      setProblems(problemsData);
    } catch (err) {
      setError("Não foi possível carregar os problemas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchProblems();
  }, [fetchProblems]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "Dificuldade" ||
      difficultyFilter === "Todos" ||
      problem.difficulty === difficultyFilter;
    const matchesCategory =
      categoryFilter === "Categoria" ||
      categoryFilter === "Todas" ||
      problem.category === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = [
    "Todas",
    ...Array.from(new Set(problems.map((p) => p.category))),
  ];
  const difficulties = ["Todos", "Fácil", "Médio", "Difícil"];

  const handleSolveProblem = (problem: Problem) => {
    navigate(`/submission?problemId=${problem.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-surface pt-20 pb-8 px-4 sm:px-6 mt-5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Resolução de Problemas
          </h1>
          <p className="text-muted-foreground">
            Pratique suas habilidades resolvendo problemas de programação
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar problemas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div>
                <Select
                  options={difficulties.map((d) => ({ value: d, label: d }))}
                  value={{ value: difficultyFilter, label: difficultyFilter }}
                  onChange={(option) =>
                    setDifficultyFilter(option?.value || "")
                  }
                  styles={customStyles}
                  classNamePrefix="react-select"
                  maxMenuHeight={200}
                  menuPlacement="auto"
                />
              </div>
              <Select
                options={categories.map((d) => ({ value: d, label: d }))}
                value={{ value: categoryFilter, label: categoryFilter }}
                onChange={(option) => setCategoryFilter(option?.value || "")}
                styles={customStyles}
                classNamePrefix="react-select"
                maxMenuHeight={200}
                menuPlacement="auto"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProblemCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          #{problem.id}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-medium ${
                          problem.difficulty === "Fácil"
                            ? "text-green-600 bg-green-50 border-green-200"
                            : problem.difficulty === "Médio"
                            ? "text-amber-600 bg-amber-50 border-amber-200"
                            : "text-red-600 bg-red-50 border-red-200"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                        maxHeight: "4.5rem",
                      }}
                    >
                      <ReactMarkdown
                        components={{
                          h2: ({ ...props }) => (
                            <h2
                              className="text-lg font-bold text-gray-300 mt-20 mb-1"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p
                              className="text-muted-foreground leading-relaxed m-0"
                              style={{
                                display: "inline",
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {problem?.description || ""}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                      {problem.category}
                    </span>
                    <button
                      onClick={() => handleSolveProblem(problem)}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all hover-lift text-sm"
                    >
                      Resolver
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProblems.length === 0 && !isLoading && (
              <div className="text-center py-12 col-span-1 md:col-span-2 lg:col-span-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Nenhum problema encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar seus filtros de busca
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
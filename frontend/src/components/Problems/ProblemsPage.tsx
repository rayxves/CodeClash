import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { getProblems } from "../../api/services";
import type { Problem } from "../../types/problem";
import ProblemCard from "./ProblemCard";
import ProblemCardSkeleton from "./ProblemCardSkeleton";
import Filters from "./Filters";
import { Search } from "lucide-react";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--muted))",
    cursor: "pointer",
    borderRadius: "0.3rem",
    borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
    boxShadow: "none",
    "&:hover": { borderColor: "hsl(var(--primary))" },
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
    "&:active": { backgroundColor: "hsl(var(--primary)/0.5)" },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "hsl(var(--foreground))",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "hsl(var(--foreground)/0.7)",
    "&:hover": { color: "hsl(var(--foreground))" },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "hsl(var(--border))",
  }),
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("Dificuldade");
  const [categoryFilter, setCategoryFilter] = useState("Todas as categorias");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchProblems = useCallback(async () => {
    setError(null);
    try {
      const problemsData = await getProblems();
      setProblems(problemsData);
    } catch {
      setError("Não foi possível carregar os problemas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchProblems();
  }, [fetchProblems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        problem.title
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        problem.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "Dificuldade" ||
        difficultyFilter === "Todos" ||
        problem.difficulty === difficultyFilter;

      const matchesCategory =
        categoryFilter === "Todas as categorias" ||
        problem.category === categoryFilter;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, debouncedSearchTerm, difficultyFilter, categoryFilter]);

  const categories = useMemo(
    () => [...Array.from(new Set(problems.map((p) => p.category)))],
    [problems]
  );
  const difficulties = useMemo(
    () => ["Todos", "Fácil", "Médio", "Difícil"],
    []
  );

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

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          difficulties={difficulties}
          categories={categories}
          customStyles={customStyles}
        />

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
                <ProblemCard key={problem.id} problem={problem} />
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

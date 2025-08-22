import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placehoder: string
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placehoder
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placehoder}
        className="block w-full pl-12 pr-4 py-4 text-card-foreground bg-card border-2 border-border rounded-2xl shadow-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar algoritmos por nome"
      />
    </div>
  );
}

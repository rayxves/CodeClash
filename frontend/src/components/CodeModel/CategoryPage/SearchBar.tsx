import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar algoritmos..."
        className="block w-full pl-10 pr-3 py-2 text-gray-900 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar algoritmos por nome"
      />
    </div>
  );
}

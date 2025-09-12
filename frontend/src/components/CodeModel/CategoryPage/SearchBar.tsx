import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placehoder: string;
  onDebouncedSearch?: (term: string) => void;
}

export default function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  placehoder, 
  onDebouncedSearch 
}: SearchBarProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchTerm(debouncedSearch);
    if (onDebouncedSearch) {
      onDebouncedSearch(debouncedSearch);
    }
  }, [debouncedSearch, setSearchTerm, onDebouncedSearch]);

  return (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <input
        type="text"
        placeholder={placehoder}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-card rounded-2xl border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-card transition-all"
      />
    </div>
  );
}
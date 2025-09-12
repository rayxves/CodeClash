import Select from "react-select";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  difficulties: string[];
  categories: string[];
  customStyles: any;
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  difficultyFilter,
  setDifficultyFilter,
  categoryFilter,
  setCategoryFilter,
  difficulties,
  categories,
  customStyles,
}: Props) {
  return (
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
              onChange={(option) => setDifficultyFilter(option?.value || "")}
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
            classNamePrefix="react-select cursor-pointer"
            maxMenuHeight={200}
            menuPlacement="auto"
          />
        </div>
      </div>
    </div>
  );
}

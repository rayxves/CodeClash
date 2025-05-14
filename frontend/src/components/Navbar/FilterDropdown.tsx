"use client";
import { Search } from "lucide-react";

interface FilterDropdownProps {
  filterOpen: string | null;
  toggleFilter: (filterType: string) => void;
}

export default function FilterDropdown({
  filterOpen,
  toggleFilter,
}: FilterDropdownProps) {
  return (
    <div className="bg-navbar w-full shadow-md  rounded-md p-4 z-50 text-sm text-whitesmoke xl:flex xl:flex-col xl:items-center">
        {filterOpen && (
        <div className="mb-3 flex items-center bg-gray-200 py-2 px-2 rounded border-gray-300 hover:shadow hover:shadow-gray-100/50 xl:w-4/6">
          <Search className="text-gray-700 w-4 h-4" />
          <input
            className="w-full pl-2 border rounded bg-gray-200 text-black placeholder-gray-700 focus:outline-0  text-sm"
            placeholder={`Buscar por ${filterOpen}`}
          />
        </div>
      )}
      <div className="flex items-center gap-2 xl:w-4/6">
        {["name", "category", "language"].map((type) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className=" w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded "
          >
            {type === "name" && "Nome"}
            {type === "category" && "Categoria"}
            {type === "language" && "Linguagem"}
          </button>
        ))}
      </div>

      
    </div>
  );
}

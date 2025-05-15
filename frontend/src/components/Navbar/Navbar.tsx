"use client";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { Filter, Menu } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import logo from "../../assets/logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (!prev) setFilterOpen(null);
      return !prev;
    });
  };

  const toggleFilter = (filterType: string) => {
    setFilterOpen((prev) => {
      if (prev !== filterType) setMenuOpen(false);
      return prev === filterType ? null : filterType;
    });
  };

  return (
    <nav className="w-full shadow-sm bg-navbar fixed top-0 left-0 z-50 ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img src={logo} alt="CodeClash Logo" className="w-44" />

        <div className="md:hidden flex items-end gap-6">
          <button
            onClick={() => toggleFilter("name")}
            className="flex items-center gap-2 text-sm font-medium  text-whitesmoke"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>

          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            className=" text-whitesmoke"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <DesktopMenu toggleFilter={toggleFilter}  />
      </div>

      {filterOpen && (
        <div className="hidden md:block relative">
          <FilterDropdown filterOpen={filterOpen} toggleFilter={toggleFilter} />
        </div>
      )}

      {filterOpen && (
        <div className="md:hidden relative">
          <FilterDropdown filterOpen={filterOpen} toggleFilter={toggleFilter} />
        </div>
      )}
      {menuOpen && (
        <div className="md:hidden relative">
          <MobileMenu toggleMenu={toggleMenu} />
        </div>
      )}
    </nav>
  );
}

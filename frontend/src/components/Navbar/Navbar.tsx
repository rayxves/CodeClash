import { useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { Lightbulb, Menu } from "lucide-react";
import SearchDropdown from "./SearchDropdown";
import logo from "../../assets/logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (!prev) setSearchType(null);
      return !prev;
    });
  };

  const toggleSearch = (type: string | null) => {
    setSearchType((prev) => {
      if (prev !== type) setMenuOpen(false);
      return prev === type ? null : type;
    });
  };

  return (
    <nav className="w-full shadow-sm bg-navbar fixed top-0 left-0 z-50 ">
      <div className="container px-2 sm:px-4 py-4 flex items-center justify-between min-w-full">
        <img src={logo} alt="CodeClash Logo" className="w-44" />

        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => toggleSearch("name")}
            className="flex gap-1 text-sm font-medium  text-whitesmoke"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Busca rápida</span>
          </button>

          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            className=" text-whitesmoke flex items-center"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <DesktopMenu toggleFilter={toggleSearch} />
      </div>

      {searchType && (
        <div className="hidden lg:block relative">
          <SearchDropdown
            onNavigation={() => {
              setMenuOpen(false);
              setSearchType(null);
            }}
          />
        </div>
      )}

      {searchType && (
        <div className="lg:hidden relative">
          <SearchDropdown
            onNavigation={() => {
              setMenuOpen(false);
              setSearchType(null);
            }}
          />
        </div>
      )}
      {menuOpen && (
        <div className="lg:hidden relative">
          <MobileMenu toggleMenu={toggleMenu} />
        </div>
      )}
    </nav>
  );
}

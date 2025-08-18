import { useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { Menu } from "lucide-react";
import SearchDropdown from "./SearchDropdown";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (!prev) setSearchType(null);
      return !prev;
    });
  };

  return (
    <nav className="w-full  bg-card/95 backdrop-blur-lg fixed top-0 left-0 z-50">
      <div className="container px-4 sm:px-6 py-4 flex items-center justify-between min-w-full">
        <div className="flex items-center gap-3">
          <h1 className="font-[arial] font-bold text-xl sm:text-2xl gradient-navbar">
            CodeClash
          </h1>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            className="text-foreground hover:text-primary bg-secondary/50 hover:bg-secondary p-2 rounded-lg transition-all hover-lift"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <DesktopMenu />
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
        <div className="lg:hidden relative ">
          <MobileMenu toggleMenu={toggleMenu} />
        </div>
      )}
    </nav>
  );
}

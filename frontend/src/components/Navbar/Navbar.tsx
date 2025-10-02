import { useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { Code2, Menu } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="w-full bg-card/95 backdrop-blur-lg border-b border-border/50 fixed top-0 left-0 z-40 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-end h-full gap-2">
            <div className="flex items-center justify-center w-10 h-8 bg-primary/10 rounded-lg">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-bold text-xl text-end sm:text-2xl gradient-navbar">
              CodeClash
            </h1>
          </div>

          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            className="lg:hidden p-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          <DesktopMenu />
        </div>
      </nav>

      {menuOpen && <MobileMenu toggleMenu={toggleMenu} />}

      <div className="h-16"></div>
    </>
  );
}

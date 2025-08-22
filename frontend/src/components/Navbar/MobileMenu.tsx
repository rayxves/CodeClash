"use client";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface MobileMenuProps {
  toggleMenu: () => void;
}

export default function MobileMenu({ toggleMenu }: MobileMenuProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="absolute top-full right-0 mt-0  bg-card/95  rounded-b-md shadow-md py-4 pt-0 px-6  text-whitesmoke text-right w-fit z-50">
      <div className="flex justify-end mb-2">
        <button onClick={toggleMenu} aria-label="Fechar menu">
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex flex-col w-full space-y-4 mt-6 text-sm font-medium text-center">
        <a
          href="/"
          className="bg-secondary rounded hover:bg-muted-foreground/40  shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Home
        </a>
        <a
          href="/problems"
          className="bg-secondary rounded hover:bg-muted-foreground/40  shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Problemas
        </a>
        <a
          href="/code-model"
          className="bg-secondary rounded hover:bg-muted-foreground/40 shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Códigos Modelo
        </a>
        <a
          href="/about"
          className="bg-secondary rounded hover:bg-muted-foreground/40  shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
        >
          Sobre
        </a>

        {isAuthenticated ? (
          <>
            <a
              href="/profile"
              className="bg-secondary rounded hover:bg-muted-foreground/40  shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
            >
              Perfil ({user?.username})
            </a>
            <a
              href="/submission"
              className="bg-button hover:bg-buttonhover/90 text-whitesmoke hover:text-muted  px-4 py-2 rounded-md text-center hover:cursor-pointer"
            >
              Submeter
            </a>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="bg-secondary rounded hover:bg-muted-foreground/40  shadow-md w-full py-2 px-8 sm:px-12 hover:cursor-pointer"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-button hover:bg-buttonhover/90 text-whitesmoke hover:text-muted px-4 py-2 rounded-md text-center hover:cursor-pointer"
            >
              Registrar
            </a>
          </>
        )}
      </nav>
    </div>
  );
}

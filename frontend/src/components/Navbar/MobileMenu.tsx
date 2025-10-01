"use client";
import { BookOpen, Code2, FileCode, Home, LogIn, Upload, User, UserPlus, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface MobileMenuProps {
  toggleMenu: () => void;
}

export default function MobileMenu({ toggleMenu }: MobileMenuProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-card shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold gradient-navbar">Menu</h2>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-muted rounded-lg transition-all"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </a>
          <a
            href="/problems"
            className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
          >
            <Code2 className="w-5 h-5" />
            <span>Problemas</span>
          </a>
          <a
            href="/code-model"
            className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
          >
            <FileCode className="w-5 h-5" />
            <span>Códigos Modelo</span>
          </a>
          <a
            href="/about"
            className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
          >
            <BookOpen className="w-5 h-5" />
            <span>Sobre</span>
          </a>

          <div className="my-2 border-t border-border"></div>

          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
              >
                <User className="w-5 h-5" />
                <span>Perfil ({user?.username})</span>
              </a>
              <a
                href="/submission"
                className="flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium shadow-lg shadow-primary/20"
              >
                <Upload className="w-5 h-5" />
                <span>Submeter Código</span>
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-all font-medium"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </a>
              <a
                href="/register"
                className="flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium shadow-lg shadow-primary/20"
              >
                <UserPlus className="w-5 h-5" />
                <span>Registrar</span>
              </a>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

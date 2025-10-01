import { Home, BookOpen, Code2, FileCode, User, Upload, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function DesktopMenu() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="hidden lg:flex items-center gap-2">
      <a
        href="/"
        className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium group"
      >
        <Home className="w-4 h-4" />
        <span>Início</span>
      </a>
      <a
        href="/about"
        className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium"
      >
        <BookOpen className="w-4 h-4" />
        <span>Sobre</span>
      </a>
      <a
        href="/problems"
        className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium"
      >
        <Code2 className="w-4 h-4" />
        <span>Problemas</span>
      </a>
      <a
        href="/code-model"
        className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium"
      >
        <FileCode className="w-4 h-4" />
        <span>Códigos</span>
      </a>

      <div className="ml-2 h-8 w-px bg-border"></div>

      {isAuthenticated ? (
        <>
          <a
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium"
          >
            <User className="w-4 h-4" />
            <span>{user?.username}</span>
          </a>
          <a
            href="/submission"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>Submeter</span>
          </a>
        </>
      ) : (
        <>
          <a
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-medium"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </a>
          <a
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar</span>
          </a>
        </>
      )}
    </div>
  );
}

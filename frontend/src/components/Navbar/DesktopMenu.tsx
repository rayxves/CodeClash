import { useAuth } from '../../contexts/AuthContext';

export default function DesktopMenu() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="hidden lg:flex items-center gap-6">
      <a
        href="/"
        className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
      >
        Início
      </a>
      <a
        href="/about"
        className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
      >
        Sobre
      </a>
      <a
        href="/problems"
        className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
      >
        Problemas
      </a>
      <a
        href="/code-model"
        className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
      >
        Códigos
      </a>
      
      {isAuthenticated ? (
        <>
          <a
            href="/profile"
            className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
          >
            Perfil ({user?.username})
          </a>
          <a
            href="/submission"
            className="px-4 py-2 bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-lg transition-all font-medium"
          >
            Submeter código
          </a>
        </>
      ) : (
        <>
          <a
            href="/login"
            className="text-foreground/80 hover:text-foreground transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full font-medium"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-4 py-2 bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-lg transition-all font-medium"
          >
            Registrar
          </a>
        </>
      )}
    </div>
  );
}

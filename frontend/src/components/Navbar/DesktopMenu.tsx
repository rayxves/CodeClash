export default function DesktopMenu() {
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
      <a
        href="/submission"
        className="px-4 py-2 bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-lg transition-all font-medium "
      >
        Submeter código
      </a>
    </div>
  );
}

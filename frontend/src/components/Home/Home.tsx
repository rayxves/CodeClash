import { Code2, BookOpen, Target } from "lucide-react";
import CodeBlock from "./CodeBlock";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground">
      <section className="py-24 px-4 mt-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 max-w-7xl">
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Desafie seus conhecimentos e{" "}
              <span className="gradient-text">desenvolva suas habilidades</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
              Uma plataforma completa para resolver problemas algorítmicos,
              explorar códigos-modelo clássicos e receber feedback instantâneo.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/problems"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Explorar Problemas
              </a>
              <a
                href="/about"
                className="px-6 py-3 bg-secondary hover:bg-muted text-foreground rounded-lg transition-all font-medium flex items-center gap-2 group"
              >
                Saiba mais
                <svg
                  className="group-hover:translate-x-1 transition-transform"
                  width="20"
                  height="20"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.13 8.5L6.87 4.24L5.87 5.24L9.13 8.5L5.87 11.76L6.87 12.76L11.13 8.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6 animate-slide-up">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">
                    Submissão de Código
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Resolva problemas em C#, Python, Java ou C++ com validação
                    automática e feedback instantâneo.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">
                    Arena de Problemas
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Explore desafios de diferentes níveis e categorias.
                    Acompanhe suas soluções e conquiste pontos.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">
                    Biblioteca de Códigos
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Navegue por algoritmos e estruturas de dados clássicas,
                    organizados em árvore hierárquica por linguagem e categoria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center items-center py-16 px-4">
        <CodeBlock />
      </div>

      <footer className="py-12 text-center border-t border-border bg-card/20">
        <p className="text-muted-foreground">© 2025 CodeClash. rayxves.</p>
        <p className="text-muted-foreground text-sm mt-2">
          Projeto acadêmico de estudo de arquitetura de software
        </p>
      </footer>
    </div>
  );
}

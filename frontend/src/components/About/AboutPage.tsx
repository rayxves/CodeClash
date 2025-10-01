import {
  Code,
  Send,
  Rocket,
  Trophy,
  BookOpen,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background px-4 sm:px-6 py-16 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <Rocket className="relative w-12 h-12 sm:w-14 sm:h-14 text-primary mr-3" />
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-navbar">
              CodeClash
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto text-muted-foreground leading-relaxed">
            Sua plataforma completa para{" "}
            <strong className="font-bold text-primary">
              dominar algoritmos
            </strong>{" "}
            , resolver desafios e evoluir suas habilidades de programação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-primary/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Submissão de Código
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Resolva problemas em <strong>C#, Python, Java ou C++</strong>{" "}
                  com validação automática via Judge0. Feedback sobre erros de
                  compilação, tempo de execução e corretude.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-amber-500/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Arena de Problemas
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Desafios de <strong>diferentes níveis e categorias</strong>.
                  Todas suas soluções ficam salvas no perfil para acompanhar sua
                  evolução.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-emerald-500/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Biblioteca de Códigos
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Navegue por <strong>algoritmos e estruturas de dados</strong>{" "}
                  clássicas, organizadas em árvore hierárquica por linguagem e
                  categoria.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-violet-500/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-violet-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Recomendações Inteligentes
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receba <strong>sugestões de algoritmos relacionados</strong>{" "}
                  ao código que você submete para expandir seu conhecimento.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-pink-500/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-pink-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Perfil e Progresso
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Acompanhe sua <strong>evolução, pontuação total</strong> e
                  histórico completo de submissões em um perfil personalizado.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-border hover:border-blue-500/50 transition-all hover-lift group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">
                  Múltiplas Linguagens
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Suporte para <strong>Python, Java, C++ e C#</strong>. Escolha
                  sua linguagem favorita e explore algoritmos em diferentes
                  sintaxes.
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="text-center animate-slide-up">
          <div className="max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-violet-500/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-card/70 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-border/50">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-card-foreground">
                Projeto Acadêmico
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Este projeto nasceu como{" "}
                <strong className="text-card-foreground">
                  trabalho acadêmico
                </strong>{" "}
                , mas evoluiu para um{" "}
                <strong className="text-primary">
                  espaço de aprendizado contínuo
                </strong>
                , onde pratico, aplico e compartilho conhecimentos em
                programação e algoritmos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/rayxves/CodeClash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Ver no GitHub</span>
                </a>
                <a
                  href="/problems"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary hover:bg-muted text-foreground font-semibold rounded-xl shadow-lg transition-all hover:-translate-y-1"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Code,
  Send,
  Filter,
  LayoutDashboard,
  Rocket,
  Trophy,
  BookOpen,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-surface px-4 sm:px-6 py-16 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <Rocket className="relative w-14 h-14 text-primary mr-4 " />
            <h1 className="relative text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary-foreground/70 bg-clip-text text-transparent">
              Code Clash
            </h1>
          </div>
          <p className="text-xl lg:text-2xl max-w-4xl mx-auto text-muted-foreground leading-relaxed">
            Sua plataforma completa para{" "}
            <strong className="font-bold text-primary">
              dominar algoritmos
            </strong>
            , resolver desafios e evoluir suas habilidades de programação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16 ">
          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-primary/30 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10"></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:scale-110  shadow-lg">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Submissões de Código
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Envie seus códigos para{" "}
              <strong className="text-card-foreground">
                avaliação automática
              </strong>{" "}
              com <strong className="text-primary">Judge0</strong>. Receba
              feedback instantâneo, identifique erros e melhore suas habilidades
              com análise em tempo real.
            </p>
          </section>

          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-secondary/30 group overflow-hidden ">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 "></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl group-hover:scale-110   shadow-lg">
                <Trophy className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Resolva Problemas
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Crie sua conta e resolva{" "}
              <strong className="text-card-foreground">
                problemas em diferentes níveis de dificuldade
              </strong>
              . Cada solução fica{" "}
              <strong className="text-secondary-foreground">
                salva no seu perfil
              </strong>
              , permitindo acompanhar sua evolução e revisar seu progresso
            </p>
          </section>

          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-accent/30 group overflow-hidden ">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 "></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl group-hover:scale-110   shadow-lg">
                <Code className="w-7 h-7 text-card-foreground" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Modelos de Código
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Acesse códigos modelo de algoritmos clássicos em{" "}
              <strong className="text-accent">Python, Java, C++ e C#</strong>.
              Explore de forma{" "}
              <strong className="text-card-foreground">interativa</strong>{" "}
              através de categorias ou visualização em árvore.
            </p>
          </section>

          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-primary/30 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 "></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:scale-110  shadow-lg">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Recomendações Inteligentes
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Receba{" "}
              <strong className="text-primary">sugestões personalizadas</strong>{" "}
              de algoritmos com base no seu histórico de estudos e submissões.
              Aprenda de forma direcionada e eficiente.
            </p>
          </section>

          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-secondary/30 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10"></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl group-hover:scale-110  shadow-lg">
                <Filter className="w-7 h-7 text-card-foreground" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Busca Avançada
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Encontre algoritmos rapidamente escolhendo{" "}
              <strong className="text-secondary-foreground">
                categoria e linguagem
              </strong>
              . Navegação intuitiva para otimizar seu tempo de estudo.
            </p>
          </section>

          <section className="relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-border hover:border-accent/30 group overflow-hidden ">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 "></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl group-hover:scale-110  shadow-lg">
                <LayoutDashboard className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl  font-bold text-card-foreground">
                Navegação Interativa
              </h2>
            </div>
            <p className="relative text-muted-foreground text-lg leading-relaxed">
              Escolha entre{" "}
              <strong className="text-accent">
                visualização em categorias
              </strong>{" "}
              ou{" "}
              <strong className="text-card-foreground">
                estrutura em árvore
              </strong>{" "}
              para explorar o conteúdo da maneira que preferir.
            </p>
          </section>
        </div>

        <div className="text-center mt-20">
          <div className="max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-card/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-border/50">
              <div className="flex justify-center mb-8">
                <BookOpen className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground text-xl mb-10 leading-relaxed">
                Este projeto nasceu como{" "}
                <strong className="text-card-foreground">
                  trabalho acadêmico
                </strong>
                , mas evoluiu para um{" "}
                <strong className="text-primary">
                  espaço de aprendizado contínuo
                </strong>
                , onde pratico, aplico e compartilho conhecimentos em
                programação e algoritmos.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <a
                  href="https://github.com/rayxves/CodeClash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-2xl shadow-xl hover:shadow-2xl  tra hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 "></div>
                  <svg
                    className="relative w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="relative">Ver no GitHub</span>
                </a>
                <a
                  href="/code-model"
                  className="group relative overflow-hidden flex items-center justify-center gap-3 px-10 py-5 border-2 border-primary text-primary hover:bg-white/10 hover:text-primary-foreground font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <span className="relative">Começar agora</span>
                  <Rocket className="relative w-6 h-6 group-hover:animate-float duration-75" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

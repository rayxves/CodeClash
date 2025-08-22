import { Code, Send, Filter, LayoutDashboard, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-surface px-4 sm:px-6 py-16 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <Rocket className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Code Clash
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-muted-foreground">
            Bem-vindo ao{" "}
            <strong className="font-semibold text-primary">Code Clash</strong> —
            seu campo de batalha para dominar algoritmos, superar desafios e
            acelerar seu aprendizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <section className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-border hover:border-primary/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
                Submissão de Questões
              </h2>
            </div>
            <p className="text-muted-foreground sm:text-lg leading-relaxed">
              Envie seus códigos para avaliação automática com feedback
              instantâneo. Identifique erros, aprenda com correções e melhore
              suas habilidades na prática.
            </p>
          </section>

          <section className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-border hover:border-secondary/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                <Code className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
                Modelos de Código
              </h2>
            </div>
            <p className="text-muted-foreground sm:text-lg leading-relaxed">
              Acesse{" "}
              <a
                href="/code-model"
                className="text-secondary-foreground hover:underline font-medium transition-colors"
              >
                códigos modelo
              </a>{" "}
              de algoritmos clássicos - desde ordenação até programação dinâmica
              - disponíveis em
              <strong className="text-secondary-foreground">
                {" "}
                Python
              </strong>,{" "}
              <strong className="text-secondary-foreground">Java</strong>,
              <strong className="text-secondary-foreground"> C++</strong> e{" "}
              <strong className="text-secondary-foreground">C#</strong>.
            </p>
          </section>

          <section className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-border hover:border-accent/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                <Filter className="w-6 h-6 text-card-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
                Busca Inteligente
              </h2>
            </div>
            <p className="text-muted-foreground sm:text-lg leading-relaxed">
              Encontre algoritmos facilmente buscando por{" "}
              <em className="text-accent font-medium">nome</em>,
              <em className="text-accent font-medium"> categoria</em> e{" "}
              <em className="text-accent font-medium">linguagem</em>. Navegação
              simplificada para seu aprendizado.
            </p>
          </section>

          <section className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all border border-border hover:border-primary/20 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
                Acesso Imediato
              </h2>
            </div>
            <p className="text-muted-foreground sm:text-lg leading-relaxed">
              Comece a usar agora mesmo, sem cadastro. Nosso foco é 100% no seu
              aprendizado.
            </p>
          </section>
        </div>

        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto bg-card/60 backdrop-blur-sm p-8 rounded-2xl shadow-card border border-border">
            <p className="text-muted-foreground text-lg sm:text-xl mb-8 leading-relaxed">
              Esse projeto foi desenvolvido como parte de um trabalho da
              faculdade, mas também é um espaço pessoal onde aplico, pratico e
              evoluo meus conhecimentos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/rayxves/CodeClash"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-primary hover:shadow-glow text-primary-foreground font-medium rounded-xl transition-all hover-lift"
              >
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver no GitHub
              </a>
              <a
                href="/code-model"
                className="flex items-center justify-center gap-3 px-8 py-4 border border-primary text-primary hover:bg-primary/5 font-medium rounded-xl transition-all hover-lift"
              >
                Começar agora
                <Rocket className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center bg-primary/10 text-primary text-sm font-semibold px-6 py-3 rounded-full shadow-inner">
                Feito com 💙
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              Uma plataforma para você submeter, explorar e aprender com códigos
              e algoritmos. Aprimore seus conhecimentos e avance no seu caminho
              como programador.
            </p>
            <a
              href="about"
              className="text-primary font-semibold flex items-center hover:text-primary/80 transition-all group text-lg"
            >
              Saiba mais
              <svg
                className="ml-2 group-hover:translate-x-1 transition-transform"
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

          <div className="lg:w-1/2 space-y-6 animate-slide-up">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-primary-foreground"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 5 9 4V3m5 2 1-1V3m-3 6v11m0-11a5 5 0 0 1 5 5m-5-5a5 5 0 0 0-5 5m5-5a4.959 4.959 0 0 1 2.973 1H15V8a3 3 0 0 0-6 0v2h.027A4.959 4.959 0 0 1 12 9Zm-5 5H5m2 0v2a5 5 0 0 0 10 0v-2m2.025 0H17m-9.975 4H6a1 1 0 0 0-1 1v2m12-3h1.025a1 1 0 0 1 1 1v2M16 11h1a1 1 0 0 0 1-1V8m-9.975 3H7a1 1 0 0 1-1-1V8"
                    />
                  </svg>
                </div>
                <p className="text-foreground leading-relaxed">
                  Submeta seu código, receba feedback instantâneo e ajuste seu
                  algoritmo conforme necessário.
                </p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 100 100"
                  >
                    <g>
                      <g>
                        <path
                          d="M47.6,20.1c-9.8,1.1-17.7,8.8-18.5,18.4c-0.6,7,2.5,13.4,7.5,17.5c1.5,1.2,2.4,3,2.4,4.9v0.1
              c0,2.8,2.3,5.1,5.2,5.1h11.6c2.9,0,5.2-2.3,5.2-5.1v-0.1c0-1.9,0.9-3.7,2.4-4.9C68,52.2,71,46.6,71,40.3
              C71,28.3,60.3,18.8,47.6,20.1z"
                        />
                      </g>
                      <g>
                        <path d="M59,72H41c-1.1,0-2,0.9-2,2c0,3.3,2.7,6,6,6h10c3.3,0,6-2.7,6-6C61,72.9,60.1,72,59,72z" />
                      </g>
                    </g>
                  </svg>
                </div>
                <p className="text-foreground leading-relaxed">
                  Busque por linguagem, categoria ou nome do algoritmo. Acesse
                  soluções rápidas e organizadas.
                </p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border hover:shadow-elegant transition-all hover-lift" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>language_xml</title>
                    <rect width="24" height="24" fill="none" />
                    <path d="M12.89,3l2,.4L11.11,21l-2-.4L12.89,3m6.7,9L16,8.41V5.58L22.42,12,16,18.41V15.58L19.59,12m-18,0L8,5.58V8.41L4.41,12,8,15.58v2.83Z" />
                  </svg>
                </div>
                <p className="text-foreground leading-relaxed">
                  Explore algoritmos parecidos para entender outras abordagens e
                  expandir seu raciocínio lógico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full flex justify-center items-center py-16">
        <CodeBlock />
      </div>
      
      <footer className="py-12 text-center border-t border-border bg-card/20">
        <p className="text-muted-foreground">© 2025 CodeClash. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

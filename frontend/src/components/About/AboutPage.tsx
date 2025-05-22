import { Code, Send, Filter, LayoutDashboard, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 px-4 sm:px-6 py-16 pt-24 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Rocket className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Code Clash
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700">
            Bem-vindo ao{" "}
            <strong className="font-semibold text-blue-600">Code Clash</strong>{" "}
            — seu campo de batalha para dominar algoritmos, superar desafios e
            acelerar seu aprendizado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Submissão de Questões
              </h2>
            </div>
            <p className="text-gray-600 sm:text-lg">
              Envie seus códigos para avaliação automática com feedback
              instantâneo. Identifique erros, aprenda com correções e melhore
              suas habilidades na prática.
            </p>
          </section>

          <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-purple-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Modelos de Código
              </h2>
            </div>
            <p className="text-gray-600 sm:text-lg">
              Acesse{" "}
              <a
                href="/code-model"
                className="text-purple-600 hover:underline font-medium"
              >
                códigos modelo
              </a>{" "}
              de algoritmos clássicos - desde ordenação até programação dinâmica
              - disponíveis em
              <strong className="text-purple-600"> Python</strong>,{" "}
              <strong className="text-purple-600">Java</strong>,
              <strong className="text-purple-600"> C++</strong> e{" "}
              <strong className="text-purple-600">C#</strong>.
            </p>
          </section>

          <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Busca Inteligente
              </h2>
            </div>
            <p className="text-gray-600 sm:text-lg">
              Encontre algoritmos facilmente buscando por{" "}
              <em className="text-green-600">nome</em>,
              <em className="text-green-600"> categoria</em> e{" "}
              <em className="text-green-600">linguagem</em>. Navegação
              simplificada para seu aprendizado.
            </p>
          </section>

          <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-yellow-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Acesso Imediato
              </h2>
            </div>
            <p className="text-gray-600 sm:text-lg">
              Comece a usar agora mesmo, sem cadastro. Nosso foco é 100% no seu
              aprendizado.
            </p>
          </section>
        </div>

        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200">
            <p className="text-gray-700 text-lg sm:text-xl mb-6">
              Esse projeto foi desenvolvido como parte de um trabalho da
              faculdade, mas também é um espaço pessoal onde aplico, pratico e
              evoluo meus conhecimentos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://github.com/rayxves/CodeClash"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow hover:shadow-md"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
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
                className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all"
              >
                Começar agora
                <Rocket className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full shadow-inner">
                Feito com 💙
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

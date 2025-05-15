import { Code, Send, Filter, LayoutDashboard } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-6 py-16 pt-24 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-button mb-12 text-center">
          Code Clash
        </h1>
        <p className="text-xl mb-6">
          Bem-vindo ao <strong>Code Clash</strong> — um campo de batalha para
          quem curte algoritmos, desafios e aprendizado. 🎯
        </p>
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Send className="text-blue-600" />
              <h2 className="text-2xl font-semibold">Submeta Questões</h2>
            </div>
            <p>
              Aqui, você pode submeter questões que são avaliadas
              automaticamente com feedback instantâneo. Entenda onde errou e
              aprenda com a prática.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Code className="text-purple-600" />
              <h2 className="text-2xl font-semibold">Modelos de Código</h2>
            </div>
            <p>
              E se bater aquela dúvida, você pode consultar{" "}
              <a href="/code-model">códigos modelo</a> de algoritmos clássicos —
              ordenação, busca, programação dinâmica e mais — tudo isso em{" "}
              <strong>C++</strong>, <strong>Java</strong>, <strong>C#</strong> e{" "}
              <strong>Python</strong>.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-green-600" />
              <h2 className="text-2xl font-semibold">Filtros </h2>
            </div>
            <p>
              Os algoritmos são organizados em filtros: busque por <em>nome</em>
              , <em>categoria</em>, <em>linguagem</em>, ou qualquer combinação
              dessas opções. Encontrar o que você precisa nunca foi tão fácil.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="text-yellow-600" />
              <h2 className="text-2xl font-semibold">Sem Login, Sem Fricção</h2>
            </div>
            <p>
              Entre, use, aprenda. Sem necessidade de cadastro. A experiência é
              100% focada no conteúdo.
            </p>
          </section>
        </div>

        <div className="text-center mt-12">
          <p className=" text-md sm:text-lg mb-4">
            Esse projeto foi desenvolvido como parte de um trabalho da
            faculdade, mas também é um espaço pessoal onde aplico, pratico e
            evoluo meus conhecimentos.
          </p>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 mt-2 rounded-full">
            Feito com 💙
          </span>
        </div>
      </div>
    </div>
  );
}

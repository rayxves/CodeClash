import { Link, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeString = {
  name: "QueueUsingTwoStacks",
  category: "others",
  language: "Java",
  code: "package com.thealgorithms.others;\n\nimport java.util.Stack;\n\n/**\n * This implements Queue using two Stacks.\n *\n * <p>\n * Big O Runtime: insert(): O(1) remove(): O(1) amortized isEmpty(): O(1)\n *\n * <p>\n * A queue data structure functions the same as a real world queue. The elements\n * that are added first are the first to be removed. New elements are added to\n * the back/rear of the queue.\n *\n * @author sahilb2 (https://www.github.com/sahilb2)\n */\npublic class QueueUsingTwoStacks {\n    private final Stack<Object> inStack;\n    private final Stack<Object> outStack;\n\n    /**\n     * Constructor\n     */\n    public QueueUsingTwoStacks() {\n        this.inStack = new Stack<>();\n        this.outStack = new Stack<>();\n    }\n\n    /**\n     * Inserts an element at the rear of the queue\n     *\n     * @param x element to be added\n     */\n    public void insert(Object x) {\n        // Insert element into inStack\n        this.inStack.push(x);\n    }\n\n    /**\n     * Remove an element from the front of the queue\n     *\n     * @return the new front of the queue\n     */\n    public Object remove() {\n        if (this.outStack.isEmpty()) {\n            // Move all elements from inStack to outStack (preserving the order)\n            while (!this.inStack.isEmpty()) {\n                this.outStack.push(this.inStack.pop());\n            }\n        }\n        return this.outStack.pop();\n    }\n\n    /**\n     * Peek at the element from the front of the queue\n     *\n     * @return the front element of the queue\n     */\n    public Object peekFront() {\n        if (this.outStack.isEmpty()) {\n            // Move all elements from inStack to outStack (preserving the order)\n            while (!this.inStack.isEmpty()) {\n                this.outStack.push(this.inStack.pop());\n            }\n        }\n        return this.outStack.peek();\n    }\n\n    /**\n     * Peek at the element from the back of the queue\n     *\n     * @return the back element of the queue\n     */\n    public Object peekBack() {\n        return this.inStack.peek();\n    }\n\n    /**\n     * Returns true if the queue is empty\n     *\n     * @return true if the queue is empty\n     */\n    public boolean isEmpty() {\n        return (this.inStack.isEmpty() && this.outStack.isEmpty());\n    }\n\n    /**\n     * Returns true if the inStack is empty.\n     *\n     * @return true if the inStack is empty.\n     */\n    public boolean isInStackEmpty() {\n        return (inStack.isEmpty());\n    }\n\n    /**\n     * Returns true if the outStack is empty.\n     *\n     * @return true if the outStack is empty.\n     */\n    public boolean isOutStackEmpty() {\n        return (outStack.isEmpty());\n    }\n}\n",
  description: "Fonte: The Algorithms (MIT License)",
};

const codeJson = JSON.stringify(codeString);
const codeObject = JSON.parse(codeJson);

function getExtension(language: string) {
  switch (language.toLowerCase()) {
    case "python":
      return "py";
    case "java":
      return "java";
    case "csharp":
    case "c#":
      return "cs";
    case "cpp":
    case "c++":
      return "cpp";
    default:
      return "txt";
  }
}

export default function CodeModal() {
  const { language, category } = useParams();
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-2 sm:px-4 sm:py-10">
      <div className="w-full max-w-6xl mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
          <Link
            to={`/code-model/${language}/${category}`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-0.5 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="whitespace-nowrap">Voltar</span>
          </Link>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center shadow-sm hover:shadow-md active:scale-95"
              aria-label="Ver recomendações"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recomendações
            </button>
            <button
              className="px-3 py-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center shadow-sm hover:shadow-md active:scale-95"
              aria-label="Fazer nova submissão"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Submeter
            </button>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gray-800 px-4 sm:px-5 py-2 flex justify-between items-center">
            <div className="flex items-center overflow-hidden">
              <div className="flex space-x-1.5 mr-2 sm:mr-3 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <h2 className="text-white font-mono text-xs sm:text-sm truncate">
                {codeObject.name}.
                {getExtension(codeObject.language.toLowerCase())}
              </h2>
            </div>
            <span className="text-gray-400 text-xs font-mono bg-gray-700 px-2 py-0.5 rounded-md">
              {codeObject.language}
            </span>
          </div>

          <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh] sm:max-h-[65vh]">
            <SyntaxHighlighter
              language={codeObject.language.toLowerCase()}
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "#1e1e2f",
                fontSize: "0.85rem",
                lineHeight: "1.5",
                overflowX: "hidden",
                wordBreak: "break-word",
              }}
              lineNumberStyle={{
                minWidth: "2.5em",
                paddingRight: "1em",
                color: "#6e7681",
                textAlign: "right",
              }}
            >
              {codeObject.code}
            </SyntaxHighlighter>
          </div>

          <div className="bg-gray-50 px-4 sm:px-5 py-2 border-t border-gray-200">
            <p className="text-gray-600 text-xs sm:text-sm">
              {codeObject.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

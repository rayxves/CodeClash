import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const code = `#include <iostream>
using namespace std;

int main() {
  cout << "Code is like poetry — it’s meant to be read." << endl;
  return 0;
}`;

export default function CodeBlock() {
  return (
    <section className="px-2 sm:px-4 py-4 rounded shadow w-11/12 md:w-9/12 lg:w-7/12">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {" "}
        <SyntaxHighlighter
          language="cpp"
          style={vscDarkPlus}
          showLineNumbers
          wrapLines={false}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "#1e1e2f",
            fontSize: "0.85rem",
            lineHeight: "1.5",
            minWidth: "fit-content",
            width: "100%",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#6e7681",
            textAlign: "right",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

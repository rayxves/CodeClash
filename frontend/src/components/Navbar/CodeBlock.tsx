import { Highlight, themes } from "prism-react-renderer";

const code = `#include <iostream>
using namespace std;

int main() {
  cout << "Code is like poetry — it’s meant to be read." << endl;
  return 0;
}`;

export default function CodeBlock() {
  return (
    <section className="px-4 py-4 rounded shadow max-w-full">
      <Highlight theme={themes.nightOwl} code={code} language="cpp">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto text-xs md:text-sm font-mono p-3 rounded`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </section>
  );
}

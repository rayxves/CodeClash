import MonacoEditor from "react-monaco-editor";
import { Code2, Settings } from "lucide-react";

interface Props {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const languages = [
  { name: "Python", id: "python", icon: <Code2 className="w-4 h-4" /> },
  { name: "C++", id: "cpp", icon: <Code2 className="w-4 h-4" /> },
  { name: "Java", id: "java", icon: <Code2 className="w-4 h-4" /> },
  { name: "C#", id: "csharp", icon: <Code2 className="w-4 h-4" /> },
];

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  fontSize,
  setFontSize,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="bg-muted/50 px-3 sm:px-6 py-3 sm:py-4 border-b border-border">
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-mono text-card-foreground truncate">
              editor.
              {languages.find((l) => l.id === language)?.name.toLowerCase() ||
                "py"}
            </span>
          </div>

          <div className="w-full flex flex-wrap justify-end">
            <div className="flex w-fit gap-2 flex-wrap">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 max-w-28 px-2 py-1.5 bg-card border cursor-pointer border-border rounded text-card-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 max-w-28 bg-card text-xs rounded px-2 py-1.5 border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {[12, 14, 16, 18, 20].map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-mono text-card-foreground">
              editor.
              {languages.find((l) => l.id === language)?.name.toLowerCase() ||
                "py"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 bg-card border cursor-pointer border-border rounded text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-card text-sm rounded px-3 py-1.5 border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {[12, 14, 16, 18, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[400px] sm:h-[500px]">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 15, bottom: 15 },
            renderWhitespace: "selection",
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
}

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
      <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
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
            className="px-2 py-1 bg-card border cursor-pointer border-border rounded text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <Settings className="w-4 h-4 text-muted-foreground" />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-card text-sm rounded px-2 py-1 border border-border text-card-foreground focus:outline-none"
          >
            {[12, 14, 16, 18, 20].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>

      <MonacoEditor
        height="500px"
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
        }}
      />
    </div>
  );
}

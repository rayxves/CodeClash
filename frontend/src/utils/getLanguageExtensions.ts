export function getLanguageExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: "python",
    java: "java",
    "c#": "csharp",
    csharp: "csharp",
    cpp: "cpp",
    "c++": "cpp",
  };
  return extensions[language.toLowerCase()] || "text";
}

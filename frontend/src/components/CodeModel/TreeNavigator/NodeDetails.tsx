import { GitBranch } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { getLanguageExtension } from "../../../utils/getLanguageExtensions";
import type { CodeReference } from "../../../types/code";

interface NodeDetailsProps {
  selectedNode: CodeReference | null;
  treeData: CodeReference | null;
  language?: string;
}

export default function NodeDetails({ selectedNode, treeData, language }: NodeDetailsProps) {
  if (!selectedNode) {
    return (
      <div className="text-center p-8 bg-card rounded-2xl border border-border">
        <p>Nenhum nó selecionado.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border">
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <h2 className="text-2xl font-bold text-card-foreground">
          {selectedNode.name}
        </h2>
      </div>
      {selectedNode.code ? (
        <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh]">
          <SyntaxHighlighter
            language={getLanguageExtension(language ?? "")}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{ margin: 0, padding: "1.5rem", background: "transparent" }}
          >
            {selectedNode.code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <div className="p-8 text-center min-h-[200px] flex flex-col justify-center items-center">
          <GitBranch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {selectedNode.id === treeData?.id
              ? `Você está explorando algoritmos em ${selectedNode.name}. Clique nos nós da árvore para explorar a estrutura.`
              : "Esta é uma categoria. Selecione um algoritmo para ver o código."}
          </p>
        </div>
      )}
      {selectedNode.description && (
        <div className="bg-muted/30 p-6 border-t border-border">
          <h3 className="font-semibold text-card-foreground mb-2">Descrição</h3>
          <p className="text-muted-foreground">{selectedNode.description}</p>
        </div>
      )}
    </div>
  );
}
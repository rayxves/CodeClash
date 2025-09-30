import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GitBranch,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getCodeTreeByLanguage } from "../../../api/codeReferenceServices";
import { getNextSuggestedNode } from "../../../api/treeNavigationService";
import type { CodeReference } from "../../../types/code";
import TreeNode from "./TreeNode";
import type { TreeNavigatorParams, NavigationMode } from "../../../types/navigation";
import { getLanguageExtension } from "../../../utils/getLanguageExtensions";


const findAncestors = (
  targetId: string,
  node: CodeReference
): string[] | null => {
  if (String(node.id) === targetId) {
    return [];
  }

  if (node.children) {
    for (const child of node.children) {
      const path = findAncestors(targetId, child);
      if (path !== null) {
        return [String(node.id), ...path];
      }
    }
  }

  return null;
};

export default function TreeNavigator() {
  const { language } = useParams<TreeNavigatorParams>();
  const navigate = useNavigate();

  const [treeData, setTreeData] = useState<CodeReference | null>(null);
  const [selectedNode, setSelectedNode] = useState<CodeReference | null>(null);
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const [navigationMode, setNavigationMode] = useState<NavigationMode>("depth");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (language) {
      setIsLoading(true);
      getCodeTreeByLanguage(language)
        .then((data) => {
          setTreeData(data);
          setSelectedNode(data);
          setOpenNodes(new Set());
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [language]);

  const handleNodeSelect = (node: CodeReference) => {
    setSelectedNode(node);
  };

  const handleToggle = (nodeId: string) => {
    setOpenNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNext = async () => {
    if (!language || !selectedNode || !treeData) return;

    try {
      const nextNode = await getNextSuggestedNode(
        language,
        navigationMode,
        parseInt(String(selectedNode.id), 10)
      );

      if (nextNode) {
        const nextNodeIdStr = String(nextNode.id);
        const ancestors = findAncestors(nextNodeIdStr, treeData);
        if (ancestors) {
          setOpenNodes((prev) => new Set([...prev, ...ancestors, nextNodeIdStr]));
        }
        setSelectedNode(nextNode);
      }
    } catch (error) {
      console.error("Erro ao buscar próximo nó:", error);
    }
  };

  const handleReset = () => {
    if (treeData) {
      setSelectedNode(treeData);
      setOpenNodes(new Set());
    }
  };

  const handleModeChange = (mode: NavigationMode) => {
    setNavigationMode(mode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="mb-4 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border">
          <button
            onClick={() => navigate("/code-model")}
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all group mb-6"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Voltar</span>
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                Navegador de Árvore
              </h1>
              <p className="text-muted-foreground">
                Explore a estrutura de algoritmos e veja o código
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                {language?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border self-start max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-card-foreground p-2 mb-2">
              Estrutura
            </h2>
            {treeData && (
              <TreeNode
                node={treeData}
                selectedNodeId={selectedNode ? String(selectedNode.id) : null}
                onNodeSelect={handleNodeSelect}
                openNodes={openNodes}
                onToggle={handleToggle}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Estratégia de Navegação Guiada
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleModeChange("depth")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    navigationMode === "depth"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <GitBranch className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-card-foreground">
                      Profundidade (DFS)
                    </h3>
                  </div>
                </button>
                <button
                  onClick={() => handleModeChange("breadth")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    navigationMode === "breadth"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-card-foreground">
                      Largura (BFS)
                    </h3>
                  </div>
                </button>
                <button
                  onClick={() => handleModeChange("algorithms")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    navigationMode === "algorithms"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="font-semibold text-card-foreground">
                      Apenas Algoritmos
                    </h3>
                  </div>
                </button>
              </div>
            </div>

            {selectedNode ? (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border mb-8">
                <div className="flex items-center justify-end gap-4 bg-card/50 backdrop-blur-sm p-2 border-t border-border">
                  <button
                    onClick={handleNext}
                    className="flex items-center w-fit gap-1 px-3 py-2 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                  >
                    Próximo Sugerido
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-muted/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-card-foreground">
                      {selectedNode.name}
                    </h2>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reiniciar
                    </button>
                  </div>
                </div>
                {selectedNode.code ? (
                  <div className="bg-[#1e1e2f] overflow-auto max-h-[60vh]">
                    <SyntaxHighlighter
                      language={getLanguageExtension(selectedNode.language)}
                      style={vscDarkPlus}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        background: "transparent",
                      }}
                    >
                      {selectedNode.code}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="p-8 text-center min-h-[200px] flex flex-col justify-center items-center">
                    <GitBranch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {selectedNode.id === treeData?.id
                        ? `Você está explorando algoritmos em ${selectedNode.name}. Navegue pela estrutura ao lado e selecione um item para começar.`
                        : "Esta é uma categoria. Selecione um algoritmo na árvore para ver o código."}
                    </p>
                  </div>
                )}
                {selectedNode.description && (
                  <div className="bg-muted/30 p-6 border-t border-border">
                    <p className="text-muted-foreground">
                      {selectedNode.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <p>Nenhum nó selecionado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


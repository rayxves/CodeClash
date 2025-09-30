import { useEffect, useRef } from "react";
import { ChevronRight, FileCode, Folder } from "lucide-react";
import type { CodeReference } from "../../../types/code";

interface TreeNodeProps {
  node: CodeReference;
  selectedNodeId: string | null;
  onNodeSelect: (node: CodeReference) => void;
  level?: number;
  openNodes: Set<string>;
  onToggle: (nodeId: string) => void;
}

export default function TreeNode({
  node,
  selectedNodeId,
  onNodeSelect,
  level = 0,
  openNodes,
  onToggle,
}: TreeNodeProps) {
  const isCategory = !!(node.children && node.children.length > 0);
  const isSelected = String(node.id) === selectedNodeId;
  const isOpen = openNodes.has(String(node.id));
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSelected) {
      nodeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isSelected]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCategory) {
      onToggle(String(node.id));
    }
  };

  const handleSelect = () => {
    onNodeSelect(node);
  };

  const Icon = isCategory ? Folder : FileCode;

  return (
    <div ref={nodeRef}>
      <div
        onClick={handleSelect}
        onDoubleClick={handleToggle}
        className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? "bg-primary/20 text-primary-foreground"
            : "hover:bg-muted/50"
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        {isCategory && (
          <ChevronRight
            className={`w-4 h-4 mr-2 transition-transform flex-shrink-0 ${
              isOpen ? "rotate-90" : ""
            }`}
            onClick={handleToggle}
          />
        )}
        <Icon
          className={`w-4 h-4 mr-2 flex-shrink-0 ${
            isCategory ? "text-yellow-500" : "text-blue-500"
          }`}
        />
        <span className="truncate">{node.name}</span>
      </div>
      {isCategory && isOpen && (
        <div>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              level={level + 1}
              openNodes={openNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
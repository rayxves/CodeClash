import { FileCode, Folder } from "lucide-react";
import type { CodeReference } from "../../../types/code";

interface TreeNodeProps {
  node: CodeReference;
  x: number;
  y: number;
  width: number;
  height: number;
  selectedNodeId: string | null;
  onNodeSelect: (node: CodeReference) => void;
  isInSelectedPath: (nodeId: string) => boolean;
}

export default function TreeNode({
  node,
  x,
  y,
  width,
  height,
  selectedNodeId,
  onNodeSelect,
  isInSelectedPath,
}: TreeNodeProps) {
  const isCategory = !!(node.children && node.children.length > 0);
  const isSelected = String(node.id) === selectedNodeId;
  const isPath = isInSelectedPath(String(node.id));

  const Icon = isCategory ? Folder : FileCode;

  const bgColor = isSelected
    ? "bg-gradient-to-r from-primary to-primary/90"
    : isPath
    ? "bg-primary/20"
    : "bg-card";

  const borderColor = isSelected
    ? "border-primary"
    : isPath
    ? "border-primary/50"
    : "border-border";

  const textColor = isSelected ? "text-white" : "text-card-foreground";
  const iconColor = isSelected
    ? "text-white"
    : isCategory
    ? "text-yellow-500"
    : "text-blue-500";

  const hoverClass = !isSelected
    ? "hover:bg-card-hover hover:border-primary hover:shadow-lg transform hover:scale-105"
    : "";

  const handleClick = () => {
    onNodeSelect(node);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className="transition-all duration-300"
    >
      {isSelected && (
        <rect
          x={-5}
          y={-5}
          width={width + 10}
          height={height + 10}
          rx={12}
          fill="#3b82f6"
          opacity="0.2"
          filter="url(#glow)"
        />
      )}

      <foreignObject x="0" y="0" width={width} height={height}>
        <div
          className={`w-full h-full p-4 flex items-center justify-start rounded-xl border-2 transition-all duration-300 shadow-md ${bgColor} ${borderColor} ${hoverClass}`}
        >
          <div className="flex items-center min-w-0 flex-1">
            <Icon className={`w-6 h-6 mr-3 flex-shrink-0 ${iconColor}`} />
            <span
              className={`text-sm font-semibold truncate ${textColor}`}
              title={node.name}
            >
              {node.name}
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useRef } from "react";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  VERTICAL_SPACING,
} from "../../constants/tree-navigation_constants";
import type { CodeReference } from "../../types/code";
import type { TreeNodePosition } from "../../types/navigation";
import TreeNode from "./TreeNode";

interface TreeViewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  treeData: CodeReference | null;
  treePositions: TreeNodePosition[];
  selectedNode: CodeReference | null;
  pan: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  gTransitionStyle: CSSProperties;
  handleMouseDown: (e: React.MouseEvent | { clientX: number; clientY: number }) => void;
  handleMouseMove: (e: React.MouseEvent | { clientX: number; clientY: number }) => void;
  handleMouseUp: () => void;
  handleNodeSelect: (node: CodeReference) => void;
  isNodeInSelectedPath: (nodeId: string) => boolean;
  handleZoomFit: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export default function TreeView({
  containerRef,
  treeData,
  treePositions,
  selectedNode,
  pan,
  zoom,
  isDragging,
  gTransitionStyle,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleNodeSelect,
  isNodeInSelectedPath,
  handleZoomFit,
  handleZoomIn,
  handleZoomOut,
}: TreeViewProps) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTouchMoveRef = useRef(false);

  const renderConnections = () => {
    if (!treeData) return null;
    return treePositions
      .filter((pos) => pos.node.children && pos.node.children.length > 0)
      .flatMap((pos) =>
        pos.node.children!.map((child) => {
          const childPos = treePositions.find((p) => p.node.id === child.id);
          if (!childPos) return null;

          const isHighlighted =
            isNodeInSelectedPath(String(pos.node.id)) &&
            isNodeInSelectedPath(String(child.id));

          return (
            <path
              key={`${pos.node.id}-${child.id}`}
              d={`M ${pos.x + NODE_WIDTH / 2} ${pos.y + NODE_HEIGHT} V ${
                pos.y + NODE_HEIGHT + VERTICAL_SPACING / 2
              } H ${childPos.x + NODE_WIDTH / 2} V ${childPos.y}`}
              stroke={isHighlighted ? "#3b82f6" : "#475569"}
              strokeWidth={isHighlighted ? 4 : 2}
              fill="none"
              className="transition-all duration-300"
            />
          );
        })
      );
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { 
        x: touch.clientX, 
        y: touch.clientY,
        time: Date.now()
      };
      isTouchMoveRef.current = false;
      
      handleMouseDown({ 
        clientX: touch.clientX, 
        clientY: touch.clientY 
      });
    }
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      
      if (touchStartRef.current) {
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
        
        if (deltaX > 5 || deltaY > 5) {
          isTouchMoveRef.current = true;
          e.preventDefault();
        }
      }
      
      handleMouseMove({ 
        clientX: touch.clientX, 
        clientY: touch.clientY 
      });
    }
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
    touchStartRef.current = null;
    isTouchMoveRef.current = false;
  }, [handleMouseUp]);

  return (
    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Clique nos nós para explorar • Arraste para mover
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleZoomFit}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            aria-label="Ajustar à tela"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className={`w-full h-[65vh] overflow-hidden rounded-xl bg-background border-2 border-border select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ 
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e as React.MouseEvent)}
        onMouseMove={(e) => handleMouseMove(e as React.MouseEvent)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {treeData && (
          <svg className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              style={gTransitionStyle}
            >
              <g>{renderConnections()}</g>
              <g>
                {treePositions.map((pos) => (
                  <TreeNode
                    key={pos.node.id}
                    node={pos.node}
                    x={pos.x}
                    y={pos.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    selectedNodeId={
                      selectedNode ? String(selectedNode.id) : null
                    }
                    onNodeSelect={handleNodeSelect}
                    isInSelectedPath={isNodeInSelectedPath}
                  />
                ))}
              </g>
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
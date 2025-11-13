import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import type { CSSProperties } from "react";
import { useRef, useEffect } from "react";
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
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);

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
              strokeWidth={isHighlighted ? 3 : 2}
              fill="none"
              className="transition-all duration-300"
              style={{ pointerEvents: 'none' }}
            />
          );
        })
      );
  };

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const getTouchDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMouseDown({ 
          clientX: touch.clientX, 
          clientY: touch.clientY 
        });
      } else if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistanceRef.current = getTouchDistance(e.touches);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMouseMove({ 
          clientX: touch.clientX, 
          clientY: touch.clientY 
        });
      } else if (e.touches.length === 2 && lastTouchDistanceRef.current) {
        const newDistance = getTouchDistance(e.touches);
        const delta = newDistance - lastTouchDistanceRef.current;
        
        if (Math.abs(delta) > 10) {
          if (delta > 0) {
            handleZoomIn();
          } else {
            handleZoomOut();
          }
          lastTouchDistanceRef.current = newDistance;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        handleMouseUp();
        lastTouchDistanceRef.current = null;
      } else if (e.touches.length === 1) {
        lastTouchDistanceRef.current = null;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleZoomIn, handleZoomOut]);

  return (
    <div className="bg-card/50 backdrop-blur-sm p-2 sm:p-4 rounded-2xl border border-border">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Toque nos nós • Arraste para mover • Pinça para zoom
        </span>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleZoomFit}
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors touch-manipulation"
            aria-label="Ajustar à tela"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors touch-manipulation"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 sm:p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors touch-manipulation"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      <div
        ref={(el) => {
          svgContainerRef.current = el;
          if (containerRef) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }}
        className={`w-full h-[50vh] sm:h-[65vh] overflow-hidden rounded-xl bg-background border-2 border-border select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ 
          touchAction: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleMouseDown(e as React.MouseEvent);
        }}
        onMouseMove={(e) => handleMouseMove(e as React.MouseEvent)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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

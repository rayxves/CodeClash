import {
  NODE_WIDTH,
  VERTICAL_SPACING,
  HORIZONTAL_SPACING,
  NODE_HEIGHT,
} from "../constants/tree-navigation_constants";
import type { CodeReference } from "../types/code";
import type { TreeNodePosition } from "../types/navigation";

export const calculateTreeLayout = (
  node: CodeReference,
  depth = 0,
  leftBound = 0
): { positions: TreeNodePosition[]; width: number } => {
  const positions: TreeNodePosition[] = [];
  if (!node.children || node.children.length === 0) {
    positions.push({ x: leftBound, y: depth * VERTICAL_SPACING, node });
    return { positions, width: NODE_WIDTH };
  }

  let currentX = leftBound;
  const childPositions: TreeNodePosition[][] = [];
  let totalWidth = 0;

  for (const child of node.children) {
    const result = calculateTreeLayout(child, depth + 1, currentX);
    childPositions.push(result.positions);
    currentX += result.width + HORIZONTAL_SPACING;
    totalWidth += result.width + HORIZONTAL_SPACING;
  }

  totalWidth = totalWidth > 0 ? totalWidth - HORIZONTAL_SPACING : 0;

  const firstChildX = childPositions[0]?.[0]?.x || leftBound;
  const lastChildPos = childPositions[childPositions.length - 1];
  const lastChildX = lastChildPos?.[lastChildPos.length - 1]?.x || leftBound;
  const centerX = (firstChildX + lastChildX + NODE_WIDTH) / 2 - NODE_WIDTH / 2;

  positions.push({ x: centerX, y: depth * VERTICAL_SPACING, node });
  positions.push(...childPositions.flat());

  return { positions, width: totalWidth || NODE_WIDTH };
};

export const findAncestors = (
  targetId: string,
  node: CodeReference,
  ancestors: string[] = []
): string[] | null => {
  if (String(node.id) === targetId) {
    return ancestors;
  }
  if (node.children) {
    for (const child of node.children) {
      const path = findAncestors(targetId, child, [
        ...ancestors,
        String(node.id),
      ]);
      if (path !== null) {
        return path;
      }
    }
  }
  return null;
};

export const calculatePanForCenter = (
  nodePos: TreeNodePosition | undefined | null,
  containerEl: HTMLDivElement | null,
  currentZoom: number
): { x: number; y: number } | null => {
  if (nodePos && containerEl) {
    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;
    const nodeCenterX = nodePos.x + NODE_WIDTH / 2;
    const nodeCenterY = nodePos.y + NODE_HEIGHT / 2;
    const newPanX = containerWidth / 2 - nodeCenterX * currentZoom;
    const newPanY = containerHeight / 2 - nodeCenterY * currentZoom;
    return { x: newPanX, y: newPanY };
  }
  return null;
};
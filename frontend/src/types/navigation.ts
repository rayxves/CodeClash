import type { CodeReference } from "./code";

export type NavigationMode = "depth" | "breadth" | "algorithms";
export type TreeNavigatorParams = { language: string };

export interface TreeNodePosition {
  x: number;
  y: number;
  node: CodeReference;
}
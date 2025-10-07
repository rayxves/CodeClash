import { NODE_WIDTH, VERTICAL_SPACING } from "../../constants/tree-navigation_constants";
import type { CodeReference } from "../../types/code";
import { calculatePanForCenter, calculateTreeLayout, findAncestors } from "../treeUtils";

const mockTree: CodeReference = {
  id: "1",
  name: "Root",
  description: "Root node",
  language: "Python",
  category: "Root",
  code: "",
  parentId: null,
  children: [
    {
      id: "2",
      name: "Child 1",
      code: "",
      language: "Python",
      category: "Root",
      description: "",
      parentId: 1,
      children: [
        {
          id: "3",
          name: "Grandchild 1.1",
          code: "",
          language: "Python",
          category: "Root",
          description: "",
          parentId: 2,
          children: [],
        },
      ],
    },
    { id: "4", name: "Child 2", code: "", language: "Python", category: "Root", description: "", parentId: 1, children: [] },
  ],
};

describe("treeUtils", () => {
  describe("calculateTreeLayout", () => {
    test("should calculate layout for a single node", () => {
      const singleNode: CodeReference = { ...mockTree, children: [] };
      const { positions, width } = calculateTreeLayout(singleNode);
      expect(positions).toHaveLength(1);
      expect(positions[0].x).toBe(0);
      expect(positions[0].y).toBe(0);
      expect(width).toBe(NODE_WIDTH);
    });

    test("should calculate layout for a complex tree", () => {
      const { positions } = calculateTreeLayout(mockTree);
      expect(positions).toHaveLength(4);

      const rootPos = positions.find((p) => p.node.id === "1");
      const child1Pos = positions.find((p) => p.node.id === "2");
      const grandchildPos = positions.find((p) => p.node.id === "3");
      const child2Pos = positions.find((p) => p.node.id === "4");

      expect(rootPos?.y).toBe(0 * VERTICAL_SPACING);
      expect(child1Pos?.y).toBe(1 * VERTICAL_SPACING);
      expect(child2Pos?.y).toBe(1 * VERTICAL_SPACING);
      expect(grandchildPos?.y).toBe(2 * VERTICAL_SPACING);

      expect(rootPos?.x).toBeGreaterThan(child1Pos?.x ?? 0);
      expect(rootPos?.x).toBeLessThan(child2Pos?.x ?? 0);
    });
  });

  describe("findAncestors", () => {
    test("should return null if targetId is not found", () => {
      const ancestors = findAncestors("99", mockTree);
      expect(ancestors).toBeNull();
    });

    test("should return an empty array for the root node", () => {
      const ancestors = findAncestors("1", mockTree);
      expect(ancestors).toEqual([]);
    });

    test("should find ancestors for a first-level child", () => {
      const ancestors = findAncestors("4", mockTree);
      expect(ancestors).toEqual(["1"]);
    });

    test("should find ancestors for a nested grandchild", () => {
      const ancestors = findAncestors("3", mockTree);
      expect(ancestors).toEqual(["1", "2"]);
    });
  });

  describe("calculatePanForCenter", () => {
    test("should return null if nodePos or containerEl is not provided", () => {
      const containerEl = document.createElement("div");
      expect(calculatePanForCenter(null, containerEl, 1)).toBeNull();
      expect(calculatePanForCenter({ x: 0, y: 0, node: mockTree }, null, 1)).toBeNull();
    });

    test("should calculate correct pan to center the node", () => {
      const containerEl = document.createElement("div");
      Object.defineProperty(containerEl, "clientWidth", { value: 800 });
      Object.defineProperty(containerEl, "clientHeight", { value: 600 });

      const nodePos = { x: 100, y: 50, node: mockTree };
      const zoom = 0.5;
      
      const pan = calculatePanForCenter(nodePos, containerEl, zoom);
      
      expect(pan).not.toBeNull();
      expect(pan?.x).toBeDefined();
      expect(pan?.y).toBeDefined();
    });
  });
});
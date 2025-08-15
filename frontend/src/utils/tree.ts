import { useMemo } from "react";
import type { CodeReference } from "../types/code";

export function useHierarchyNavigation(allItems: CodeReference[]) {
  const { idToItemMap, nameToItemMap } = useMemo(() => {
    const idMap = new Map<string, CodeReference>();
    const nameMap = new Map<string, CodeReference>();
    allItems.forEach(item => {
      idMap.set(String(item.id), item);
      nameMap.set(item.name, item);
    });
    return { idToItemMap: idMap, nameToItemMap: nameMap };
  }, [allItems]);

  const getParent = (categoryName: string) => {
    const item = nameToItemMap.get(categoryName);
    if (item && item.parentId) {
      const parentItem = idToItemMap.get(String(item.parentId));
      return parentItem ? parentItem.name : null;
    }
    return null;
  };

  return { getParent };
}
import { apiClient as api } from "./client";
import type { CodeReference } from "../types/code";

export const getNextSuggestedNode = async (
  language: string,
  mode: string,
  currentId: number
): Promise<CodeReference | null> => {
    const params = new URLSearchParams({
      language,
      mode,
      currentId: String(currentId),
    });
    const endpoint = `/tree-navigation/next-node?${params.toString()}`;

    const response = await api.get<CodeReference | null>(endpoint);
    return response;
  
};
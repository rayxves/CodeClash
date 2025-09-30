import { apiClient as api } from "./client";
import type { CodeReference } from "../types/code";

export const getNextSuggestedNode = async (
  language: string,
  mode: string,
  currentId: number
): Promise<CodeReference | null> => {
  try {
    const params = new URLSearchParams({
      language,
      mode,
      currentId: String(currentId),
    });
    const endpoint = `/tree-navigation/next-node?${params.toString()}`;

    const response = await api.get<CodeReference | null>(endpoint);
    return response;
  } catch (error) {
    console.error("Failed to get next suggested node:", error);
    throw error;
  }
};
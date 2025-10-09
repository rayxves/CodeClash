import { apiClient as api } from "./client";
import type { CodeReference } from "../types/code";
import { parseApiError, AppError } from "../utils/errorsHandler";

export const getNextSuggestedNode = async (
  language: string,
  mode: string,
  currentId: number
): Promise<CodeReference | null> => {
  try {
    if (!language || !mode || currentId === undefined || currentId === null) {
      throw new AppError("Parâmetros inválidos para buscar o próximo nó.", 400, "INVALID_PARAMS");
    }

    const params = new URLSearchParams({
      language,
      mode,
      currentId: String(currentId),
    });
    const endpoint = `/tree-navigation/next-node?${params.toString()}`;

    const response = await api.get<CodeReference | null>(endpoint);
    
    if (response === null) {
      return null;
    }

    return response;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    const apiError = parseApiError(error);
    throw new AppError(apiError.message, apiError.status, apiError.code);
  }
};
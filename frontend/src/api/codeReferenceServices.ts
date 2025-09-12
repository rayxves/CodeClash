import type { CodeReference, CategoryViewData } from "../types/code";
import { apiClient } from "./client";
import Cookies from "js-cookie";

export const getCodeReferenceByFilters = async (
  language?: string,
  category?: string,
  name?: string
): Promise<CodeReference[]> => {
  let query = "";
  if (language) query += `language=${encodeURIComponent(language)}&`;
  if (category) query += `category=${encodeURIComponent(category)}&`;
  if (name) query += `name=${encodeURIComponent(name)}&`;
  query = query.slice(0, -1);
  return await apiClient.get<CodeReference[]>(`/code/search?${query}`);
};

export const getCodeReferenceById = async (
  id: number
): Promise<CodeReference | null> => {
  return await apiClient.get<CodeReference | null>(`/code/${id}`);
};

export const recommendSimilar = async (
  userCodeAttempt: string
): Promise<CodeReference[]> => {
  return await apiClient.post<CodeReference[]>("/code/recommend-similar", {
    userCodeAttempt,
  });
};

export async function getCategoryView(
  language: string,
  category?: string
): Promise<CategoryViewData> {
  const categoryPath = category ? `/${encodeURIComponent(category)}` : "";
  try {
    return await apiClient.get<CategoryViewData>(
      `/code/view/${encodeURIComponent(language)}${categoryPath}`
    );
  } catch {
    return { currentCategory: null, children: [] };
  }
}

export async function submitCode(
  language: string,
  code: string,
  problemId?: number | null
): Promise<any> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");
  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return await apiClient.post<any>(
    "/code/submit",
    { code, language, problemId },
    {headers}
  );
}


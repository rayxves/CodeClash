import axios, { type AxiosResponse } from "axios";
import type { CategoryViewData, CodeReference } from "./src/types/code";

const api = axios.create({
  baseURL: "http://localhost:5070/api",
  timeout: 10000,
});

export const getCodeReferenceByFilters = async (
  language?: string,
  category?: string,
  name?: string
) => {
  try {
    let query = "";
    if (language) {
      query += `language=${encodeURIComponent(language)}&`;
    }
    if (category) {
      query += `category=${encodeURIComponent(category)}&`;
    }
    if (name) {
      query += `name=${encodeURIComponent(name)}&`;
    }
    query = query.slice(0, -1);
    const response: AxiosResponse<CodeReference[]> = await api.get(
      `/code/search?${query}`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);

    throw error;
  }
};

export const getCodeReferenceById = async (
  id: number
): Promise<CodeReference | null> => {
  try {
    const response = await api.get<CodeReference>(`/code/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const recommendSimilar = async (
  userCodeAttempt: string
): Promise<CodeReference[]> => {
  try {
    const response = await api.post<CodeReference[]>(
      "/code/recommend-similar",
      {
        userCodeAttempt,
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function getCategoryView(
  language: string,
  category?: string
): Promise<CategoryViewData> {
  const categoryPath = category ? `/${encodeURIComponent(category)}` : "";

  try {
    const response = await api.get(
      `/code/view/${encodeURIComponent(language)}${categoryPath}`
    );

    if (!response.data) {
      throw new Error(`Error fetching category view: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("API call to getCategoryView failed:", error);
    return {
      currentCategory: null,
      children: [],
    };
  }
}

export async function getProblems() {
  try {
    const problems = await api.get("/problems");
    console.log(problems.data);
    return problems.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getProblemById(id: number) {
  try {
    const problem = await api.get(`/problems/${id}`);
    return problem.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

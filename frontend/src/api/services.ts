
import { apiClient } from './client';
import type { CategoryViewData, CodeReference } from "../types/code";
import type { User, UserProblemSolution } from '../types/auth';
import type { Problem } from '../types/problem';
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

  try {
    return await apiClient.get<CodeReference[]>(`/code/search?${query}`);
  } catch (error) {
    console.error("API Error in getCodeReferenceByFilters:", error);
    throw error;
  }
};

export const getCodeReferenceById = async (id: number): Promise<CodeReference | null> => {
  try {
    return await apiClient.get<CodeReference | null>(`/code/${id}`);
  } catch (error) {
    console.error("API Error in getCodeReferenceById:", error);
    throw error;
  }
};

export const recommendSimilar = async (userCodeAttempt: string): Promise<CodeReference[]> => {
  try {
    return await apiClient.post<CodeReference[]>("/code/recommend-similar", { userCodeAttempt });
  } catch (error) {
    console.error("API Error in recommendSimilar:", error);
    throw error;
  }
};

export async function getCategoryView(language: string, category?: string): Promise<CategoryViewData> {
  const categoryPath = category ? `/${encodeURIComponent(category)}` : "";
  try {
    return await apiClient.get<CategoryViewData>(`/code/view/${encodeURIComponent(language)}${categoryPath}`);
  } catch (error) {
    console.error("API call to getCategoryView failed:", error);
    return { currentCategory: null, children: [] };
  }
}

export async function getProblems(): Promise<Problem[]> {
  try {
    return await apiClient.get<Problem[]>("/problems");
  } catch (error) {
    console.error("API Error in getProblems:", error);
    throw error;
  }
}

export async function getProblemById(id: number): Promise<Problem | null> {
  try {
    return await apiClient.get<Problem | null>(`/problems/${id}`);
  } catch (error) {
    console.error("API Error in getProblemById:", error);
    throw error;
  }
}

export async function loginUser(username: string, password: string): Promise<User> {
  try {
    return await apiClient.post<User>("/users/login", { username, password });
  } catch (error) {
    console.error("API Error in loginUser:", error);
    throw error;
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  try {
    return await apiClient.post<User>("/users/register", { username, email, password });
  } catch (error) {
    console.error("API Error in registerUser:", error);
    throw error;
  }
}

export async function submitCode(language: string, code: string, problemId?: number | null): Promise<any> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");

  const finalProblemId = problemId === 0 ? null : problemId;

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    
    return await apiClient.post<any>("/code/submit", { code, language, problemId: finalProblemId }, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    console.error("API Error in submitCode:", error);
    throw { status: 500, message };
  }
}

export async function getUser(): Promise<User | null> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;
    const options = { headers: { Authorization: `Bearer ${token}` } };

    return await apiClient.get<User | null>("/users/get-user", options);
  } catch (error) {
    console.error("API Error in getUser:", error);
    const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    throw new Error(message);
  }
}

export async function getUserProblemSolutions(): Promise<UserProblemSolution[]> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    
    return await apiClient.get<UserProblemSolution[]>("/user-problem-solutions/user", options);
  } catch (error) {
    console.error("API Error in getUserProblemSolutions:", error);
    const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    throw new Error(message);
  }
}
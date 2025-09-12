import { apiClient } from "./client";
import type { CategoryViewData, CodeReference } from "../types/code";
import type {
  CompleteProfileData,
  User,
  UserProblemSolution,
} from "../types/auth";
import type { Problem } from "../types/problem";
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

export async function getProblems(): Promise<Problem[]> {
  return await apiClient.get<Problem[]>("/problems");
}

export async function getProblemById(id: number): Promise<Problem | null> {
  return await apiClient.get<Problem | null>(`/problems/${id}`);
}

export async function loginUser(
  username: string,
  password: string
): Promise<User> {
  return await apiClient.post<User>("/users/login", { username, password });
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<User> {
  return await apiClient.post<User>("/users/register", {
    username,
    email,
    password,
  });
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

export async function getUser(): Promise<User | null> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");
  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await apiClient.get<User | null>("/users/get-user", options);
}

export async function getCompleteProfile(): Promise<CompleteProfileData | null> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");
  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await apiClient.get<CompleteProfileData | null>(
    "/users/profile/complete",
    options
  );
}

export async function getUserProblemSolutions(): Promise<
  UserProblemSolution[]
> {
  const userDataString = Cookies.get("user");
  if (!userDataString) throw new Error("Usuário precisa estar autenticado.");
  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await apiClient.get<UserProblemSolution[]>(
    "/user-problem-solutions/user",
    options
  );
}

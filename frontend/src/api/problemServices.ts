import type { Problem } from "../types/problem";
import { apiClient } from "./client";


export async function getProblems(): Promise<Problem[]> {
  return await apiClient.get<Problem[]>("/problems");
}

export async function getProblemById(id: number): Promise<Problem | null> {
  return await apiClient.get<Problem | null>(`/problems/${id}`);
}

import type { UserProblemSolution } from "../types/auth";
import { apiClient } from "./client";
import Cookies from "js-cookie";

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

import type { CompleteProfileData, User } from "../types/auth";
import { apiClient } from "./client";
import Cookies from "js-cookie";

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
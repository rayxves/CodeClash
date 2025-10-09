import type { CompleteProfileData, User } from "../types/auth";
import { apiClient } from "./client";
import Cookies from "js-cookie";
import { parseApiError, AppError } from "../utils/errorsHandler";

export async function loginUser(
  username: string,
  password: string
): Promise<User> {
  try {
    return await apiClient.post<User>("/users/login", { username, password });
  } catch (error: any) {
    const apiError = parseApiError(error);
    throw new AppError(apiError.message, apiError.status, apiError.code);
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<User> {
  try {
    return await apiClient.post<User>("/users/register", {
      username,
      email,
      password,
      confirmPassword,
    });
  } catch (error: any) {
    const apiError = parseApiError(error);
    throw new AppError(apiError.message, apiError.status, apiError.code);
  }
}

export async function getUser(): Promise<User> {
  try {
    const userDataString = Cookies.get("user");

    if (!userDataString) {
      throw new AppError("Usuário não autenticado.", 401, "NOT_AUTHENTICATED");
    }

    const userData = JSON.parse(userDataString);
    const token = userData.token;

    if (!token) {
      throw new AppError(
        "Token de autenticação não encontrado.",
        401,
        "NO_TOKEN"
      );
    }

    const options = { headers: { Authorization: `Bearer ${token}` } };
    return await apiClient.get<User>("/users/get-user", options);
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    const apiError = parseApiError(error);
    throw new AppError(apiError.message, apiError.status, apiError.code);
  }
}

export async function getCompleteProfile(): Promise<CompleteProfileData> {
  try {
    const userDataString = Cookies.get("user");

    if (!userDataString) {
      throw new AppError("Usuário não autenticado.", 401, "NOT_AUTHENTICATED");
    }

    const userData = JSON.parse(userDataString);
    const token = userData.token;

    if (!token) {
      throw new AppError(
        "Token de autenticação não encontrado.",
        401,
        "NO_TOKEN"
      );
    }

    const options = { headers: { Authorization: `Bearer ${token}` } };
    return await apiClient.get<CompleteProfileData>(
      "/users/profile/complete",
      options
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    const apiError = parseApiError(error);
    throw new AppError(apiError.message, apiError.status, apiError.code);
  }
}

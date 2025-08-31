import axios, { type AxiosResponse } from "axios";
import type { CategoryViewData, CodeReference } from "./src/types/code";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: "https://codeclash-r6wh.onrender.com/api",
  timeout: 120000,
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

export async function loginUser(username: string, password: string) {
  try {
    const user = await api.post("/users/login", {
      username,
      password,
    });

    return user.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const user = await api.post("/users/register", {
      username,
      email,
      password,
    });

    return user.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
export async function submitCode(
  language: string,
  code: string,
  problemId?: number | null
) {
  const userDataString = Cookies.get("user");

  if (!userDataString) {
    throw new Error("Usuário precisa estar autenticado.");
  }

  const finalProblemId = problemId === 0 ? null : problemId;

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;

    const response = await api.post(
      "/code/submit",
      {
        code,
        language,
        problemId: finalProblemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error || error.message;

      throw { status, message };
    }

    throw { status: 500, message: "Ocorreu um erro inesperado." };
  }
}

export async function getUser() {
  const userDataString = Cookies.get("user");

  if (!userDataString) {
    throw new Error("Usuário precisa estar autenticado.");
  }

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;

    const response = await api.get("/users/get-user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message);
      }
    }

    throw new Error("Ocorreu um erro inesperado.");
  }
}

export async function getUserProblemSolutions() {
  const userDataString = Cookies.get("user");

  if (!userDataString) {
    throw new Error("Usuário precisa estar autenticado.");
  }

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;

    const response = await api.get("user-problem-solutions/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message);
      }
    }

    throw new Error("Ocorreu um erro inesperado.");
  }
}

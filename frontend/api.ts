import axios, { type AxiosResponse } from "axios";
import type { CodeReference } from "./src/types/code";

const api = axios.create({
  baseURL: "https://codeclash-api.onrender.com/api/code",
  timeout: 10000,
});

const cache = new Map<string, CodeReference[]>();

const excludeInterfaces = (items: CodeReference[]): CodeReference[] => {
  return items.filter((item) => {
    const isInterface = item.name.startsWith("I");
    const isValidItem = item.code && item.code.trim() !== "";

    if (isInterface && item.children?.length) {
      const validChildren = item.children.filter(
        (child) =>
          child.code && child.code.trim() !== "" && !child.name.startsWith("I")
      );
      return validChildren.length > 0;
    }

    return !isInterface && isValidItem;
  });
};

export const getByLanguageAndCategory = async (
  language: string,
  category: string,
  options: { signal?: AbortSignal } = {}
): Promise<CodeReference[]> => {
  const cacheKey = `${language}-${category}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const response: AxiosResponse<CodeReference[]> = await api.get(
      `/by-language-and-category?language=${encodeURIComponent(
        language
      )}&category=${encodeURIComponent(category)}`,
      { signal: options.signal }
    );

    const filteredData = excludeInterfaces(
      response.data.flatMap((item) => {
        const hasValidCode = item.code && item.code.trim() !== "";
        const hasNoChildren = !item.children || item.children.length === 0;

        if (hasValidCode && hasNoChildren) return [item];

        if (!hasValidCode && item.children?.length) {
          return item.children.filter(
            (child) => child.code && child.code.trim() !== ""
          );
        }

        return [];
      })
    );

    cache.set(cacheKey, filteredData);
    return filteredData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return [];
    }
    console.error("API Error:", error);
    throw error;
  }
};

export const getByLanguage = async (
  language: string
): Promise<CodeReference[]> => {
  try {
    const response = await api.get<CodeReference[]>(
      `/by-language/${encodeURIComponent(language)}`
    );
    return excludeInterfaces(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getByCategory = async (
  category: string
): Promise<CodeReference[]> => {
  try {
    const response = await api.get<CodeReference[]>(
      `/by-category/${encodeURIComponent(category)}`
    );
    return excludeInterfaces(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getByLanguageAndName = async (
  language: string,
  name: string
): Promise<CodeReference[]> => {
  try {
    const response: AxiosResponse<CodeReference[]> = await api.get(
      `/by-language-and-name?language=${encodeURIComponent(
        language
      )}&name=${encodeURIComponent(name)}`
    );

    return excludeInterfaces(
      response.data.flatMap((item) => {
        const hasValidCode = item.code && item.code.trim() !== "";
        const hasNoChildren = !item.children || item.children.length === 0;

        if (hasValidCode && hasNoChildren) return [item];

        if (!hasValidCode && item.children?.length) {
          return item.children.filter(
            (child) => child.code && child.code.trim() !== ""
          );
        }

        return [];
      })
    );
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getCodeReference = async (
  id: number
): Promise<CodeReference | null> => {
  try {
    const response = await api.get<CodeReference>(`/${id}`);
    return excludeInterfaces([response.data])[0] || null;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const searchByName = async (name: string): Promise<CodeReference[]> => {
  try {
    const encodedName = encodeURIComponent(name);
    const response = await api.get<CodeReference[]>(`/by-name/${encodedName}`);
    return excludeInterfaces(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const recommendSimilar = async (
  userCodeAttempt: string
): Promise<CodeReference[]> => {
  try {
    const response = await api.post<CodeReference[]>("/recommend-similar", {
      userCodeAttempt,
    });
    return excludeInterfaces(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getByStartingLetter = async (
  language: string,
  letter: string,
  excludeInterfaces: boolean = true
): Promise<CodeReference[]> => {
  try {
    const response = await api.get<CodeReference[]>(
      `/by-starting-letter?language=${encodeURIComponent(
        language
      )}&letter=${encodeURIComponent(letter)}`
    );

    return excludeInterfaces
      ? response.data.filter(
          (item) => !item.name.startsWith("I") && !item.name.startsWith("i")
        )
      : response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

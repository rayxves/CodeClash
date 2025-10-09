export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class AppError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export const parseApiError = (error: any): ApiError => {
  if (!error.response) {
    return {
      message: "Erro de conexão. Verifique sua internet e tente novamente.",
      status: 0,
      code: "NETWORK_ERROR",
    };
  }

  const status = error.response?.status || 500;
  const data = error.response?.data;

  switch (status) {
    case 400: {
      let message = "Requisição inválida.";

      if (typeof data === "string" && data) {
        message = data;
      } 
      else if (data && typeof data === "object") {
        if (data.message && typeof data.message === "string") {
          message = data.message;
        }
        else if (data.errors && typeof data.errors === "object") {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            const firstErrorArray = data.errors[errorKeys[0]];
            if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
              message = firstErrorArray[0];
            }
          }
        }
        else if (data.title && typeof data.title === "string") {
          message = data.title;
        }
      }
      
      return { message, status, code: "BAD_REQUEST" };
    }

    case 401:
      return {
        message: "Não autorizado. Faça login novamente.",
        status,
        code: "UNAUTHORIZED",
      };

    case 403:
      return {
        message: "Acesso negado.",
        status,
        code: "FORBIDDEN",
      };

    case 404:
      return {
        message: typeof data === "string" ? data : "Recurso não encontrado.",
        status,
        code: "NOT_FOUND",
      };

    case 500:
      return {
        message: "Erro interno do servidor. Tente novamente mais tarde.",
        status,
        code: "INTERNAL_SERVER_ERROR",
      };

    default:
      return {
        message:
          typeof data === "string"
            ? data
            : "Ocorreu um erro inesperado. Tente novamente.",
        status,
        code: "UNKNOWN_ERROR",
      };
  }
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  const apiError = parseApiError(error);
  return apiError.message;
};

export const isNetworkError = (error: any): boolean => {
  if (error instanceof AppError) {
    return error.code === "NETWORK_ERROR";
  }
  return !error.response;
};

export const isAuthError = (error: any): boolean => {
  const status = error.response?.status || error.status;
  return status === 401 || status === 403;
};
import type { ReactNode } from "react";

export interface ApiResponse<T> {
    data: T;
    status?: number;
    message?: string;
  }
  
  export interface CodeReference {
    id: string;  
    name: string;
    description: string;
    language: string;
    category: string;
    code: string;
    difficulty?: string;
    children?: CodeReference[];
  }

export interface Language {
  name: string;
  icon: ReactNode;
  color: string;
}

export interface Category {
  name: string;
  alias: string;
  icon: ReactNode;
}

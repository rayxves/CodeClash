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
  parentId: number | null;
  children?: CodeReference[];
  recommendations?: CodeReference[];
}

export interface ChildCategory {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  category: string;
  parentId: number | null;
  children?: [];
}

export interface CategoryViewData {
  currentCategory: {
    id: string;
    name: string;
  } | null;
  children: ChildCategory[];
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

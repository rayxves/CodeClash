export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  totalPoints: number;
}

export interface UserProblemSolution {
  id: number;
  code: string;
  isApproved: boolean;
  language: string;
  messageOutput: string;
  pointsEarned: number;
  problem: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    category: string;
  };
  problemId: number;
  solvedAt: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const getRankTitle = (points: number): string => {
  if (points >= 800) return "Oráculo do Kernel";
  if (points >= 500) return "Refatorador Sênior";
  if (points >= 200) return "Conjurador de Funções";
  if (points >= 100) return "Manipulador de Variáveis";
  return "Explorador de Código";
};

export interface CompleteProfileData {
  user: {
    id: string;
    userName: string;
    email: string;
    totalPoints: number;
  };
  solutions: UserProblemSolution[];
}

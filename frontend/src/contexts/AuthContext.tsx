import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "../types/auth";
import { loginUser, registerUser } from "../api/userServices";
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string): Promise<void> => {
    const user = await loginUser(username, password);
    setUser(user);
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    const user = await registerUser(username, email, password);
    setUser(user);
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

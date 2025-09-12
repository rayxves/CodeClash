import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import { validateUsername, sanitizeInput } from "../../utils/validateUserData";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateUsername(username)) {
      if (username.length < 3) {
        setError("Nome de usuário precisa ter 3 ou mais caracteres.");
        return;
        
      }
      setError(
        "Nome de usuário inválido. Use apenas letras, números, hífen e underscore."
      );
      return;
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      setError("Nome de usuário contém caracteres inválidos");
      return;
    }

    setIsLoading(true);

    try {
      await login(sanitizedUsername, sanitizedPassword);
      navigate("/");
    } catch (error: any) {
      if (error.response.status !== 500) {
        setError(error.response.data);
      } else {
        setError("Erro interno ao tentar realizar o login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-card rounded-xl shadow-elegant border border-border/50 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">Entre na sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Nome de usuário
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent focus:outline-none "
                  placeholder="Seu nome de usuário"
                  required
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]{3,20}"
                  title="Use apenas letras, números, hífen e underscore (3-20 caracteres)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent focus:outline-none "
                  placeholder="Sua senha"
                  required
                  minLength={6}
                  maxLength={100}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

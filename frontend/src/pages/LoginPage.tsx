import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import {
  validateUsername,
  sanitizeInput,
  validatePassword,
} from "../utils/validateUserData";
import { getErrorMessage } from "../utils/errorsHandler";

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

    if (username.length < 3) {
      setError("Nome de usuário precisa ter 3 ou mais caracteres.");
      return;
    }

    if (!validateUsername(username)) {
      setError(
        "Nome de usuário inválido. Use apenas letras, números, hífen e underscore."
      );
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const cleanUsername = sanitizeInput(username);
      await login(cleanUsername, password);
      navigate("/");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      setError(errorMessage);
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
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
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
                  onChange={(e) => {
                    const clean = sanitizeInput(e.target.value);
                    setUsername(clean);
                    setError(""); // Limpa erro ao digitar
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                  placeholder="Seu nome de usuário"
                  required
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]{3,20}"
                  title="Use apenas letras, números, hífen e underscore (3-20 caracteres)"
                  disabled={isLoading}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(""); // Limpa erro ao digitar
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                  placeholder="Sua senha"
                  required
                  minLength={6}
                  maxLength={100}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-primary hover:shadow-primary text-primary-foreground rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
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

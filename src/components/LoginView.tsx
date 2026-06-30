import React, { useState } from "react";
import { Key, Mail, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import Logo from "./Logo";
import { api } from "../lib/api";

interface LoginViewProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.login(email, password);
      onLoginSuccess(response.user, response.token);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#252525] p-8 md:p-10 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-2xl transition-all">
        <div className="flex flex-col items-center">
          <Logo showText={true} size="lg" />
          <h2 className="mt-6 text-center text-2xl font-display font-black text-neutral-800 dark:text-white tracking-tight">
            Acesse o Portal HUIOS
          </h2>
          <p className="mt-2 text-center text-xs text-neutral-400 dark:text-neutral-500 max-w-xs">
            Entre com suas credenciais para participar de gincanas, criar avisos e gerenciar membros.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <span className="mt-0.5 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-left">
            <label htmlFor="email" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Endereço de E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="w-full py-3 pl-11 pr-4 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                Senha de Acesso
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Key className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full py-3 pl-11 pr-11 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3.5 shadow-xl shadow-red-600/10 hover:shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
          <Shield className="h-3.5 w-3.5 text-neutral-400" />
          <span>Acesso seguro criptografado com SSL/HTTPS</span>
        </div>
      </div>
    </div>
  );
}

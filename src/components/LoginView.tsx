import React, { useState } from "react";
import { Key, Mail, Eye, EyeOff, Loader2, Shield, User, Phone, Calendar, Users } from "lucide-react";
import Logo from "./Logo";
import { api } from "../lib/api";

interface LoginViewProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign up fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cellGroup, setCellGroup] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const response = await api.register({
          name,
          email,
          password,
          phone,
          birthDate,
          cellGroup,
        });
        onLoginSuccess(response.user, response.token);
      } else {
        const response = await api.login(email, password);
        onLoginSuccess(response.user, response.token);
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor. Verifique os dados inseridos.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setBirthDate("");
    setCellGroup("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#252525] p-8 md:p-10 rounded-3xl border border-neutral-100 dark:border-white/5 shadow-2xl transition-all">
        <div className="flex flex-col items-center">
          <Logo showText={true} size="lg" />
          <h2 className="mt-6 text-center text-2xl font-display font-black text-neutral-800 dark:text-white tracking-tight">
            {isRegistering ? "Crie sua Conta HUIOS" : "Acesse o Portal HUIOS"}
          </h2>
          <p className="mt-2 text-center text-xs text-neutral-400 dark:text-neutral-500 max-w-xs">
            {isRegistering
              ? "Cadastre-se para participar de gincanas, interagir no ranking e acompanhar os avisos em tempo real."
              : "Entre com suas credenciais para participar de gincanas, criar avisos e gerenciar membros."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <span className="mt-0.5 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="space-y-1 text-left animate-in fade-in duration-250">
              <label htmlFor="name" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                Nome Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome Completo"
                  className="w-full py-3 pl-11 pr-4 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label htmlFor="email" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Endereço de E-mail *
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
            <label htmlFor="password" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Senha de Acesso *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Key className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegistering ? "new-password" : "current-password"}
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

          {isRegistering && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-250">
              <div className="space-y-1 text-left">
                <label htmlFor="phone" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full py-3 pl-11 pr-4 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="birthDate" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Data de Nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full py-3 pl-11 pr-4 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left sm:col-span-2">
                <label htmlFor="cellGroup" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Sua Célula / Grupo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <input
                    id="cellGroup"
                    name="cellGroup"
                    type="text"
                    value={cellGroup}
                    onChange={(e) => setCellGroup(e.target.value)}
                    placeholder="Nome ou Líder da sua Célula"
                    className="w-full py-3 pl-11 pr-4 text-xs bg-neutral-50 dark:bg-[#1B1B1B] border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-white rounded-2xl outline-none focus:border-red-600/50 dark:focus:border-red-600/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3.5 shadow-xl shadow-red-600/10 hover:shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>{isRegistering ? "Cadastrando..." : "Entrando..."}</span>
              </>
            ) : (
              <>
                <span>{isRegistering ? "Confirmar Cadastro" : "Entrar no Sistema"}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline transition-colors focus:outline-none cursor-pointer"
          >
            {isRegistering
              ? "Já tem uma conta? Entre aqui"
              : "Não tem uma conta? Cadastre-se aqui"}
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
          <Shield className="h-3.5 w-3.5 text-neutral-400" />
          <span>Acesso seguro criptografado com SSL/HTTPS</span>
        </div>
      </div>
    </div>
  );
}

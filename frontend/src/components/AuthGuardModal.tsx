// src/components/AuthGuardModal.tsx
// Modal de connexion inline — affiché quand l'utilisateur n'est pas connecté
import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Mail, Lock, Loader2, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

type Props = {
  onSuccess: () => void;   // callback après connexion réussie
  onClose:   () => void;
};

export default function AuthGuardModal({ onSuccess, onClose }: Props) {
  const { login, loading } = useAuth();
  const { t } = useLang();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await login({ email, password });
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
  }

  // Fermer avec Escape
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header vert */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-7 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold">{t("auth.loginRequired")}</h2>
              <p className="text-[12px] text-white/80 mt-0.5">{t("auth.loginDesc")}</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="px-7 py-6 space-y-4">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-[12px] text-red-700">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.email")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.password")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Bouton login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-700 text-white font-bold text-[14px] hover:bg-green-800 transition-all disabled:opacity-60"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />{t("auth.loggingIn")}</>
              : t("auth.login")
            }
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-1 border-t" />
            <span className="text-[11px] text-gray-400">{t("auth.or")}</span>
            <div className="flex-1 border-t" />
          </div>

          {/* Créer un compte */}
          <Link
            to="/register"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-green-700 text-green-700 font-bold text-[14px] hover:bg-green-50 transition-colors"
          >
            {t("auth.register")}
          </Link>

          {/* Continuer sans compte */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-[12px] text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            {t("auth.continueGuest")}
          </button>
        </form>
      </div>
    </div>
  );
}

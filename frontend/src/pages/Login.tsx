import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { AuthResult } from "../context/AuthContext";

const Logo = "/images/Logo_ST.png";

type FormState = { email: string; password: string };

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [form, setForm]       = useState<FormState>({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");

  // Force les champs vides à chaque montage (empêche l'autocomplétion du navigateur)
  useEffect(() => { setForm({ email: "", password: "" }); }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
    const result: AuthResult = await login({ email: form.email, password: form.password });
    if (!result.success) { setError(result.error); return; }
    // Rediriger selon le rôle ou la page demandée
    navigate(from === "/login" || from === "/register" ? "/" : from, { replace: true });
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Formulaire ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white overflow-y-auto">

        {/* Navigation haut */}
        <div className="w-full max-w-[400px] flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:underline">
            <Home className="w-4 h-4" /> Accueil
          </Link>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={Logo} alt="SmartTour Logo" className="w-32 h-18 rounded-full" />
        </Link>

        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Bon retour</h1>
          <p className="text-sm text-gray-500 mb-8">Connectez-vous pour accéder à vos itinéraires et favoris.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate autoComplete="off">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="votre@email.com" autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Mot de passe</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="off"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-800 active:scale-[.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Connexion...</> : "Se connecter"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-green-700 font-bold hover:underline">Créer un compte</Link>
          </p>

          <p className="text-center text-sm text-gray-400 mt-3">
            <Link to="/" className="hover:text-green-700 hover:underline transition-colors">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>

      {/* Panneau visuel droit */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ backgroundImage:"url('/images/amazone.jpg')", backgroundSize:"cover", backgroundPosition:"center" }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 -top-20 -right-20" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 bottom-10 -left-16" />
        <div className="relative z-10 text-center px-12">
          <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
            Explorez le Bénin<br />à votre rythme
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mx-auto">
            Itinéraires personnalisés, sites incontournables, budget maîtrisé — tout en un seul endroit.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-left max-w-xs mx-auto">
            {["12 sites touristiques référencés","Carte interactive avec itinéraire optimal","Météo et trafic en temps réel"].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

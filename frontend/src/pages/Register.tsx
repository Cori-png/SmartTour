import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { AuthResult } from "../context/AuthContext";

const Logo = "/images/Logo_ST.png";

 
type FormState = {
  nom: string;
  email: string;
  password: string;
  confirm: string;
};

type PwdRule = {
  label: string;
  test: (p: string) => boolean;
};


const PWD_RULES: PwdRule[] = [
  { label: "Au moins 6 caractères", test: (p) => p.length >= 6 },
  { label: "Une lettre majuscule",  test: (p) => /[A-Z]/.test(p) },
  { label: "Un chiffre",            test: (p) => /\d/.test(p) },
];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ nom: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [error, setError] = useState("");

  // Force les champs vides à chaque montage (empêche l'autocomplétion du navigateur)
  useEffect(() => { setForm({ nom: "", email: "", password: "", confirm: "" }); }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.nom || !form.email || !form.password || !form.confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!PWD_RULES.every((r) => r.test(form.password))) {
      setError("Le mot de passe ne respecte pas les critères requis.");
      return;
    }

    const result: AuthResult = await register({
      nom: form.nom,
      email: form.email,
      password: form.password,
    });
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate("/", { replace: true });
  }

  const pwdOk = PWD_RULES.every((r) => r.test(form.password));
  const confirmMismatch = form.confirm.length > 0 && form.confirm !== form.password;

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau visuel gauche ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ backgroundImage: "url('/images/amazone.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/40" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 -bottom-20 -left-20" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 top-10 -right-16" />
        <div className="relative z-10 text-center px-12">
         
          <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
            Commencez votre<br />aventure béninoise
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm mx-auto">
            Créez votre compte gratuit et planifiez vos premiers itinéraires en quelques minutes.
          </p>
          <div className="flex flex-col gap-3 mt-10 text-left max-w-xs mx-auto">
            {[
              "Itinéraires générés automatiquement",
              "Informations météo et trafic en temps réel",
              "Sauvegarde et partage de vos voyages",
              "Estimation précise de votre budget",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Formulaire ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white overflow-y-auto">

        {/* Navigation haut */}
        <div className="w-full max-w-[420px] flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:underline">
            <Home className="w-4 h-4" /> Accueil
          </Link>
        </div>

        <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={Logo} alt="SmartTour Logo" className="w-32 h-18 rounded-full"/>   
        </Link>

        <div className="w-full max-w-[420px]">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Créer un compte</h1>
          <p className="text-sm text-gray-500 mb-7">C'est gratuit et prend moins d'une minute.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate autoComplete="off">

            {/* Nom */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Indicateur règles */}
              {(pwdFocus || form.password.length > 0) && (
                <div className="mt-2.5 flex flex-col gap-1.5 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  {PWD_RULES.map((rule) => {
                    const ok = rule.test(form.password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${ok ? "text-green-600" : "text-gray-300"}`} />
                        <span className={`text-xs transition-colors ${ok ? "text-green-700 font-medium" : "text-gray-400"}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    confirmMismatch
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-green-500"
                  }`}
                />
              </div>
              {confirmMismatch && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !pwdOk || confirmMismatch || form.confirm.length === 0}
              className="w-full py-3.5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-800 active:scale-[.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Création du compte...</>
                : "Créer mon compte"
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-green-700 font-bold hover:underline">Se connecter</Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-3">
            <Link to="/" className="hover:text-green-700 hover:underline transition-colors">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

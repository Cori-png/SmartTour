// src/pages/ClientDashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, Star, History, Pencil, Eye, Trash2, Plus, LogOut, Settings,
  Download, Share2, Mail, X, Send, CheckCircle2, Bell } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useItinerary } from "../context/ItineraryContext";

const MOCK_FAVORITES = [
  { id:"f1", nom:"Palais Royal d'Abomey",    ville:"Abomey",    note:4.9, cat:"histoire" },
  { id:"f2", nom:"Parc de la Pendjari",       ville:"Tanguiéta", note:4.9, cat:"nature"   },
  { id:"f3", nom:"Village lacustre de Ganvié",ville:"Cotonou",   note:4.7, cat:"culture"  },
];

const CAT: Record<string,string> = {
  histoire:"bg-amber-100 text-amber-700", nature:"bg-emerald-100 text-emerald-700",
  culture:"bg-purple-100 text-purple-700", plage:"bg-cyan-100 text-cyan-700",
};

type Tab = "itineraires" | "historique" | "favoris" | "profil";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itinerarySites, optimizedRoute } = useItinerary();

  const [tab, setTab]           = useState<Tab>("itineraires");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSent,  setShareSent]  = useState(false);

  if (!user) return null;
  const initials = user.nom.split(" ").map(w => w[0]?.toUpperCase() ?? "").slice(0,2).join("");
  const hasItinerary = optimizedRoute && optimizedRoute.length > 0;

  // ── Partage par email (mailto) ──────────────────────────────
  function handleShare(e: React.FormEvent) {
    e.preventDefault();
    if (!shareEmail) return;
    const subject = encodeURIComponent("Mon itinéraire SmartTour Bénin");
    const body = encodeURIComponent(
      `Bonjour,\n\nJe partage avec toi mon itinéraire SmartTour :\n\n` +
      (optimizedRoute ?? []).map((s,i) => `${i+1}. ${s.nom} - ${s.ville}`).join("\n") +
      `\n\nGénéré sur SmartTour Bénin — https://smarttour.bj`
    );
    window.open(`mailto:${shareEmail}?subject=${subject}&body=${body}`, "_blank");
    setShareSent(true);
    setTimeout(() => { setShareSent(false); setShareOpen(false); setShareEmail(""); }, 2500);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8 space-y-6">

        {/* Header profil */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-500 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-extrabold">{initials}</div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold opacity-70 uppercase tracking-wider">Bienvenue</p>
            <h1 className="text-[22px] font-extrabold mt-0.5">{user.nom}</h1>
            <p className="text-[12px] opacity-70">{user.email} · Touriste</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTab("profil")} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-[12px] font-semibold transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Modifier le profil
            </button>
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[12px] font-semibold transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
          {([
            { key:"itineraires", label:"Mes itinéraires", Icon:Map     },
            { key:"historique",  label:"Historique",      Icon:History },
            { key:"favoris",     label:"Favoris",         Icon:Star    },
            { key:"profil",      label:"Profil & Paramètres", Icon:Settings },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 whitespace-nowrap transition-colors ${tab===t.key ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              <t.Icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* ── Itinéraires ── */}
        {tab === "itineraires" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900">Mes itinéraires sauvegardés</h2>
              <button onClick={() => navigate("/explorer")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white text-[12px] font-bold hover:bg-green-800 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Créer un itinéraire
              </button>
            </div>
            {!hasItinerary ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Map className="w-8 h-8 text-gray-300" /></div>
                <p className="text-[14px] font-semibold text-gray-500">Aucun itinéraire sauvegardé</p>
                <p className="text-[12px] text-gray-400 mt-1">Planifiez et imprimez votre première visite pour la voir ici.</p>
                <button onClick={() => navigate("/explorer")} className="mt-4 px-5 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-bold hover:bg-green-800 transition-colors">
                  Explorer les sites →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {(optimizedRoute ?? []).map((s, i) => (
                  <div key={s._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-8 h-8 rounded-xl bg-green-700 flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[13px]">{s.nom}</p>
                      <p className="text-[11px] text-gray-400">{s.ville} · {s.dureeVisite}h de visite</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate("/itineraire")} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setShareOpen(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"><Share2 className="w-4 h-4" /></button>
                      <button onClick={() => window.print()} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"><Download className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Historique ── */}
        {tab === "historique" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" />Historique des visites & recherches</h2>
            </div>
            {!hasItinerary ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><History className="w-8 h-8 text-gray-300" /></div>
                <p className="text-[14px] font-semibold text-gray-500">Aucun historique disponible</p>
                <p className="text-[12px] text-gray-400 mt-1">Votre historique de visites apparaîtra ici après votre première planification.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {(optimizedRoute ?? []).map((s, i) => (
                  <div key={s._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <History className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[13px]">{s.nom}</p>
                      <p className="text-[11px] text-gray-400">{s.ville} · Visité le {new Date().toLocaleDateString("fr-FR")}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${CAT[s.categorie] ?? "bg-gray-100 text-gray-600"}`}>{s.categorie}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Favoris ── */}
        {tab === "favoris" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />Destinations populaires aimées</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_FAVORITES.map(fav => (
                <div key={fav.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-[13px]">{fav.nom}</p>
                    <p className="text-[11px] text-gray-400">{fav.ville} · ⭐ {fav.note}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${CAT[fav.cat] ?? "bg-gray-100"}`}>{fav.cat}</span>
                  <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Profil & Paramètres ── */}
        {tab === "profil" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Modifier profil */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><Pencil className="w-4 h-4 text-green-600" />Modifier le profil</h2>
              {[{ label:"Nom complet", value:user.nom, type:"text" }, { label:"Adresse e-mail", value:user.email, type:"email" }].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{f.label}</label>
                  <input defaultValue={f.value} type={f.type} className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-bold hover:bg-green-800 transition-colors w-full justify-center">
                <CheckCircle2 className="w-4 h-4" /> Enregistrer
              </button>
            </div>

            {/* Paramètres & Déconnexion */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-500" />Notifications</h2>
                {["Alertes météo pour mes itinéraires","Nouvelles recommandations de sites","Rappels de voyage"].map(notif => (
                  <label key={notif} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-green-600 w-4 h-4" />
                    <span className="text-[13px] text-gray-700">{notif}</span>
                  </label>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-[14px] font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-500" />Compte</h2>
                <button onClick={() => { logout(); navigate("/"); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-100 text-red-500 text-[13px] font-bold hover:bg-red-50 transition-colors w-full justify-center">
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Partage par Email ── */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-green-600" />Partager par email</h3>
              <button onClick={() => setShareOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleShare} className="p-6 space-y-4">
              {shareSent ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-800">Email ouvert !</p>
                  <p className="text-[12px] text-gray-400 mt-1">Votre client email a été lancé.</p>
                </div>
              ) : (
                <>
                  <p className="text-[12px] text-gray-500">Envoyez votre itinéraire à un ami ou un contact.</p>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Email du destinataire</label>
                    <input type="email" required value={shareEmail} onChange={e => setShareEmail(e.target.value)}
                      placeholder="ami@example.com"
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShareOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-bold hover:bg-green-800 transition-colors">
                      <Send className="w-4 h-4" /> Partager
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

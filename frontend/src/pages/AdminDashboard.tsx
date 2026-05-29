// src/pages/AdminDashboard.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Users, BarChart3, Plus, Pencil, Trash2, LogOut, Shield, X, Save,
  Map, Star, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useSites } from "../context/SitesContext";
import type { Site } from "../components/SiteCard";

const CAT_COLORS: Record<string,string> = {
  histoire:"bg-amber-100 text-amber-700", nature:"bg-emerald-100 text-emerald-700",
  plage:"bg-cyan-100 text-cyan-700", culture:"bg-purple-100 text-purple-700",
  religion:"bg-rose-100 text-rose-700",
};

type Tab = "sites" | "users" | "reviews" | "stats";

type SiteForm = { nom:string; ville:string; categorie:string; prix:string; horaires:string; description:string; dureeVisite:string; };
const EMPTY_FORM: SiteForm = { nom:"", ville:"", categorie:"histoire", prix:"0", horaires:"", description:"", dureeVisite:"1" };

function StatCard({ label, value, color, icon }: { label:string; value:string|number; color:string; icon:ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div><p className="text-[10px] sm:text-[11px] font-bold uppercase text-gray-400">{label}</p><p className="text-[18px] sm:text-[22px] font-extrabold text-gray-900">{value}</p></div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, allUsers, deleteUser } = useAuth();
  const { sites, addSite, updateSite, deleteSite } = useSites();
  const [tab, setTab] = useState<Tab>("sites");

  const [reviews, setReviews] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("smarttour-reviews") ?? "[]"); } catch { return []; }
  });

  function handleDeleteReview(id: string) {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem("smarttour-reviews", JSON.stringify(updated));
  }

  // Modal Add/Edit
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Site | null>(null);
  const [form,       setForm]       = useState<SiteForm>(EMPTY_FORM);

  function openAdd() { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(s: Site) {
    setEditTarget(s);
    setForm({ nom:s.nom, ville:s.ville, categorie:s.categorie, prix:String(s.prix),
      horaires:s.horaires, description:s.description, dureeVisite:String(s.dureeVisite) });
    setModalOpen(true);
  }
  function closeModal() { setModalOpen(false); setEditTarget(null); setForm(EMPTY_FORM); }

  function handleSave() {
    if (!form.nom.trim() || !form.ville.trim()) return;
    const base = {
      nom: form.nom, ville: form.ville, categorie: form.categorie,
      prix: Number(form.prix), horaires: form.horaires, description: form.description,
      dureeVisite: Number(form.dureeVisite), images: [], tags: [],
      noteMoyenne: 0, nombreAvis: 0, coordonnees: { lat: 6.3654, lng: 2.4183 },
    };
    if (editTarget) { updateSite({ ...editTarget, ...base }); }
    else { addSite(base as Omit<Site,"_id"|"score">); }
    closeModal();
  }

  const tourists = allUsers.filter(u => u.role === "tourist");
  const totalReviews = reviews.length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-600 rounded-3xl p-6 text-white flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><Shield className="w-8 h-8" /></div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold opacity-70 uppercase tracking-wider">Administration SmartTour</p>
            <h1 className="text-[18px] sm:text-[22px] font-extrabold">Tableau de bord Admin</h1>
            <p className="text-[12px] opacity-70">{user.email}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-[12px] sm:text-[13px] font-semibold transition-colors">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Sites enregistrés"   value={sites.length}                       color="bg-green-50"  icon={<Map className="w-5 h-5 text-green-600" />} />
          <StatCard label="Utilisateurs"         value={tourists.length}                    color="bg-blue-50"   icon={<Users className="w-5 h-5 text-blue-600" />} />
          <StatCard label="Itinéraires générés"  value="3 271"                               color="bg-purple-50" icon={<BarChart3 className="w-5 h-5 text-purple-600" />} />
          <StatCard label="Avis reçus"           value={totalReviews.toLocaleString("fr-FR")}  color="bg-amber-50"  icon={<Star className="w-5 h-5 text-amber-500" />} />
        </div>

        {/* Onglets */}
        <div className="flex gap-2 border-b border-gray-200">
          {([
            { key:"sites", label:"Gérer les sites",         Icon:Globe      },
            { key:"users", label:"Gérer les utilisateurs",  Icon:Users      },
            { key:"reviews", label:"Gérer les avis",        Icon:MessageSquare },
            { key:"stats", label:"Statistiques",            Icon:BarChart3  },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${tab===t.key ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              <t.Icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* ── SITES ── */}
        {tab === "sites" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900">Sites touristiques ({sites.length})</h2>
              <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white text-[12px] font-bold hover:bg-green-800 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Ajouter un site
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Nom","Ville","Catégorie","Prix","Note","Avis","Durée","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sites.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 max-w-[160px]"><span className="line-clamp-1">{s.nom}</span></td>
                      <td className="px-4 py-3 text-gray-500">{s.ville}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${CAT_COLORS[s.categorie]??"bg-gray-100 text-gray-600"}`}>{s.categorie}</span></td>
                      <td className="px-4 py-3 text-gray-500">{s.prix === 0 ? "Gratuit" : `${s.prix.toLocaleString("fr-FR")} FCFA`}</td>
                      <td className="px-4 py-3 font-semibold text-amber-500">⭐ {s.noteMoyenne ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-500">{s.nombreAvis ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500">{s.dureeVisite}h</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => { if(confirm(`Supprimer "${s.nom}" ?`)) deleteSite(s._id); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900">Touristes inscrits ({tourists.length})</h2>
            </div>
            {tourists.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-[13px]">Aucun touriste inscrit pour le moment.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Utilisateur","Email","Inscrit le","Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tourists.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-[12px]">{u.nom.charAt(0).toUpperCase()}</div>
                            <span className="font-semibold text-gray-900">{u.nom}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3.5 text-gray-500">{u.createdAt}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => { if(confirm(`Supprimer l'utilisateur "${u.nom}" ?`)) deleteUser(u.id); }}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS ── */}
        {tab === "reviews" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-gray-900">Avis et témoignages sur la plateforme ({reviews.length})</h2>
            </div>
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-[13px]">Aucun avis n'a été publié pour le moment.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Auteur", "Note", "Commentaire", "Date", "Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reviews.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[12px]">
                              {r.nom.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{r.nom}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-amber-500">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= r.note
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200 fill-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 max-w-[320px]">
                          <p className="line-clamp-2 italic">« {r.commentaire} »</p>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">{r.date}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer le témoignage de "${r.nom}" ?`)) {
                                handleDeleteReview(r.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-600" />Répartition par catégorie</h2>
            {(["histoire","culture","nature","religion","plage"] as const).map(cat => {
              const count = sites.filter(s => s.categorie === cat).length;
              const pct = sites.length ? Math.round((count/sites.length)*100) : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${CAT_COLORS[cat]??"bg-gray-100"}`}>{cat}</span>
                    <span className="text-[12px] font-bold text-gray-500">{count} site{count>1?"s":""} · {pct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{width:`${pct}%`}} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL Add/Edit Site ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-[15px] font-bold text-gray-900">{editTarget ? "Modifier le site" : "Ajouter un site"}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {([
                { label:"Nom du site",    field:"nom",         type:"text"   },
                { label:"Ville",          field:"ville",       type:"text"   },
                { label:"Prix (FCFA)",    field:"prix",        type:"number" },
                { label:"Horaires",       field:"horaires",    type:"text"   },
                { label:"Durée visite (h)",field:"dureeVisite",type:"number" },
              ] as const).map(({label, field, type}) => (
                <div key={field}>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{label}</label>
                  <input type={type} value={form[field]} onChange={e => setForm(f => ({...f, [field]: e.target.value}))}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Catégorie</label>
                <select value={form.categorie} onChange={e => setForm(f => ({...f, categorie: e.target.value}))}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 transition-all">
                  {["histoire","culture","nature","religion","plage"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-bold hover:bg-green-800 transition-colors">
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

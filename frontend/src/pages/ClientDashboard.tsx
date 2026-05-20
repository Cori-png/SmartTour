// src/pages/ClientDashboard.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Map, Star, History, Pencil, LogOut, Settings,
  Share2, Mail, X, Send, CheckCircle2, Bell,
  Plus, Trash2, MapPin, Clock, Wallet, Navigation,
  Route, ChevronDown, ChevronUp, BookmarkCheck, Eye, FileText,
} from "lucide-react";
import SavedItineraryDetail from "../components/SavedItineraryDetail";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useItinerary } from "../context/ItineraryContext";
import type { SavedItinerary } from "../context/ItineraryContext";
import { useSavedItineraries } from "../hooks/useSavedItineraries";

const MOCK_FAVORITES = [
  { id:"f1", nom:"Palais Royal d'Abomey",    ville:"Abomey",    note:4.9, cat:"histoire" },
  { id:"f2", nom:"Parc de la Pendjari",       ville:"Tanguiéta", note:4.9, cat:"nature"   },
  { id:"f3", nom:"Village lacustre de Ganvié",ville:"Cotonou",   note:4.7, cat:"culture"  },
];

const CAT: Record<string,string> = {
  histoire:"bg-amber-100 text-amber-700", nature:"bg-emerald-100 text-emerald-700",
  culture:"bg-purple-100 text-purple-700", plage:"bg-cyan-100 text-cyan-700",
  religion:"bg-rose-100 text-rose-700",
};

type Tab = "itineraires" | "historique" | "favoris" | "profil";

function fmtH(h: number) {
  if (h < 1) return `${h * 60} min`;
  if (h === 1) return "1h";
  if (Number.isInteger(h)) return `${h}h`;
  return `${Math.floor(h)}h${((h % 1) * 60) | 0}`;
}

// ── Carte d'itinéraire sauvegardé ────────────────────────────
function SavedItineraryCard({
  itinerary, onDelete, onShare, onView, onPrint,
}: {
  itinerary: SavedItinerary;
  onDelete: (id: string) => void;
  onShare:  (it: SavedItinerary) => void;
  onView:   () => void;
  onPrint:  () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(itinerary.savedAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* En-tête */}
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <Route className="w-5 h-5 text-green-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-[14px] line-clamp-1">{itinerary.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Sauvegardé le {date}</p>

          {/* Stats inline */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-[12px] text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-green-500" />
              {itinerary.sites.length} étape{itinerary.sites.length > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-500">
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
              {itinerary.totalKm} km
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-500">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              {itinerary.totalEntree === 0 ? "Gratuit" : `${itinerary.totalEntree.toLocaleString("fr-FR")} FCFA`}
            </span>
            {itinerary.startPosition && (
              <span className="text-[11px] text-green-600 font-medium">
                Départ : {itinerary.startPosition.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onView} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Voir (Carte, Météo, Trafic)">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onPrint} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Exporter en PDF">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={() => onShare(itinerary)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Partager">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(itinerary.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Supprimer">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => setExpanded(o => !o)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title={expanded ? "Réduire" : "Voir les étapes"}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Détails étapes (accordion) */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-green-600" />
            <h3 className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">Ordre de visite optimisé</h3>
          </div>
          <ol className="divide-y divide-gray-50">
            {itinerary.sites.map((site, i) => (
              <li key={site._id} className="flex items-start gap-3 px-5 py-3.5">
                {/* Numéro */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white ${
                  i === 0 ? "bg-green-600" : i === itinerary.sites.length - 1 ? "bg-red-500" : "bg-blue-500"
                }`}>{i + 1}</div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-[13px]">{site.nom}</p>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin className="w-3 h-3 text-green-500" />{site.ville}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />{fmtH(site.dureeVisite)}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-semibold ${site.prix === 0 ? "text-emerald-600" : "text-gray-500"}`}>
                      <Wallet className="w-3 h-3" />
                      {site.prix === 0 ? "Gratuit" : `${site.prix.toLocaleString("fr-FR")} FCFA`}
                    </span>
                    {site.categorie && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${CAT[site.categorie] ?? "bg-gray-100 text-gray-600"}`}>
                        {site.categorie}
                      </span>
                    )}
                  </div>
                </div>

                {/* Note */}
                {site.noteMoyenne && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold flex-shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{site.noteMoyenne.toFixed(1)}
                  </span>
                )}
              </li>
            ))}
          </ol>
          {/* Récap budget */}
          <div className="px-5 py-3 border-t border-gray-100 bg-green-50 flex items-center justify-between">
            <span className="text-[11px] text-green-600 font-semibold">Total entrées</span>
            <span className="text-[13px] font-extrabold text-green-700">
              {itinerary.totalEntree === 0 ? "Gratuit" : `${itinerary.totalEntree.toLocaleString("fr-FR")} FCFA`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────
export default function ClientDashboard() {
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const { optimizedRoute } = useItinerary();
  const { savedItineraries, deleteItinerary: deleteSavedItinerary } = useSavedItineraries(user?.id);

  const [tab,          setTab]          = useState<Tab>("itineraires");
  const [shareOpen,    setShareOpen]    = useState(false);
  const [shareTarget,  setShareTarget]  = useState<SavedItinerary | null>(null);
  const [shareEmail,   setShareEmail]   = useState("");
  const [shareSent,    setShareSent]    = useState(false);
  const [detailItem,   setDetailItem]   = useState<SavedItinerary | null>(null);

  function generatePDF(it: SavedItinerary) {
    const doc = new jsPDF();
    
    // Header band
    doc.setFillColor(21, 128, 61); // green-700
    doc.rect(0, 0, 210, 40, "F");
    
    // Logo SmartTour
    try {
      doc.addImage("/images/Logo_ST.png", "PNG", 15, 6, 50, 28);
    } catch (e) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("SMARTTOUR", 15, 22);
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("Votre itinéraire de voyage intelligent optimisé", 72, 20);
    doc.text(`Généré le ${new Date(it.savedAt).toLocaleDateString("fr-FR")}`, 72, 28);
    
    // Title with arrow replaced by ~ to avoid encoding issues in standard PDF fonts
    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(it.name.replace(/ → /g, " ~ "), 15, 55);
    
    // Stats Summary Boxes
    doc.setFillColor(240, 253, 244);
    doc.rect(15, 65, 55, 20, "F");
    doc.setDrawColor(187, 247, 208);
    doc.rect(15, 65, 55, 20, "S");
    doc.setTextColor(21, 128, 61);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${it.totalKm} km`, 20, 74);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("DISTANCE TOTALE", 20, 80);
    
    doc.setFillColor(239, 246, 255);
    doc.rect(78, 65, 55, 20, "F");
    doc.setDrawColor(191, 219, 254);
    doc.rect(78, 65, 55, 20, "S");
    doc.setTextColor(29, 78, 216);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${it.sites.length} etapes`, 83, 74);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("NOMBRE D'ETAPES", 83, 80);
    
    doc.setFillColor(254, 243, 199);
    doc.rect(140, 65, 55, 20, "F");
    doc.setDrawColor(253, 230, 138);
    doc.rect(140, 65, 55, 20, "S");
    doc.setTextColor(180, 83, 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(it.totalEntree === 0 ? "Gratuit" : `${it.totalEntree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} F`, 145, 74);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("COUT TOTAL ENTREES", 145, 80);
    
    // Start Position
    let y = 95;
    if (it.startPosition) {
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("POINT DE DEPART :", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(it.startPosition.label, 60, y);
      y += 12;
    }
    
    // Steps Title
    doc.setTextColor(21, 128, 61);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LISTE DES ETAPES DANS L'ORDRE OPTIMISE", 15, y);
    y += 8;
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(229, 231, 235);
    doc.line(15, y, 195, y);
    y += 10;
    
    it.sites.forEach((site, index) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      
      // Step Circle
      doc.setFillColor(index === 0 ? 21 : (index === it.sites.length - 1 ? 220 : 37), index === 0 ? 128 : (index === it.sites.length - 1 ? 38 : 99), index === 0 ? 61 : (index === it.sites.length - 1 ? 38 : 235));
      doc.circle(20, y - 2, 4, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${index + 1}`, index >= 9 ? 18.5 : 19.2, y - 0.5);
      
      // Site Name
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(site.nom, 28, y - 1);
      
      // Details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(107, 114, 128);
      const details = `${site.ville}   |   Duree: ${fmtH(site.dureeVisite)}   |   Categorie: ${site.categorie || "Histoire"}   |   Tarif: ${site.prix === 0 ? "Gratuit" : site.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA"}`;
      doc.text(details, 28, y + 4);
      
      y += 16;
    });
    
    // Page border & footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(229, 231, 235);
      doc.rect(5, 5, 200, 287, "S");
      
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("SmartTour Benin - Votre compagnon de voyage intelligent au Benin - https://smarttour.bj", 15, 285);
      doc.text(`Page ${i}/${pageCount}`, 180, 285);
    }
    
    doc.save(`itineraire-smarttour-${it.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`);
  }

  function printItinerary(it: SavedItinerary) {
    generatePDF(it);
  }

  if (!user) return null;
  const initials = user.nom.split(" ").map(w => w[0]?.toUpperCase() ?? "").slice(0,2).join("");

  // ── Partage par email (mailto) ──────────────────────────────
  function handleShare(e: FormEvent) {
    e.preventDefault();
    if (!shareEmail || !shareTarget) return;
    
    // 1. Generate and download PDF instantly for user to attach
    generatePDF(shareTarget);
    
    // 2. Open email client with professional template pointing out PDF download
    const subject = encodeURIComponent(`Itinéraire de voyage : ${shareTarget.name}`);
    const body = encodeURIComponent(
      `Bonjour,\n\n` +
      `Je vous prie de trouver ci-joint l'itinéraire de voyage complet généré sur SmartTour Bénin.\n\n` +
      `--------------------------------------------------\n` +
      `📋 RÉCAPITULATIF DE L'ITINÉRAIRE\n` +
      `--------------------------------------------------\n` +
      `📍 Destination : ${shareTarget.name}\n` +
      `🚗 Distance totale : ${shareTarget.totalKm} km\n` +
      `🏛️ Nombre d'étapes : ${shareTarget.sites.length} sites touristiques\n` +
      `🎟️ Coût des entrées : ${shareTarget.totalEntree === 0 ? "Gratuit" : shareTarget.totalEntree.toLocaleString("fr-FR") + " FCFA"}\n\n` +
      `👉 NOTE : Le fichier officiel PDF de cet itinéraire a été généré et téléchargé sur votre appareil sous le nom 'itineraire-smarttour-...pdf'. Pensez à l'attacher à cet e-mail avant l'envoi.\n\n` +
      `Bon voyage avec SmartTour Bénin !`
    );
    
    window.open(`mailto:${shareEmail}?subject=${subject}&body=${body}`, "_blank");
    setShareSent(true);
    setTimeout(() => { setShareSent(false); setShareOpen(false); setShareEmail(""); setShareTarget(null); }, 2500);
  }

  function openShare(it: SavedItinerary) {
    setShareTarget(it);
    setShareOpen(true);
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
              {t.key === "itineraires" && savedItineraries.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">{savedItineraries.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Onglet Itinéraires ── */}
        {tab === "itineraires" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-gray-900">
                Mes itinéraires sauvegardés
                {savedItineraries.length > 0 && <span className="ml-2 text-gray-400 font-normal">({savedItineraries.length})</span>}
              </h2>
              <button onClick={() => navigate("/explorer")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white text-[12px] font-bold hover:bg-green-800 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Créer un itinéraire
              </button>
            </div>

            {savedItineraries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-[14px] font-semibold text-gray-500">Aucun itinéraire sauvegardé</p>
                <p className="text-[12px] text-gray-400 mt-1 max-w-xs mx-auto">
                  Planifiez un itinéraire et cliquez sur "Sauvegarder" pour le retrouver ici.
                </p>
                <button onClick={() => navigate("/explorer")} className="mt-5 px-5 py-2.5 rounded-xl bg-green-700 text-white text-[13px] font-bold hover:bg-green-800 transition-colors">
                  Explorer les sites →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {savedItineraries.map(it => (
                  <SavedItineraryCard
                    key={it.id}
                    itinerary={it}
                    onDelete={deleteSavedItinerary}
                    onShare={openShare}
                    onView={() => setDetailItem(it)}
                    onPrint={() => printItinerary(it)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Historique ── */}
        {tab === "historique" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" />Historique des visites</h2>
            </div>
            {optimizedRoute.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><History className="w-8 h-8 text-gray-300" /></div>
                <p className="text-[14px] font-semibold text-gray-500">Aucun historique disponible</p>
                <p className="text-[12px] text-gray-400 mt-1">Votre historique de visites apparaîtra ici après votre première planification.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {optimizedRoute.map((s, i) => (
                  <div key={s._id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[13px] font-extrabold text-blue-600">{i+1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[13px]">{s.nom}</p>
                      <p className="text-[11px] text-gray-400">{s.ville} · {fmtH(s.dureeVisite)} de visite</p>
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
              <h2 className="text-[14px] font-bold text-gray-900 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />Destinations aimées</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_FAVORITES.map(fav => (
                <div key={fav.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-[13px]">{fav.nom}</p>
                    <p className="text-[11px] text-gray-400">{fav.ville} · Note : {fav.note}/5</p>
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

      {/* ── Modal Partage ── */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-green-600" />Partager par email</h3>
              <button onClick={() => { setShareOpen(false); setShareTarget(null); }} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
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
                  {shareTarget && (
                    <div className="bg-green-50 rounded-xl px-4 py-2.5 text-[12px] text-green-700 font-medium">
                      Partage de : <strong>{shareTarget.name}</strong>
                    </div>
                  )}
                  <p className="text-[12px] text-gray-500">Envoyez cet itinéraire à un ami ou un contact.</p>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Email du destinataire</label>
                    <input type="email" required value={shareEmail} onChange={e => setShareEmail(e.target.value)}
                      placeholder="ami@example.com"
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setShareOpen(false); setShareTarget(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Annuler</button>
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

      {/* Modal détail complet */}
      {detailItem && <SavedItineraryDetail itinerary={detailItem} onClose={()=>setDetailItem(null)} />}

      <Footer />
    </div>
  );
}

// src/pages/PlanifierPage.tsx  
// Page de planification : liste des sites sélectionnés + paramètres + lancement
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Wallet, Trash2, Route, ArrowLeft,
  Star, Car, Tent, UtensilsCrossed,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ItineraryMapView from "../components/ItineraryMapView";
import StartPositionModal from "../components/StartPositionModal";
import { useItinerary, type StartPosition } from "../context/ItineraryContext";
import type { Site } from "../components/SiteCard";

// ── Constantes ────────────────────────────────────────────────
const SEJOURS = [
  { label: "1 jour",    value: "1",   days: 1 },
  { label: "2-3 jours", value: "2-3", days: 2 },
  { label: "4-7 jours", value: "4-7", days: 5 },
  { label: "+ 7 jours", value: "7+",  days: 7 },
];

const TRANSPORTS = [
  { value: "voiture", label: "Voiture",    icon: "🚗", fcfaKm: 120 },
  { value: "taxi",    label: "Taxi",       icon: "🚕", fcfaKm: 180 },
  { value: "moto",    label: "Taxi-moto",  icon: "🛵", fcfaKm: 80  },
  { value: "bus",     label: "Bus",        icon: "🚌", fcfaKm: 50  },
];

const HEBERGEMENTS = [
  { value: "aucun",   label: "Aucun",          icon: "🏠", fcfaNuit: 0     },
  { value: "camping", label: "Camping",         icon: "⛺", fcfaNuit: 3000  },
  { value: "auberge", label: "Auberge",         icon: "🏡", fcfaNuit: 8000  },
  { value: "hotel",   label: "Hôtel",           icon: "🏨", fcfaNuit: 20000 },
  { value: "resort",  label: "Resort",          icon: "🏩", fcfaNuit: 45000 },
];

// ── Haversine ─────────────────────────────────────────────────
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function fmtH(h: number) {
  if (h < 1) return `${h * 60} min`;
  if (h === 1) return "1h";
  if (Number.isInteger(h)) return `${h}h`;
  return `${Math.floor(h)}h${((h % 1) * 60) | 0}`;
}

// ── TSP nearest neighbor (depuis une position de départ) ──────
function tspFromPosition(start: { lat: number; lng: number }, sites: Site[]): Site[] {
  if (sites.length === 0) return [];
  const unvisited = [...sites], result: Site[] = [];
  let current: { lat: number; lng: number } = start;
  while (unvisited.length > 0) {
    let ni = 0, nd = haversineKm(current, unvisited[0].coordonnees);
    for (let i = 1; i < unvisited.length; i++) {
      const d = haversineKm(current, unvisited[i].coordonnees);
      if (d < nd) { nd = d; ni = i; }
    }
    const next = unvisited.splice(ni, 1)[0];
    result.push(next);
    current = next.coordonnees;
  }
  return result;
}

// ── Composant principal ───────────────────────────────────────
export default function PlanifierPage() {
  const navigate  = useNavigate();
  const {
    itinerarySites, sejour, removeSite, clearItinerary, setSejour,
    setStartPosition, setOptimizedRoute,
  } = useItinerary();

  const [transport,    setTransport]    = useState("taxi");
  const [hebergement,  setHebergement]  = useState("hotel");
  const [restauration, setRestauration] = useState(5000);
  const [showModal,    setShowModal]    = useState(false);

  const nbJours = SEJOURS.find((s) => s.value === sejour)?.days ?? 1;

  // ── Budget estimé (aperçu) ────────────────────────────────
  const budgetApercu = useMemo(() => {
    const totalEntree = itinerarySites.reduce((s, x) => s + x.prix, 0);
    let totalKm = 0;
    for (let i = 1; i < itinerarySites.length; i++)
      totalKm += haversineKm(itinerarySites[i - 1].coordonnees, itinerarySites[i].coordonnees);
    const t = TRANSPORTS.find((t) => t.value === transport)?.fcfaKm ?? 120;
    const h = HEBERGEMENTS.find((h) => h.value === hebergement)?.fcfaNuit ?? 20000;
    const transportCost   = Math.round(totalKm * t);
    const hebergementCost = h * Math.max(0, nbJours - 1);
    const restaurationCost = restauration * nbJours;
    return {
      total: totalEntree + transportCost + hebergementCost + restaurationCost,
      km:    Math.round(totalKm),
    };
  }, [itinerarySites, transport, hebergement, restauration, nbJours]);

  // ── Confirmer position → générer route → naviguer ─────────
  function handlePositionConfirm(pos: StartPosition) {
    setStartPosition(pos);
    const route = tspFromPosition(pos, itinerarySites);
    setOptimizedRoute(route);
    setShowModal(false);
    navigate("/itineraire");
  }

  // ── État vide ─────────────────────────────────────────────
  if (itinerarySites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <Route className="w-10 h-10 text-green-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Votre itinéraire est vide</h1>
            <p className="text-gray-500 mt-2 text-[14px]">
              Sélectionnez des sites sur la page Explorer puis cliquez sur "Ajouter à l'itinéraire".
            </p>
          </div>
          <button onClick={() => navigate("/explorer")} className="flex items-center gap-2 px-8 py-3 mb-5 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">
            <MapPin className="w-4 h-4" /> Explorer les sites
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ── En-tête ── */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/explorer")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Planifier mon voyage</h1>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {itinerarySites.length} site{itinerarySites.length > 1 ? "s" : ""} sélectionné{itinerarySites.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button onClick={() => { clearItinerary(); }} className="flex items-center gap-1.5 text-[12px] text-red-500 hover:text-red-700 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Tout effacer
          </button>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col xl:flex-row gap-6">

        {/* ══ COLONNE GAUCHE : paramètres ══ */}
        <div className="w-full xl:w-[420px] flex-shrink-0 flex flex-col gap-5">

          {/* Sites sélectionnés */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h2 className="text-[13px] font-bold text-gray-800">Sites sélectionnés</h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {itinerarySites.map((site, i) => (
                <li key={site._id} className="flex items-start gap-3 px-5 py-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[11px] font-extrabold text-green-700">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-[13px] line-clamp-1">{site.nom}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3 text-green-500" />{site.ville}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />{fmtH(site.dureeVisite)}
                      </span>
                      {site.noteMoyenne && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{site.noteMoyenne.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeSite(site._id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-4 pt-2 border-t border-gray-50">
              <button onClick={() => navigate("/explorer")} className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-[12px] font-semibold text-gray-400 hover:border-green-400 hover:text-green-600 transition-all">
                + Ajouter d'autres sites
              </button>
            </div>
          </div>

          {/* Paramètres de voyage */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
            <h2 className="text-[13px] font-bold text-gray-800">Paramètres du voyage</h2>

            {/* Durée de séjour */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                <Clock className="w-3 h-3 text-green-600" /> Durée de séjour
              </label>
              <div className="flex flex-wrap gap-2">
                {SEJOURS.map((opt) => (
                  <button key={opt.value} onClick={() => setSejour(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${sejour === opt.value ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                <Car className="w-3 h-3 text-green-600" /> Mode de transport
              </label>
              <div className="flex flex-wrap gap-2">
                {TRANSPORTS.map((t) => (
                  <button key={t.value} onClick={() => setTransport(t.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${transport === t.value ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                <Tent className="w-3 h-3 text-green-600" /> Hébergement
              </label>
              <div className="flex flex-wrap gap-2">
                {HEBERGEMENTS.map((h) => (
                  <button key={h.value} onClick={() => setHebergement(h.value)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${hebergement === h.value ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
                    {h.icon} {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Restauration */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                <UtensilsCrossed className="w-3 h-3 text-green-600" /> Restauration / jour
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={30000} step={1000} value={restauration}
                  onChange={(e) => setRestauration(Number(e.target.value))}
                  className="flex-1 accent-green-600" />
                <span className="text-[12px] font-bold text-gray-700 w-28 text-right flex-shrink-0">
                  {restauration.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Budget estimé (aperçu) */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-green-600">Budget estimé</p>
                <p className="text-[24px] font-extrabold text-green-800 mt-0.5">
                  {budgetApercu.total.toLocaleString("fr-FR")} <span className="text-[13px] font-semibold">FCFA</span>
                </p>
                <p className="text-[11px] text-green-600 mt-0.5">pour {nbJours} jour{nbJours > 1 ? "s" : ""} · ~{budgetApercu.km} km</p>
              </div>
              <Wallet className="w-10 h-10 text-green-300" />
            </div>
            <p className="text-[10px] text-green-500 mt-3">* Estimation entrées + transport + hébergement + restauration</p>
          </div>

          {/* ── Bouton lancement ── */}
          <button
            onClick={() => setShowModal(true)}
            disabled={itinerarySites.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-700 text-white font-extrabold text-[15px] hover:bg-green-800 shadow-lg shadow-green-200 active:scale-[0.98] transition-all"
          >
            <Route className="w-5 h-5" />
            Lancer l'itinéraire
          </button>
        </div>

        {/* ══ COLONNE DROITE : Carte aperçu ══ */}
        <div className="flex-1">
          <div className="sticky top-20 rounded-2xl overflow-hidden border border-gray-200" style={{ height: "520px" }}>
            <ItineraryMapView sites={itinerarySites} launched={false} visible={true} />
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Modal position ── */}
      {showModal && (
        <StartPositionModal
          onConfirm={handlePositionConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

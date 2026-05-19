// src/components/SiteDetailModal.tsx
// Modal de détail d'un site touristique — s'ouvre à la place d'une navigation
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  X, MapPin, Clock, Wallet, Star, Tag,
  Activity, Shield, Utensils, BedDouble, Wine, Pill,
  CalendarClock, Plus,
} from "lucide-react";
import type { Site } from "./SiteCard";
import SiteMiniMap from "./SiteMiniMap";
import { useNearbyServices } from "../hooks/useNearbyServices";
import type { ServiceType, NearbyService } from "../hooks/useNearbyServices";

// ── Config couleurs catégories ───────────────────────────────
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  histoire:    { bg: "bg-amber-100",  text: "text-amber-700"  },
  culture:     { bg: "bg-purple-100", text: "text-purple-700" },
  nature:      { bg: "bg-emerald-100",text: "text-emerald-700"},
  plage:       { bg: "bg-cyan-100",   text: "text-cyan-700"   },
  religion:    { bg: "bg-indigo-100", text: "text-indigo-700" },
};

// ── Config icônes services ───────────────────────────────────
const SVC_CFG: Record<ServiceType, { icon: ReactNode; bg: string; color: string; label: string }> = {

  hospital:   { icon: <Activity className="w-3.5 h-3.5" />, bg: "bg-red-100",     color: "text-red-600",     label: "Hôpital"      },
  police:     { icon: <Shield   className="w-3.5 h-3.5" />, bg: "bg-blue-100",    color: "text-blue-600",    label: "Police"       },
  restaurant: { icon: <Utensils className="w-3.5 h-3.5" />, bg: "bg-orange-100",  color: "text-orange-600",  label: "Restaurant"   },
  lodging:    { icon: <BedDouble className="w-3.5 h-3.5"/>, bg: "bg-emerald-100", color: "text-emerald-600", label: "Hôtel"        },
  bar:        { icon: <Wine     className="w-3.5 h-3.5" />, bg: "bg-amber-100",   color: "text-amber-600",   label: "Bar"          },
  pharmacy:   { icon: <Pill     className="w-3.5 h-3.5" />, bg: "bg-pink-100",    color: "text-pink-600",    label: "Pharmacie"    },
};

// ── Helpers ──────────────────────────────────────────────────
function formatPrix(prix: number) {
  return prix === 0 ? "Gratuit" : `${prix.toLocaleString("fr-FR")} FCFA`;
}

function formatDuree(h: number) {
  if (h < 1)              return `${h * 60} min`;
  if (h === 1)            return "1h";
  if (Number.isInteger(h)) return `${h}h`;
  return `${Math.floor(h)}h${((h % 1) * 60) | 0}`;
}

// ── Chip service dans le modal ───────────────────────────────
function ServiceRow({ service }: { service: NearbyService }) {
  const cfg = SVC_CFG[service.type];
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-gray-800 truncate">{service.nom}</p>
        <p className="text-[11px] text-gray-400">{cfg.label}</p>
      </div>
      <span className="text-[11px] font-medium text-gray-500 flex-shrink-0">
        {service.distance}
      </span>
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────
type Props = {
  site: Site;
  onClose: () => void;
  onAddToItinerary?: (site: Site) => void;
};

// ── Composant principal ──────────────────────────────────────
export default function SiteDetailModal({ site, onClose, onAddToItinerary }: Props) {
  const [isVisible, setIsVisible]   = useState(false);
  const [imgError,  setImgError]    = useState(false);
  const [showAll,   setShowAll]     = useState(false);

  const catStyle = CAT_COLORS[site.categorie] ?? { bg: "bg-gray-100", text: "text-gray-600" };

  // Services à proximité (cache sessionStorage → pas de double fetch)
  const { services, loading: svcLoading } = useNearbyServices(site.coordonnees, true);
  const MAX_SVC = 4;
  const visibleServices = showAll ? services : services.slice(0, MAX_SVC);
  const extraSvc        = services.length - MAX_SVC;

  // ── Animation d'entrée ────────────────────────────────────
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Fermeture avec animation ──────────────────────────────
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 280);
  };

  // ── Fermeture sur touche ESC ──────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Bloquer le scroll du body ────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hasImage = site.images[0] && !imgError;

  return (
    /* ── Backdrop ── */
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleClose}
    >
      {/* ── Modal ── */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Bouton fermeture ── */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Hero image ── */}
        <div className="relative h-60 md:h-72 bg-gradient-to-br from-green-50 to-emerald-100 flex-shrink-0 overflow-hidden rounded-t-2xl">
          {hasImage ? (
            <img
              src={site.images[0]}
              alt={site.nom}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl opacity-30">🏛️</span>
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Badge catégorie */}
          <span
            className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[11px] font-bold ${catStyle.bg} ${catStyle.text}`}
          >
            {site.categorie.charAt(0).toUpperCase() + site.categorie.slice(1)}
          </span>

          {/* Rating (top-right) */}
          {site.noteMoyenne && (
            <div className="absolute top-4 right-12 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-gray-800">{site.noteMoyenne.toFixed(1)}</span>
              {site.nombreAvis && (
                <span className="text-[10px] text-gray-500">({site.nombreAvis})</span>
              )}
            </div>
          )}

          {/* Titre + ville en overlay bas */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <h2 className="text-white text-xl md:text-2xl font-extrabold leading-tight drop-shadow">
              {site.nom}
            </h2>
            <p className="flex items-center gap-1.5 text-white/80 text-[13px] mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {site.ville}, Bénin
            </p>
          </div>
        </div>

        {/* ── Contenu ── */}
        <div className="p-6">

          {/* ── Infos rapides ── */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2.5">
              <CalendarClock className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Horaires</p>
                <p className="text-[12px] font-bold text-gray-800">{site.horaires}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 ${site.prix === 0 ? "bg-emerald-50" : "bg-gray-50"}`}>
              <Wallet className={`w-4 h-4 ${site.prix === 0 ? "text-emerald-600" : "text-gray-500"}`} />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Entrée</p>
                <p className={`text-[12px] font-bold ${site.prix === 0 ? "text-emerald-700" : "text-gray-800"}`}>
                  {formatPrix(site.prix)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2.5">
              <Clock className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Durée</p>
                <p className="text-[12px] font-bold text-gray-800">{formatDuree(site.dureeVisite)} de visite</p>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <p className="text-[13px] text-gray-600 leading-relaxed mb-5">
            {site.description}
          </p>

          {/* ── Tags ── */}
          {site.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              <Tag className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
              {site.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-medium text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 mb-6" />

          {/* ── Grille : Services + Carte ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Services à proximité */}
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-3">
                Services à proximité
              </h3>
              {svcLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                        <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                      </div>
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-12" />
                    </div>
                  ))}
                </div>
              ) : services.length > 0 ? (
                <>
                  {visibleServices.map((s) => (
                    <ServiceRow key={s.type} service={s} />
                  ))}
                  {!showAll && extraSvc > 0 && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="flex items-center gap-1.5 text-[12px] text-green-700 font-semibold mt-2 hover:text-green-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {extraSvc} service{extraSvc > 1 ? "s" : ""} de plus
                    </button>
                  )}
                </>
              ) : (
                <p className="text-[12px] text-gray-400">
                  Aucun service trouvé dans un rayon de 50 km.
                </p>
              )}
            </div>

            {/* Mini-carte */}
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wide text-gray-400 mb-3">
                Localisation
              </h3>
              <div style={{ height: "200px" }}>
                <SiteMiniMap coords={site.coordonnees} nom={site.nom} />
              </div>
            </div>
          </div>

          {/* ── CTAs ── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => onAddToItinerary?.(site)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-700 text-white font-bold text-[13px] hover:bg-green-800 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Ajouter à l'itinéraire
            </button>
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-[13px] hover:border-green-500 hover:text-green-700 active:scale-[0.98] transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

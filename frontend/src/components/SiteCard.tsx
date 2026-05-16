// src/components/SiteCard.tsx
import { MapPin, Clock, Wallet, Star, ChevronRight, Check } from "lucide-react";
import NearbyServicesBar from "./NearbyServicesBar";

// ── Types ────────────────────────────────────────────────────
export type Site = {
  _id: string;
  nom: string;
  description: string;
  categorie: string;
  ville: string;
  coordonnees: { lat: number; lng: number };
  prix: number;
  horaires: string;
  images: string[];
  noteMoyenne?: number;
  nombreAvis?: number;
  dureeVisite: number;
  tags: string[];
  score?: number;
};

type Props = {
  site: Site;
  onHover?:       (site: Site | null) => void;
  onSelect?:      (site: Site) => void;
  isChecked?:     boolean;   // case cochée
  isInItinerary?: boolean;   // déjà ajouté → grisé
  onCheck?:       (id: string) => void;
};

// ── Helpers ──────────────────────────────────────────────────
const CATEGORIE_COLORS: Record<string, string> = {
  histoire:  "bg-amber-100 text-amber-700",
  culture:   "bg-purple-100 text-purple-700",
  nature:    "bg-emerald-100 text-emerald-700",
  plage:     "bg-cyan-100 text-cyan-700",
  religion:  "bg-indigo-100 text-indigo-700",
};

function formatPrix(prix: number): string {
  return prix === 0 ? "Gratuit" : `${prix.toLocaleString("fr-FR")} FCFA`;
}

function formatDuree(h: number): string {
  if (h < 1)               return `${h * 60} min`;
  if (h === 1)             return "1h";
  if (Number.isInteger(h)) return `${h}h`;
  return `${Math.floor(h)}h${(h % 1) * 60 | 0}`;
}

// ── Composant ────────────────────────────────────────────────
export default function SiteCard({
  site,
  onHover,
  onSelect,
  isChecked = false,
  isInItinerary = false,
  onCheck,
}: Props) {
  const colorClass = CATEGORIE_COLORS[site.categorie] ?? "bg-gray-100 text-gray-600";
  const imageUrl   = site.images[0];

  return (
    <article
      className={`group flex flex-col bg-white rounded-2xl border overflow-hidden transition-all duration-200 relative
        ${isInItinerary
          ? "border-gray-200 opacity-55 cursor-not-allowed"
          : isChecked
            ? "border-green-500 shadow-lg shadow-green-100 hover:shadow-xl hover:-translate-y-0.5"
            : "border-gray-200 hover:shadow-lg hover:-translate-y-0.5"
        }`}
      onMouseEnter={() => !isInItinerary && onHover?.(site)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* ── Overlay "Déjà ajouté" ── */}
      {isInItinerary && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl pointer-events-none">
          <div className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full shadow-lg">
            <Check className="w-4 h-4" />
            <span className="text-[12px] font-bold">Ajouté à l'itinéraire</span>
          </div>
        </div>
      )}

      {/* Zone cliquable → ouvre le modal */}
      <div
        role="button"
        tabIndex={isInItinerary ? -1 : 0}
        aria-label={`Voir les détails de ${site.nom}`}
        className={`flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${isInItinerary ? "pointer-events-none" : "cursor-pointer"}`}
        onClick={() => !isInItinerary && onSelect?.(site)}
        onKeyDown={(e) => { if (!isInItinerary && (e.key === "Enter" || e.key === " ")) onSelect?.(site); }}
      >
        {/* Image */}
        <div className="relative h-44 bg-gray-100 overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={site.nom}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-4xl">🏛️</span>
            </div>
          )}

          {/* ── Checkbox (haut-gauche) ── */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isInItinerary) onCheck?.(site._id);
            }}
            disabled={isInItinerary}
            title={isInItinerary ? "Déjà ajouté" : isChecked ? "Décocher" : "Sélectionner"}
            className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shadow-sm pointer-events-auto
              ${isInItinerary
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : isChecked
                  ? "bg-green-600 border-green-600 hover:bg-green-700"
                  : "bg-white/90 border-gray-300 hover:border-green-500 hover:bg-white"
              }`}
          >
            {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Badge catégorie (bas-gauche pour ne pas superposer la case) */}
          <span
            className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${colorClass}`}
          >
            {site.categorie.charAt(0).toUpperCase() + site.categorie.slice(1)}
          </span>

          {/* Note (haut-droite) */}
          {site.noteMoyenne && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-gray-800">
                {site.noteMoyenne.toFixed(1)}
              </span>
              {site.nombreAvis && (
                <span className="text-[10px] text-gray-500">({site.nombreAvis})</span>
              )}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-2.5 p-4 flex-1">
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
              {site.nom}
            </h3>
            <p className="flex items-center gap-1 text-[12px] text-gray-500 mt-0.5">
              <MapPin className="w-3 h-3 text-green-500" />
              {site.ville}
            </p>
          </div>

          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
            {site.description}
          </p>

          {site.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {site.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[12px] text-gray-500">
                <Clock className="w-3.5 h-3.5 text-green-500" />
                {formatDuree(site.dureeVisite)}
              </span>
              <span className={`flex items-center gap-1 text-[12px] font-semibold ${site.prix === 0 ? "text-emerald-600" : "text-gray-700"}`}>
                <Wallet className="w-3.5 h-3.5" />
                {formatPrix(site.prix)}
              </span>
            </div>
            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
              Voir <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Barre services (hors zone cliquable) */}
      {!isInItinerary && <NearbyServicesBar coords={site.coordonnees} />}
    </article>
  );
}

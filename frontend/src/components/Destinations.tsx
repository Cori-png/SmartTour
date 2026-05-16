// src/components/Destinations.tsx
// Affiche les destinations populaires sur la page d'accueil.
// Utilise des données statiques (mock) pour être indépendant de Convex.
// TODO: Remplacer par useQuery(api.sites.getPopular) une fois Convex configuré.
import { useState } from "react";
import { Star, Heart, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────
type Site = {
  _id: string;
  nom: string;
  ville: string;
  noteMoyenne?: number;
  images: string[];
  categorie: string;
};

// ── Données mock ─────────────────────────────────────────────
const MOCK_POPULAR: Site[] = [
  {
    _id: "mock-1",
    nom: "Palais Royal d'Abomey",
    ville: "Abomey",
    noteMoyenne: 4.9,
    categorie: "histoire",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Abomey_palace.jpg/640px-Abomey_palace.jpg",
    ],
  },
  {
    _id: "mock-2",
    nom: "Village lacustre de Ganvié",
    ville: "Cotonou",
    noteMoyenne: 4.7,
    categorie: "culture",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ganvie_stilt_village.jpg/640px-Ganvie_stilt_village.jpg",
    ],
  },
  {
    _id: "mock-3",
    nom: "Parc National de la Pendjari",
    ville: "Tanguiéta",
    noteMoyenne: 4.9,
    categorie: "nature",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pendjari_NP.jpg/640px-Pendjari_NP.jpg",
    ],
  },
  {
    _id: "mock-4",
    nom: "Route de l'Esclave – Ouidah",
    ville: "Ouidah",
    noteMoyenne: 4.8,
    categorie: "histoire",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ouidah_-_Gate_of_No_Return.jpg/640px-Ouidah_-_Gate_of_No_Return.jpg",
    ],
  },
  {
    _id: "mock-5",
    nom: "Plage de Grand-Popo",
    ville: "Grand-Popo",
    noteMoyenne: 4.6,
    categorie: "plage",
    images: [],
  },
  {
    _id: "mock-6",
    nom: "Temple des Pythons",
    ville: "Ouidah",
    noteMoyenne: 4.5,
    categorie: "religion",
    images: [],
  },
  {
    _id: "mock-7",
    nom: "Cascade de Kota",
    ville: "Natitingou",
    noteMoyenne: 4.6,
    categorie: "nature",
    images: [
      "https://res.cloudinary.com/dogqgmrmb/image/upload/v1776251319/cascade_ahdn2r.png",
    ],
  },
  {
    _id: "mock-8",
    nom: "Marché Dantokpa",
    ville: "Cotonou",
    noteMoyenne: 4.2,
    categorie: "culture",
    images: [],
  },
];

// ── Couleurs et emojis par catégorie ────────────────────────
const CAT_COLORS: Record<string, string> = {
  histoire: "bg-amber-100 text-amber-700",
  culture:  "bg-purple-100 text-purple-700",
  nature:   "bg-emerald-100 text-emerald-700",
  plage:    "bg-cyan-100 text-cyan-700",
  religion: "bg-indigo-100 text-indigo-700",
};



// ── Carte destination ────────────────────────────────────────
function DestCard({ site }: { site: Site }) {
  const [liked,  setLiked]  = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const colorClass = CAT_COLORS[site.categorie] ?? "bg-gray-100 text-gray-600";
  const hasImage   = !!site.images[0] && !imgErr;

  return (
    <article className="flex-none w-[260px] rounded-2xl border border-gray-200 bg-white overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group snap-start">
      {/* Image */}
      <div className="relative h-[168px] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
        {hasImage ? (
          <img
            src={site.images[0]}
            alt={site.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span></span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Note */}
        {site.noteMoyenne !== undefined && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {site.noteMoyenne.toFixed(1)}
          </div>
        )}

        {/* Bouton favori */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all active:scale-90 shadow-sm"
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>

        {/* Badge catégorie */}
        <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${colorClass}`}>
          {site.categorie.charAt(0).toUpperCase() + site.categorie.slice(1)}
        </span>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 mb-1.5 group-hover:text-green-700 transition-colors text-[14px]">
          {site.nom}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
          <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
          {site.ville}, Bénin
        </div>
      </div>
    </article>
  );
}

// ── Composant principal ──────────────────────────────────────
export default function Destinations() {
  return (
    <section className="px-6 md:px-12 pt-8 pb-12 bg-white">
      {/* En-tête */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Destinations populaires</h2>
          <p className="text-gray-500 mt-1 text-[14px]">
            Les lieux les plus appréciés par nos voyageurs
          </p>
        </div>
        <Link
          to="/explorer"
          className="flex items-center gap-1.5 text-green-700 font-semibold hover:text-green-800 transition-colors text-[13px] group"
        >
          Voir tout
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Scroll horizontal */}
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-6 md:-mx-12 px-6 md:px-12">
        {MOCK_POPULAR.map((site) => (
          <Link key={site._id} to="/explorer">
            <DestCard site={site} />
          </Link>
        ))}
      </div>
    </section>
  );
}
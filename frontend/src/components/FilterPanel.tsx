// src/components/FilterPanel.tsx
import { Search, MapPin, Wallet, Clock, Tag, X } from "lucide-react";

// ── Types ────────────────────────────────────────────────────
export type Filters = {
  recherche: string;
  categorie: string;
  ville: string;
  budgetMax: number | "";
  dureeMax:  number | "";   // heures max par site : "", 1, 2, 4, 8
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  total: number;
};

// ── Données ──────────────────────────────────────────────────
const CATEGORIES = [
  { value: "tous", label: "Toutes" },
  { value: "histoire", label: "Histoire" },
  { value: "culture", label: "Culture" },
  { value: "nature", label: "Nature" },
  { value: "plage", label: "Plages" },
  { value: "religion", label: "Spiritualité" },
];

const VILLES = [
  "toutes",
  "Cotonou",
  "Ouidah",
  "Abomey",
  "Natitingou",
  "Tanguiéta",
  "Grand-Popo",
];

const DUREES = [
  { label: "Toute durée", value: ""  },
  { label: "< 1h",        value: 1   },
  { label: "< 2h",        value: 2   },
  { label: "< 4h",        value: 4   },
  { label: "Journée",     value: 8   },
];

// ── Composant ────────────────────────────────────────────────
export default function FilterPanel({ filters, onChange, onReset, total }: Props) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.recherche !== "" ||
    filters.categorie !== "tous" ||
    filters.ville !== "toutes" ||
    filters.budgetMax !== "" ||
    filters.dureeMax !== "";

  return (
    <aside className="w-full flex flex-col gap-5">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-gray-900">Filtres</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Recherche textuelle */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
          <Search className="w-3 h-3 text-green-600" />
          Rechercher
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={filters.recherche}
            onChange={(e) => set("recherche", e.target.value)}
            placeholder="Site, ville, tag..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
          />
          {filters.recherche && (
            <button
              onClick={() => set("recherche", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Catégories */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
          <Tag className="w-3 h-3 text-green-600" />
          Centres d'intérêts / Catégories
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => set("categorie", cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${filters.categorie === cat.value
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                }`}
            >
              <span></span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ville */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
          <MapPin className="w-3 h-3 text-green-600" />
          Ville / Région
        </label>
        <select
          value={filters.ville}
          onChange={(e) => set("ville", e.target.value)}
          className="w-60 px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white"
        >
          {VILLES.map((v) => (
            <option key={v} value={v}>
              {v === "toutes" ? "Toutes les villes" : v}
            </option>
          ))}
        </select>
      </div>

      {/* Budget max */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
          <Wallet className="w-3 h-3 text-green-600" />
          Budget d'entrée max (FCFA)
        </label>
        <input
          type="number"
          min={0}
          step={500}
          value={filters.budgetMax}
          onChange={(e) =>
            set("budgetMax", e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Ex : 5000"
          className="w-60 px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
        />
      </div>

      {/* Durée de visite max */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-gray-400">
          <Clock className="w-3 h-3 text-green-600" />
          Durée de visite max
        </label>
        <div className="flex flex-wrap gap-2">
          {DUREES.map((d) => (
            <button
              key={String(d.value)}
              onClick={() => set("dureeMax", d.value as number | "")}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                filters.dureeMax === d.value
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[12px] text-gray-500 text-center">
          <span className="font-bold text-green-700 text-[14px]">{total}</span>{" "}
          site{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
        </p>
      </div>
    </aside>
  );
}

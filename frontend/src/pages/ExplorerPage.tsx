// src/pages/ExplorerPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterPanel, { type Filters } from "../components/FilterPanel";
import SiteCard, { type Site } from "../components/SiteCard";
import MapView from "../components/MapView";
import SiteDetailModal from "../components/SiteDetailModal";
import AuthGuardModal from "../components/AuthGuardModal";
import { useNearbyServices } from "../hooks/useNearbyServices";
import { useItinerary } from "../context/ItineraryContext";
import { useAuth } from "../context/AuthContext";
import { SlidersHorizontal, X, Route, Search } from "lucide-react";

// Données chargées dynamiquement depuis Convex


const INITIAL_FILTERS: Filters = {
  recherche: "",
  categorie: "tous",
  ville: "toutes",
  budgetMax: "",
  dureeMax:  "",
};

const PAGE_SIZE = 6;

// ── Composant ────────────────────────────────────────────────
export default function ExplorerPage() {
  const [filters, setFilters]           = useState<Filters>(INITIAL_FILTERS);
  const [visibleCount, setVisibleCount]  = useState(PAGE_SIZE);
  const [hoveredSite, setHoveredSite]    = useState<Site | null>(null);
  const [selectedSite, setSelectedSite]  = useState<Site | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAuthGuard,     setShowAuthGuard]     = useState(false);

  // ── Sélection pour l'itinéraire ────────────────────────────────
  const [checkedSiteIds, setCheckedSiteIds] = useState<Set<string>>(new Set());

  const navigate  = useNavigate();
  const location   = useLocation();
  const { addSites, itinerarySites } = useItinerary();
  const { user } = useAuth();

  // ── Lire les paramètres URL (depuis la barre de recherche de l'accueil) ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q         = params.get("q")         ?? "";
    const ville     = params.get("ville")     ?? "";
    const dureeRaw  = params.get("dureeMax")  ?? "";
    const budgetRaw = params.get("budgetMax") ?? "";
    const dureeMax:  number | "" = dureeRaw  !== "" && !isNaN(Number(dureeRaw))  ? Number(dureeRaw)  : "";
    const budgetMax: number | "" = budgetRaw !== "" && !isNaN(Number(budgetRaw)) ? Number(budgetRaw) : "";
    if (q || ville || dureeMax !== "" || budgetMax !== "") {
      setFilters(prev => ({
        ...prev,
        recherche: q,
        ville:     ville ? ville.charAt(0).toUpperCase() + ville.slice(1) : "toutes",
        dureeMax,
        budgetMax,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // IDs déjà dans l'itinéraire (pour griser)
  const itinerarySiteIds = useMemo(
    () => new Set(itinerarySites.map((s) => s._id)),
    [itinerarySites]
  );

  function handleCheck(id: string) {
    if (itinerarySiteIds.has(id)) return;
    setCheckedSiteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleAddToItinerary() {
    if (checkedSiteIds.size === 0) return;
    // Garde auth : connexion requise
    if (!user) {
      setShowAuthGuard(true);
      return;
    }
    doAddToItinerary();
  }

  // ── Récupération des sites via Convex ───────────────────────
  const queryParams = {
    categorie: filters.categorie,
    ville: filters.ville,
    recherche: filters.recherche,
    budgetMax: filters.budgetMax !== "" ? Number(filters.budgetMax) : undefined,
    dureeMax: filters.dureeMax !== "" ? Number(filters.dureeMax) : undefined,
    limit: 100, // Récupère tous les résultats correspondants
  };
  const sitesData = useQuery(api.sites.getSites, queryParams);

  const filteredSites = useMemo(() => {
    return (sitesData?.sites ?? []) as Site[];
  }, [sitesData]);

  function doAddToItinerary() {
    const selected = filteredSites.filter((s) => checkedSiteIds.has(s._id));
    addSites(selected);
    setCheckedSiteIds(new Set());
    navigate("/planifier");
  }

  // ── Services à proximité du site survolé (Overpass API) ────
  const hoveredCoords = hoveredSite?.coordonnees ?? { lat: 0, lng: 0 };
  const { services: nearbyServices } = useNearbyServices(
    hoveredCoords,
    hoveredSite !== null,  // fetch uniquement si un site est survolé
  );

  // Réinitialise la pagination à chaque changement de filtres
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const visibleSites = filteredSites.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSites.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      {/* ── En-tête page ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Explorer le Bénin
            </h1>
            <p className="text-[13px] text-gray-500 mt-1">
              Découvrez les sites touristiques, filtrez par catégorie, budget et durée
            </p>
          </div>

          {/* Bouton filtres mobile */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-green-500 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* ── Layout principal : 3 colonnes ─────────────────── */}
      <div className="flex flex-1 gap-6 px-8 py-6 max-w-[1600px] mx-auto w-full">

        {/* ── Colonne 1 : FilterPanel ─────────────────────── */}
        <div className="hidden lg:flex w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full h-fit sticky top-20">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(INITIAL_FILTERS)}
              total={filteredSites.length}
            />
          </div>
        </div>

        {/* ── Colonne 2 : Grille de SiteCards ─────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Barre de résultats */}
          <div className="flex items-center justify-between py-1 border-b border-gray-100 pb-3">
            <p className="text-[13px] text-gray-500">
              <span className="font-bold text-gray-800">{filteredSites.length}</span>{" "}
              site{filteredSites.length > 1 ? "s" : ""} trouvé
              {filteredSites.length > 1 ? "s" : ""}
            </p>
            <span className="text-[12px] text-gray-400">
              Triés par pertinence
            </span>
          </div>

          {/* Grille */}
          {filteredSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="w-14 h-14 text-gray-300 mb-5" />
              <p className="text-[15px] font-bold text-gray-800 mb-2">
                Aucun site trouvé
              </p>
              <p className="text-[13px] text-gray-500">
                Essayez de modifier vos filtres
              </p>
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-5 px-6 py-2.5 rounded-xl bg-green-700 text-white text-sm font-bold hover:bg-green-800 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {visibleSites.map((site) => (
                  <SiteCard
                    key={site._id}
                    site={site}
                    onHover={setHoveredSite}
                    onSelect={setSelectedSite}
                    isChecked={checkedSiteIds.has(site._id)}
                    isInItinerary={itinerarySiteIds.has(site._id)}
                    onCheck={handleCheck}
                  />
                ))}
              </div>

              {/* ── Barre d'actions bas de page ───────────────── */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-4">

                {/* Charger plus */}
                {hasMore && (
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-8 py-3 rounded-xl border-2 border-green-700 text-green-700 text-sm font-bold hover:bg-green-700 hover:text-white transition-all"
                  >
                    Charger plus ({filteredSites.length - visibleCount} restants)
                  </button>
                )}

                {/* Ajouter à l'itinéraire */}
                <button
                  onClick={handleAddToItinerary}
                  disabled={checkedSiteIds.size === 0}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                    checkedSiteIds.size > 0
                      ? "bg-green-700 text-white hover:bg-green-800 shadow-md shadow-green-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Route className="w-4 h-4" />
                  Ajouter à l'itinéraire
                  {checkedSiteIds.size > 0 && (
                    <span className="bg-white text-green-700 rounded-full w-5 h-5 text-xs font-extrabold flex items-center justify-center">
                      {checkedSiteIds.size}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Colonne 3 : Carte Leaflet ─────────────────────── */}
        <div className="hidden xl:flex w-[440px] flex-shrink-0">
          <div className="sticky top-20 w-full" style={{ height: "calc(100vh - 140px)" }}>
            <MapView
              sites={filteredSites}
              hoveredSite={hoveredSite}
              nearbyServices={hoveredSite ? nearbyServices : []}
            />
          </div>
        </div>
      </div>

      {/* ── Panneau filtres mobile (drawer) ───────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto w-80 h-full bg-white p-6 overflow-y-auto flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-base">Filtres</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={(f) => { setFilters(f); }}
              onReset={() => setFilters(INITIAL_FILTERS)}
              total={filteredSites.length}
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-auto w-full py-3.5 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition-colors text-sm"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}

      <Footer />

      {/* ── Modal détail du site ── */}
      {selectedSite && (
        <SiteDetailModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onAddToItinerary={(site) => {
            if (!user) {
              setShowAuthGuard(true);
              return;
            }
            addSites([site]);
            setSelectedSite(null);
            navigate("/planifier");
          }}
        />
      )}

      {/* ── Auth Guard Modal ── */}
      {showAuthGuard && (
        <AuthGuardModal
          onSuccess={() => { setShowAuthGuard(false); doAddToItinerary(); }}
          onClose={() => setShowAuthGuard(false)}
        />
      )}
    </div>
  );
}

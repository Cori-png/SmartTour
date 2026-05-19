// src/pages/ExplorerPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// ── Données mock (à remplacer par useQuery(api.queries.getSites.getSites, filters)) ──
const MOCK_SITES: Site[] = [
  {
    _id: "1",
    nom: "Route de l'Esclave - Ouidah",
    description:
      "Chemin historique de 4 km que parcouraient les esclaves avant d'embarquer pour les Amériques. Un lieu de mémoire incontournable avec la Porte du Non-Retour.",
    categorie: "histoire",
    ville: "Ouidah",
    coordonnees: { lat: 6.3536, lng: 2.0887 },
    prix: 1000,
    horaires: "08h00 - 18h00",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ouidah_-_Gate_of_No_Return.jpg/640px-Ouidah_-_Gate_of_No_Return.jpg",
    ],
    noteMoyenne: 4.8,
    nombreAvis: 312,
    dureeVisite: 2,
    tags: ["patrimoine", "UNESCO", "histoire"],
    score: 98,
  },
  {
    _id: "2",
    nom: "Village lacustre de Ganvié",
    description:
      "Surnommée la 'Venise de l'Afrique', Ganvié est un village entier construit sur le lac Nokoué. Ses habitants vivent sur pilotis depuis le XVIIe siècle.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.4667, lng: 2.4167 },
    prix: 5000,
    horaires: "07h00 - 17h00",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ganvie_stilt_village.jpg/640px-Ganvie_stilt_village.jpg",
    ],
    noteMoyenne: 4.7,
    nombreAvis: 489,
    dureeVisite: 3,
    tags: ["pirogue", "lac", "unique"],
    score: 97,
  },
  {
    _id: "3",
    nom: "Palais Royal d'Abomey",
    description:
      "Site classé au patrimoine mondial de l'UNESCO. Les palais retracent l'histoire du puissant Royaume du Dahomey à travers sculptures et bas-reliefs.",
    categorie: "histoire",
    ville: "Abomey",
    coordonnees: { lat: 7.1833, lng: 1.9833 },
    prix: 2000,
    horaires: "09h00 - 17h00",
    images: ["/images/PRA.png"],
    noteMoyenne: 4.9,
    nombreAvis: 276,
    dureeVisite: 2.5,
    tags: ["UNESCO", "royauté", "musée"],
    score: 99,
  },
  {
    _id: "4",
    nom: "Parc National de la Pendjari",
    description:
      "L'un des derniers grands écosystèmes de savane d'Afrique de l'Ouest. Lions, éléphants, buffles et guépards dans leur habitat naturel.",
    categorie: "nature",
    ville: "Tanguiéta",
    coordonnees: { lat: 11.1667, lng: 1.5167 },
    prix: 10000,
    horaires: "06h00 - 18h00",
    images: ["/images/Pendjari.png", "/images/PNR.png"],
    noteMoyenne: 4.9,
    nombreAvis: 198,
    dureeVisite: 8,
    tags: ["safari", "lions", "faune"],
    score: 99,
  },
  {
    _id: "5",
    nom: "Plage de Grand-Popo",
    description:
      "Une des plus belles plages du Bénin. Cocotiers, sable fin et couchers de soleil spectaculaires à la frontière du Togo.",
    categorie: "plage",
    ville: "Grand-Popo",
    coordonnees: { lat: 6.2833, lng: 1.8167 },
    prix: 0,
    horaires: "Toute la journée",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Grand-Popo%2C_Benin.jpg/640px-Grand-Popo%2C_Benin.jpg",
    ],
    noteMoyenne: 4.6,
    nombreAvis: 221,
    dureeVisite: 4,
    tags: ["plage", "détente", "coucher de soleil"],
    score: 95,
  },
  {
    _id: "6",
    nom: "Temple des Pythons - Ouidah",
    description:
      "Temple sacré dédié au culte vaudou du python. Des dizaines de pythons royaux vivent ici en liberté. Une expérience fascinante et unique.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.3603, lng: 2.0852 },
    prix: 1500,
    horaires: "08h00 - 18h00",
    images: ["/images/Tpy.jpg"],
    noteMoyenne: 4.5,
    nombreAvis: 302,
    dureeVisite: 1,
    tags: ["vaudou", "python", "spiritualité"],
    score: 94,
  },
  {
    _id: "7",
    nom: "Forêt Sacrée de Kpassè",
    description:
      "Forêt vaudou millénaire au cœur d'Ouidah. Statues, autels et arbres centenaires dans une atmosphère mystique hors du temps.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.362, lng: 2.084 },
    prix: 1000,
    horaires: "08h00 - 18h00",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ouidah_sacred_forest.jpg/640px-Ouidah_sacred_forest.jpg",
    ],
    noteMoyenne: 4.4,
    nombreAvis: 178,
    dureeVisite: 1.5,
    tags: ["vaudou", "forêt", "mystique"],
    score: 92,
  },
  {
    _id: "8",
    nom: "Marché Dantokpa",
    description:
      "Le plus grand marché en plein air d'Afrique de l'Ouest. Tissus wax, épices, artisanat et fétiches : l'âme vivante de Cotonou.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.3612, lng: 2.4278 },
    prix: 0,
    horaires: "06h00 - 20h00",
    images: ["/images/Mk.jpg"],
    noteMoyenne: 4.2,
    nombreAvis: 534,
    dureeVisite: 2,
    tags: ["marché", "artisanat", "couleurs"],
    score: 91,
  },
  {
    _id: "9",
    nom: "Cascade de Kota",
    description:
      "Magnifique cascade cachée dans les collines de l'Atacora. Un trekking de 2h à travers la forêt mène à ce joyau naturel peu fréquenté.",
    categorie: "nature",
    ville: "Natitingou",
    coordonnees: { lat: 10.3167, lng: 1.3833 },
    prix: 500,
    horaires: "07h00 - 17h00",
    images: ["/images/cascade.png"],
    noteMoyenne: 4.6,
    nombreAvis: 64,
    dureeVisite: 4,
    tags: ["cascade", "trekking", "randonnée"],
    score: 93,
  },
  {
    _id: "10",
    nom: "Cathédrale de Ouidah",
    description:
      "La plus ancienne cathédrale du Bénin, construite par des missionnaires portugais au XVIIIe siècle. Un chef-d'œuvre d'architecture coloniale.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.3614, lng: 2.0843 },
    prix: 0,
    horaires: "07h00 - 19h00",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Cath%C3%A9drale_de_Ouidah.jpg/640px-Cath%C3%A9drale_de_Ouidah.jpg",
    ],
    noteMoyenne: 4.3,
    nombreAvis: 87,
    dureeVisite: 1,
    tags: ["religion", "architecture", "gratuit"],
    score: 89,
  },
  {
    _id: "11",
    nom: "Place de l'Amazone",
    description:
      "Grande place centrale de Cotonou dominée par la célèbre statue de l'Amazone du Dahomey. Symbole de la résistance féminine du Royaume du Danxomè.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.3654, lng: 2.4183 },
    prix: 0,
    horaires: "Toute la journée",
    images: ["/images/amazone.jpg"],
    noteMoyenne: 4.1,
    nombreAvis: 143,
    dureeVisite: 0.5,
    tags: ["statue", "amazone", "gratuit"],
    score: 87,
  },
  {
    _id: "12",
    nom: "Musée d'Abomey",
    description:
      "Situé dans les anciens palais royaux. Trônes, statues, tissus royaux et objets rituels du Royaume du Dahomey. Guide obligatoire recommandé.",
    categorie: "culture",
    ville: "Abomey",
    coordonnees: { lat: 7.185, lng: 1.985 },
    prix: 3000,
    horaires: "09h00 - 17h00",
    images: ["/images/PRA.png"],
    noteMoyenne: 4.7,
    nombreAvis: 156,
    dureeVisite: 2,
    tags: ["musée", "art", "royauté"],
    score: 96,
  },
];

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

  function doAddToItinerary() {
    const selected = MOCK_SITES.filter((s) => checkedSiteIds.has(s._id));
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

  // ── Filtrage + scoring côté client (mock) ─────────────────
  // En production : remplacer par useQuery(api.queries.getSites.getSites, { ...filters })
  const filteredSites = useMemo(() => {
    let result = [...MOCK_SITES];

    if (filters.recherche.trim()) {
      const q = filters.recherche.toLowerCase();
      result = result.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.ville.toLowerCase().includes(q)
      );
    }
    if (filters.categorie !== "tous") {
      result = result.filter((s) => s.categorie === filters.categorie);
    }
    if (filters.ville !== "toutes") {
      result = result.filter((s) =>
        s.ville.toLowerCase().includes(filters.ville.toLowerCase())
      );
    }
    if (filters.budgetMax !== "") {
      result = result.filter((s) => s.prix <= Number(filters.budgetMax));
    }
    if (filters.dureeMax !== "") {
      result = result.filter((s) => s.dureeVisite <= Number(filters.dureeMax));
    }

    // Tri par score décroissant
    return result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [filters]);

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

// src/components/StartPositionModal.tsx
// Popup de saisie de position de départ pour l'itinéraire
// Deux modes : GPS actuel OU adresse via Nominatim (OpenStreetMap, gratuit)
import { useState, useEffect, useRef } from "react";
import { X, MapPin, Navigation, Search, Loader2, CheckCircle2 } from "lucide-react";

export type Position = {
  lat:   number;
  lng:   number;
  label: string;
};

type Props = {
  onConfirm: (position: Position) => void;
  onClose:   () => void;
};

// ── Nominatim geocoding (OSM, gratuit, sans clé) ─────────────
async function searchNominatim(query: string): Promise<Position[]> {
  if (query.trim().length < 3) return [];
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q",              query);
  url.searchParams.set("format",         "json");
  url.searchParams.set("limit",          "5");
  url.searchParams.set("accept-language","fr");
  url.searchParams.set("countrycodes",   "bj,tg,ng,gh");  // Bénin + voisins

  const res  = await fetch(url.toString(), {
    headers: { "Accept-Language": "fr" },
  });
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((d: any) => ({
    lat:   parseFloat(d.lat),
    lng:   parseFloat(d.lon),
    label: d.display_name,
  }));
}

// ── Composant ─────────────────────────────────────────────────
export default function StartPositionModal({ onConfirm, onClose }: Props) {
  const [mode,         setMode]         = useState<"gps" | "address">("gps");
  const [gpsState,     setGpsState]     = useState<"idle" | "loading" | "done" | "error">("idle");
  const [gpsPos,       setGpsPos]       = useState<Position | null>(null);
  const [gpsError,     setGpsError]     = useState("");
  const [query,        setQuery]        = useState("");
  const [suggestions,  setSuggestions]  = useState<Position[]>([]);
  const [searching,    setSearching]    = useState(false);
  const [selectedAddr, setSelectedAddr] = useState<Position | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── GPS ──────────────────────────────────────────────────────
  function detectGPS() {
    if (!navigator.geolocation) {
      setGpsError("Géolocalisation non supportée par ce navigateur.");
      setGpsState("error");
      return;
    }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsPos({
          lat:   pos.coords.latitude,
          lng:   pos.coords.longitude,
          label: `Position actuelle (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        });
        setGpsState("done");
      },
      (err) => {
        setGpsError(err.message);
        setGpsState("error");
      },
      { timeout: 10000 }
    );
  }

  // ── Recherche adresse avec debounce ──────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchNominatim(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  }, [query]);

  // ── Position sélectionnée ────────────────────────────────────
  const selected = mode === "gps" ? gpsPos : selectedAddr;
  const canConfirm = selected !== null;

  // ── Fermeture ESC ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[16px] font-extrabold text-gray-900">Position de départ</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">Choisissez votre point de départ pour l'itinéraire</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle mode */}
        <div className="flex gap-2 p-4 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => setMode("gps")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${mode === "gps" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"}`}
          >
            <Navigation className="w-4 h-4" />
            Position GPS
          </button>
          <button
            onClick={() => setMode("address")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${mode === "address" ? "bg-green-700 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"}`}
          >
            <Search className="w-4 h-4" />
            Saisir une adresse
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* ── Mode GPS ── */}
          {mode === "gps" && (
            <div className="space-y-4">
              <p className="text-[13px] text-gray-600">
                Utilisez votre position GPS actuelle comme point de départ de l'itinéraire.
              </p>

              {gpsState === "idle" && (
                <button
                  onClick={detectGPS}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-50 border-2 border-dashed border-green-300 text-green-700 font-semibold text-[14px] hover:bg-green-100 transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  Détecter ma position
                </button>
              )}

              {gpsState === "loading" && (
                <div className="flex items-center justify-center gap-3 py-6 text-green-700">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[14px] font-semibold">Détection en cours…</span>
                </div>
              )}

              {gpsState === "done" && gpsPos && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold text-green-800">Position détectée ✓</p>
                    <p className="text-[11px] text-green-600 mt-0.5">
                      {gpsPos.lat.toFixed(5)}, {gpsPos.lng.toFixed(5)}
                    </p>
                    <button
                      onClick={() => setGpsState("idle")}
                      className="text-[11px] text-green-700 underline mt-1 hover:text-green-900"
                    >
                      Ré-essayer
                    </button>
                  </div>
                </div>
              )}

              {gpsState === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-[12px] text-red-700 font-semibold">Erreur GPS</p>
                  <p className="text-[11px] text-red-600 mt-0.5">{gpsError}</p>
                  <button
                    onClick={() => { setGpsState("idle"); setGpsError(""); }}
                    className="text-[11px] text-red-700 underline mt-1"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Mode adresse ── */}
          {mode === "address" && (
            <div className="space-y-3">
              <p className="text-[13px] text-gray-600">
                Recherchez votre point de départ (ville, quartier, lieu…)
              </p>

              {/* Input recherche */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 animate-spin pointer-events-none" />}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedAddr(null); }}
                  placeholder="Ex: Cotonou, Porto-Novo, Abomey…"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  autoFocus
                />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && !selectedAddr && (
                <ul className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg divide-y divide-gray-50">
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        onClick={() => {
                          setSelectedAddr(s);
                          setQuery(s.label.split(",")[0]);
                          setSuggestions([]);
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left"
                      >
                        <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[12px] font-semibold text-gray-800 line-clamp-1">
                            {s.label.split(",")[0]}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1">
                            {s.label.split(",").slice(1, 3).join(",")}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Adresse sélectionnée */}
              {selectedAddr && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-green-800 line-clamp-1">{selectedAddr.label.split(",")[0]}</p>
                    <p className="text-[11px] text-green-600">{selectedAddr.lat.toFixed(4)}, {selectedAddr.lng.toFixed(4)}</p>
                  </div>
                  <button onClick={() => { setSelectedAddr(null); setQuery(""); }} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => canConfirm && onConfirm(selected!)}
            disabled={!canConfirm}
            className={`flex-1 py-3 rounded-xl text-[13px] font-extrabold transition-all ${
              canConfirm
                ? "bg-green-700 text-white hover:bg-green-800 shadow-md shadow-green-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Générer l'itinéraire →
          </button>
        </div>
      </div>
    </div>
  );
}

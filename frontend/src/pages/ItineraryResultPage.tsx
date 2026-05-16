// src/pages/ItineraryResultPage.tsx
// Page de résultat : itinéraire optimisé + météo + budget + carte
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Clock, Wallet, Star, Navigation,
  CloudSun, Map, CheckCircle2, Printer, Shuffle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ItineraryMapView from "../components/ItineraryMapView";
import WeatherWidget from "../components/WeatherWidget";
import { useItinerary } from "../context/ItineraryContext";

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

// ── Trafic simulé selon l'heure ───────────────────────────────
function getTrafficLevel(): { level: string; color: string; emoji: string; tip: string } {
  const h = new Date().getHours();
  if ((h >= 7 && h <= 9) || (h >= 17 && h <= 20))
    return { level: "Élevé",  color: "text-red-600   bg-red-50   border-red-200",   emoji: "🔴", tip: "Heures de pointe — partez plus tôt ou plus tard" };
  if ((h >= 12 && h <= 14))
    return { level: "Modéré", color: "text-amber-600 bg-amber-50 border-amber-200", emoji: "🟡", tip: "Heure du déjeuner — trafic modéré en centre-ville" };
  return   { level: "Fluide", color: "text-green-600 bg-green-50 border-green-200", emoji: "🟢", tip: "Conditions de circulation favorables" };
}

// ── Composant ─────────────────────────────────────────────────
export default function ItineraryResultPage() {
  const navigate = useNavigate();
  const { optimizedRoute, startPosition } = useItinerary();
  const [rightTab, setRightTab] = useState<"map" | "meteo" | "trafic">("map");
  const traffic = useMemo(() => getTrafficLevel(), []);

  // ── Redirect si pas de route ──────────────────────────────
  if (optimizedRoute.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
          <p className="text-gray-500 text-[14px]">Aucun itinéraire généré.</p>
          <button onClick={() => navigate("/planifier")} className="px-6 py-3 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">
            ← Retour à la planification
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Calculs ───────────────────────────────────────────────
  const steps = useMemo(() => {
    const result: {
      site:     typeof optimizedRoute[0];
      kmFromPrev: number;
      minFromPrev: number;
    }[] = [];

    const speedKmH = 40; // vitesse moyenne au Bénin

    for (let i = 0; i < optimizedRoute.length; i++) {
      const prev = i === 0
        ? (startPosition ?? optimizedRoute[0].coordonnees)
        : optimizedRoute[i - 1].coordonnees;
      const km = haversineKm(prev, optimizedRoute[i].coordonnees);
      result.push({
        site:        optimizedRoute[i],
        kmFromPrev:  Math.round(km),
        minFromPrev: Math.round((km / speedKmH) * 60),
      });
    }
    return result;
  }, [optimizedRoute, startPosition]);

  const totalKm    = steps.reduce((s, x) => s + x.kmFromPrev, 0);
  const totalHVisite = optimizedRoute.reduce((s, x) => s + x.dureeVisite, 0);
  const totalHTrajet = steps.reduce((s, x) => s + x.minFromPrev, 0) / 60;
  const totalEntree  = optimizedRoute.reduce((s, x) => s + x.prix, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ── En-tête ── */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/planifier")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Itinéraire généré
              </h1>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {optimizedRoute.length} étapes · {totalKm} km · {fmtH(totalHVisite + totalHTrajet)} au total
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col xl:flex-row gap-6">

        {/* ══ COLONNE GAUCHE : fiche ══ */}
        <div className="w-full xl:w-[440px] flex-shrink-0 flex flex-col gap-5">

          {/* Résumé statistiques */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Distance",     value: `${totalKm} km`,         color: "bg-green-50 border-green-200 text-green-800" },
              { label: "Visites",      value: fmtH(totalHVisite),      color: "bg-blue-50  border-blue-200  text-blue-800"  },
              { label: "Entrées",      value: totalEntree === 0 ? "Gratuit" : `${totalEntree.toLocaleString("fr-FR")}F`, color: "bg-amber-50 border-amber-200 text-amber-800" },
            ].map((s) => (
              <div key={s.label} className={`flex flex-col items-center px-3 py-3 rounded-xl border ${s.color}`}>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{s.label}</span>
                <span className="text-[15px] font-extrabold mt-0.5">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Point de départ */}
          {startPosition && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <Navigation className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase text-green-600 tracking-wide">Point de départ</p>
                <p className="text-[13px] font-semibold text-green-900 mt-0.5 line-clamp-2">{startPosition.label}</p>
              </div>
            </div>
          )}

          {/* Étapes de l'itinéraire */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-green-600" />
              <h2 className="text-[13px] font-bold text-gray-800">Ordre de visite optimisé</h2>
            </div>

            <ol className="divide-y divide-gray-50">
              {steps.map(({ site, kmFromPrev, minFromPrev }, i) => (
                <li key={site._id} className="px-5 py-4">
                  {/* Trajet depuis étape précédente */}
                  {(i > 0 || startPosition) && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-px h-5 bg-green-200 ml-3" />
                      <span className="text-[10px] text-gray-400 font-medium">
                        {kmFromPrev} km · ~{minFromPrev} min de trajet
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Numéro */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white ${
                      i === 0 ? "bg-green-600" : i === steps.length - 1 ? "bg-red-500" : "bg-blue-600"
                    }`}>
                      {i + 1}
                    </div>

                    {/* Infos site */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[13px] line-clamp-1">{site.nom}</p>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1">
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
                        {site.noteMoyenne && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{site.noteMoyenne.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ══ COLONNE DROITE : Carte / Météo / Trafic ══ */}
        <div className="flex-1 flex flex-col min-h-[500px]">
          {/* Onglets */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-t-2xl px-3 py-2">
            {[
              { key: "map",    label: "Carte",  Icon: Map      },
              { key: "meteo",  label: "Météo",  Icon: CloudSun },
              { key: "trafic", label: "Trafic", Icon: Navigation },
            ].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setRightTab(key as typeof rightTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${rightTab === key ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white border border-t-0 border-gray-200 rounded-b-2xl overflow-hidden">

            {/* ── Carte ── */}
            {rightTab === "map" && (
              <div className="w-full h-full" style={{ minHeight: "480px" }}>
                <ItineraryMapView sites={optimizedRoute} launched={true} />
              </div>
            )}

            {/* ── Météo du jour ── */}
            {rightTab === "meteo" && (
              <div className="p-5 space-y-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <p className="text-[12px] text-gray-500">Prévisions 7 jours pour chaque étape de votre itinéraire.</p>
                {optimizedRoute.map((site, i) => (
                  <div key={site._id}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white ${i === 0 ? "bg-green-600" : "bg-blue-600"}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900">{site.nom}</p>
                        <p className="text-[11px] text-gray-400">{site.ville}</p>
                      </div>
                      {(site.categorie === "plage" || site.categorie === "nature") && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold border border-cyan-200">Plein air</span>
                      )}
                    </div>
                    <WeatherWidget
                      lat={site.coordonnees.lat}
                      lng={site.coordonnees.lng}
                      city={site.ville}
                      categorie={site.categorie}
                    />
                    {i < optimizedRoute.length - 1 && <div className="border-b border-gray-100 mt-4" />}
                  </div>
                ))}
              </div>
            )}

            {/* ── Trafic ── */}
            {rightTab === "trafic" && (
              <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div className={`flex items-start gap-4 rounded-2xl border px-5 py-4 ${traffic.color}`}>
                  <span className="text-3xl">{traffic.emoji}</span>
                  <div>
                    <p className="font-extrabold text-[16px]">Trafic {traffic.level}</p>
                    <p className="text-[12px] mt-1 opacity-80">{traffic.tip}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <h3 className="text-[13px] font-bold text-gray-800">Conseils de circulation</h3>
                  {[
                    { emoji: "⏰", tip: "Partez avant 7h ou après 21h pour éviter les bouchons à Cotonou" },
                    { emoji: "🛵", tip: "En taxi-moto vous évitez les embouteillages dans les centres-villes" },
                    { emoji: "📍", tip: "Autour de Dantokpa et du Port, la circulation est dense toute la journée" },
                    { emoji: "🌧️", tip: "Par temps de pluie, prévoyez 30-50% de temps supplémentaire" },
                    { emoji: "🗺️", tip: "Les routes nationales (RNIE) sont généralement fluides hors Cotonou" },
                  ].map(({ emoji, tip }) => (
                    <div key={tip} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{emoji}</span>
                      <p className="text-[12px] text-gray-600 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 text-center">
                  * Données trafic en temps réel non disponibles. Estimations basées sur les heures de pointe habituelles au Bénin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

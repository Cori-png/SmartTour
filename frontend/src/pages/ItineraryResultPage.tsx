// src/pages/ItineraryResultPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Clock, Wallet, Star, Navigation,
  CloudSun, CheckCircle2, Save, Shuffle,
  Timer, AlertTriangle, Route, BookmarkCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ItineraryMapView from "../components/ItineraryMapView";
import WeatherWidget from "../components/WeatherWidget";
import { useItinerary } from "../context/ItineraryContext";
import { useAuth } from "../context/AuthContext";
import { useSavedItineraries } from "../hooks/useSavedItineraries";

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

function getTrafficLevel() {
  const h = new Date().getHours();
  if ((h >= 7 && h <= 9) || (h >= 17 && h <= 20))
    return { level: "Élevé",  Icon: AlertTriangle, color: "bg-red-50 border-red-200 text-red-700",     iconColor: "text-red-500",   tip: "Heures de pointe — partez plus tôt ou plus tard" };
  if (h >= 12 && h <= 14)
    return { level: "Modéré", Icon: Timer,         color: "bg-amber-50 border-amber-200 text-amber-700", iconColor: "text-amber-500", tip: "Heure du déjeuner — trafic modéré en centre-ville" };
  return   { level: "Fluide", Icon: Route,         color: "bg-green-50 border-green-200 text-green-700", iconColor: "text-green-500", tip: "Conditions de circulation favorables" };
}

export default function ItineraryResultPage() {
  const navigate                    = useNavigate();
  const { user }                    = useAuth();
  const { optimizedRoute, startPosition, sejour } = useItinerary();
  const { addItinerary }            = useSavedItineraries(user?.email);
  const [bottomTab, setBottomTab]   = useState<"meteo" | "trafic">("meteo");
  const [saved, setSaved]           = useState(false);
  const traffic = useMemo(() => getTrafficLevel(), []);

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

  const steps = useMemo(() => {
    const speedKmH = 40;
    return optimizedRoute.map((site, i) => {
      const prev = i === 0 ? (startPosition ?? optimizedRoute[0].coordonnees) : optimizedRoute[i - 1].coordonnees;
      const km   = haversineKm(prev, site.coordonnees);
      return { site, kmFromPrev: Math.round(km), minFromPrev: Math.round((km / speedKmH) * 60) };
    });
  }, [optimizedRoute, startPosition]);

  const totalKm      = steps.reduce((s, x) => s + x.kmFromPrev, 0);
  const totalHVisite = optimizedRoute.reduce((s, x) => s + x.dureeVisite, 0);
  const totalHTrajet = steps.reduce((s, x) => s + x.minFromPrev, 0) / 60;
  const totalEntree  = optimizedRoute.reduce((s, x) => s + x.prix, 0);

  function handleSave() {
    const name = [...new Set(optimizedRoute.map(s => s.ville))].join(" → ") || "Mon itinéraire";
    addItinerary({
      id:            Date.now().toString(),
      savedAt:       new Date().toISOString(),
      name,
      startPosition,
      sites:         [...optimizedRoute],
      totalKm,
      totalEntree,
      sejour,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/planifier")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                Itinéraire généré
              </h1>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {optimizedRoute.length} étapes · {totalKm} km · {fmtH(totalHVisite + totalHTrajet)} au total
              </p>
            </div>
          </div>
          <button onClick={handleSave} disabled={saved}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${saved ? "bg-green-100 text-green-700 border border-green-300 cursor-default" : "bg-green-700 text-white hover:bg-green-800 shadow-sm active:scale-95"}`}>
            {saved ? <><BookmarkCheck className="w-4 h-4" />Sauvegardé !</> : <><Save className="w-4 h-4" />Sauvegarder</>}
          </button>
        </div>
      </div>

      {/* Corps */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col xl:flex-row gap-6">

        {/* GAUCHE : étapes */}
        <div className="w-full xl:w-[440px] flex-shrink-0 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Distance", value: `${totalKm} km`,    color: "bg-green-50 border-green-200 text-green-800" },
              { label: "Visites",  value: fmtH(totalHVisite), color: "bg-blue-50 border-blue-200 text-blue-800"   },
              { label: "Entrées",  value: totalEntree === 0 ? "Gratuit" : `${totalEntree.toLocaleString("fr-FR")}F`, color: "bg-amber-50 border-amber-200 text-amber-800" },
            ].map(s => (
              <div key={s.label} className={`flex flex-col items-center px-3 py-3 rounded-xl border ${s.color}`}>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{s.label}</span>
                <span className="text-[14px] font-extrabold mt-0.5">{s.value}</span>
              </div>
            ))}
          </div>

          {startPosition && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <Navigation className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase text-green-600 tracking-wide">Point de départ</p>
                <p className="text-[13px] font-semibold text-green-900 mt-0.5 line-clamp-2">{startPosition.label}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-green-600" />
              <h2 className="text-[13px] font-bold text-gray-800">Ordre de visite optimisé</h2>
            </div>
            <ol className="divide-y divide-gray-50">
              {steps.map(({ site, kmFromPrev, minFromPrev }, i) => (
                <li key={site._id} className="px-5 py-4">
                  {(i > 0 || startPosition) && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-px h-5 bg-green-200 ml-3" />
                      <span className="text-[10px] text-gray-400 font-medium">{kmFromPrev} km · ~{minFromPrev} min</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white ${i === 0 ? "bg-green-600" : i === steps.length - 1 ? "bg-red-500" : "bg-blue-600"}`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[13px] line-clamp-1">{site.nom}</p>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin className="w-3 h-3 text-green-500" />{site.ville}</span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="w-3 h-3" />{fmtH(site.dureeVisite)}</span>
                        <span className={`flex items-center gap-1 text-[11px] font-semibold ${site.prix === 0 ? "text-emerald-600" : "text-gray-500"}`}>
                          <Wallet className="w-3 h-3" />{site.prix === 0 ? "Gratuit" : `${site.prix.toLocaleString("fr-FR")} FCFA`}
                        </span>
                        {site.noteMoyenne && <span className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{site.noteMoyenne.toFixed(1)}</span>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* DROITE : Carte + Météo/Trafic sticky */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="xl:sticky xl:top-[70px] xl:self-start xl:w-full flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ height: "420px" }}>
              <ItineraryMapView sites={optimizedRoute} launched={true} visible={true} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100 px-3 pt-2">
                {([
                  { key: "meteo"  as const, label: "Météo du parcours", Icon: CloudSun   },
                  { key: "trafic" as const, label: "Conditions trafic",  Icon: Navigation },
                ] as const).map(({ key, label, Icon }) => (
                  <button key={key} onClick={() => setBottomTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${bottomTab === key ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>

              {bottomTab === "meteo" && (
                <div className="p-4 space-y-5 max-h-[360px] overflow-y-auto">
                  <p className="text-[11px] text-gray-400">Prévisions 7 jours pour chaque étape.</p>
                  {optimizedRoute.map((site, i) => (
                    <div key={site._id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 ${i === 0 ? "bg-green-600" : i === optimizedRoute.length - 1 ? "bg-red-500" : "bg-blue-600"}`}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 line-clamp-1">{site.nom}</p>
                          <p className="text-[11px] text-gray-400">{site.ville}</p>
                        </div>
                        {(site.categorie === "plage" || site.categorie === "nature") && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-bold border border-cyan-200">Plein air</span>
                        )}
                      </div>
                      <WeatherWidget lat={site.coordonnees.lat} lng={site.coordonnees.lng} city={site.ville} categorie={site.categorie} />
                      {i < optimizedRoute.length - 1 && <div className="border-b border-gray-100 mt-4" />}
                    </div>
                  ))}
                </div>
              )}

              {bottomTab === "trafic" && (
                <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto">
                  <div className={`flex items-start gap-4 rounded-2xl border px-4 py-3.5 ${traffic.color}`}>
                    <traffic.Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${traffic.iconColor}`} />
                    <div><p className="font-extrabold text-[15px]">Trafic {traffic.level}</p><p className="text-[12px] mt-1 opacity-80">{traffic.tip}</p></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <h3 className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">Conseils</h3>
                    {[
                      { tip: "Partez avant 7h ou après 21h pour éviter les bouchons à Cotonou", Icon: Timer },
                      { tip: "En taxi-moto vous évitez les embouteillages en centre-ville",      Icon: Route },
                      { tip: "Autour de Dantokpa et du Port, dense toute la journée",            Icon: MapPin },
                      { tip: "Par temps de pluie, prévoyez 30-50% de temps supplémentaire",     Icon: CloudSun },
                      { tip: "Les routes nationales (RNIE) sont fluides hors Cotonou",           Icon: Navigation },
                    ].map(({ tip, Icon }) => (
                      <div key={tip} className="flex items-start gap-2.5">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-green-600 mt-0.5" />
                        <p className="text-[12px] text-gray-600 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// src/components/SavedItineraryDetail.tsx
import { useState, useMemo } from "react";
import { X, MapPin, Clock, Wallet, Star, Navigation, CloudSun, AlertTriangle, Timer, Route, Shuffle } from "lucide-react";
import type { SavedItinerary } from "../context/ItineraryContext";
import ItineraryMapView from "./ItineraryMapView";
import WeatherWidget from "./WeatherWidget";

function fmtH(h: number) {
  if (h < 1) return `${h * 60} min`;
  if (Number.isInteger(h)) return `${h}h`;
  return `${Math.floor(h)}h${((h % 1) * 60) | 0}`;
}

function getTraffic() {
  const h = new Date().getHours();
  if ((h >= 7 && h <= 9) || (h >= 17 && h <= 20))
    return { level:"Élevé",  Icon:AlertTriangle, color:"bg-red-50 border-red-200 text-red-700",     ic:"text-red-500",   tip:"Heures de pointe — partez plus tôt ou plus tard" };
  if (h >= 12 && h <= 14)
    return { level:"Modéré", Icon:Timer,         color:"bg-amber-50 border-amber-200 text-amber-700", ic:"text-amber-500", tip:"Heure du déjeuner — trafic modéré en centre-ville" };
  return   { level:"Fluide", Icon:Route,         color:"bg-green-50 border-green-200 text-green-700",  ic:"text-green-500", tip:"Conditions de circulation favorables" };
}

const CAT: Record<string,string> = {
  histoire:"bg-amber-100 text-amber-700", nature:"bg-emerald-100 text-emerald-700",
  culture:"bg-purple-100 text-purple-700", plage:"bg-cyan-100 text-cyan-700", religion:"bg-rose-100 text-rose-700",
};

type Props = { itinerary: SavedItinerary; onClose: () => void; };

export default function SavedItineraryDetail({ itinerary, onClose }: Props) {
  const [tab, setTab] = useState<"meteo"|"trafic">("meteo");
  const traffic = useMemo(() => getTraffic(), []);
  const date = new Date(itinerary.savedAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto px-2 py-4 sm:px-4 sm:py-8">
      <div className="bg-gray-50 rounded-2xl w-full max-w-5xl shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 bg-white border-b border-gray-200 rounded-t-2xl">
          <div>
            <h2 className="text-[16px] font-extrabold text-gray-900">{itinerary.name}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Sauvegardé le {date} · {itinerary.sites.length} étapes · {itinerary.totalKm} km ·{" "}
              {itinerary.totalEntree === 0 ? "Gratuit" : `${itinerary.totalEntree.toLocaleString("fr-FR")} FCFA`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors flex-shrink-0 ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps : 2 colonnes */}
        <div className="flex flex-col xl:flex-row gap-5 p-5">

          {/* GAUCHE : liste des étapes */}
          <div className="w-full xl:w-[380px] flex-shrink-0 space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label:"Distance", value:`${itinerary.totalKm} km`,  color:"bg-green-50 border-green-200 text-green-800" },
                { label:"Étapes",   value:`${itinerary.sites.length}`, color:"bg-blue-50 border-blue-200 text-blue-800" },
                { label:"Entrées",  value:itinerary.totalEntree===0?"Gratuit":`${itinerary.totalEntree.toLocaleString("fr-FR")}F`, color:"bg-amber-50 border-amber-200 text-amber-800" },
              ].map(s => (
                <div key={s.label} className={`flex flex-col items-center px-2 py-2.5 rounded-xl border ${s.color}`}>
                  <span className="text-[9px] font-bold uppercase tracking-wide opacity-60">{s.label}</span>
                  <span className="text-[13px] font-extrabold mt-0.5">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Départ */}
            {itinerary.startPosition && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <Navigation className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-green-600 tracking-wide">Point de départ</p>
                  <p className="text-[12px] font-semibold text-green-900 mt-0.5">{itinerary.startPosition.label}</p>
                </div>
              </div>
            )}

            {/* Étapes */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5 text-green-600" />
                <h3 className="text-[12px] font-bold text-gray-800">Ordre de visite optimisé</h3>
              </div>
              <ol className="divide-y divide-gray-50">
                {itinerary.sites.map((site, i) => (
                  <li key={site._id} className="flex items-start gap-3 px-4 py-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white ${i===0?"bg-green-600":i===itinerary.sites.length-1?"bg-red-500":"bg-blue-600"}`}>{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[12px] line-clamp-1">{site.nom}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400"><MapPin className="w-2.5 h-2.5 text-green-500"/>{site.ville}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400"><Clock className="w-2.5 h-2.5"/>{fmtH(site.dureeVisite)}</span>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${site.prix===0?"text-emerald-600":"text-gray-500"}`}>
                          <Wallet className="w-2.5 h-2.5"/>{site.prix===0?"Gratuit":`${site.prix.toLocaleString("fr-FR")} FCFA`}
                        </span>
                        {site.noteMoyenne&&<span className="flex items-center gap-1 text-[10px] text-amber-500"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400"/>{site.noteMoyenne.toFixed(1)}</span>}
                        {site.categorie&&<span className={`px-1 py-0.5 rounded text-[9px] font-bold ${CAT[site.categorie]??"bg-gray-100 text-gray-500"}`}>{site.categorie}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* DROITE : Carte + Météo/Trafic */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Carte */}
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height:"360px" }}>
              <ItineraryMapView sites={itinerary.sites} launched={true} visible={true} />
            </div>

            {/* Météo / Trafic */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100 px-3 pt-2">
                {([
                  { key:"meteo"  as const, label:"Météo",  Icon:CloudSun   },
                  { key:"trafic" as const, label:"Trafic", Icon:Navigation },
                ] as const).map(({key,label,Icon})=>(
                  <button key={key} onClick={()=>setTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-all ${tab===key?"border-green-600 text-green-700":"border-transparent text-gray-500 hover:text-gray-800"}`}>
                    <Icon className="w-3.5 h-3.5"/>{label}
                  </button>
                ))}
              </div>

              {tab==="meteo"&&(
                <div className="p-4 space-y-4 max-h-[280px] overflow-y-auto">
                  {itinerary.sites.map((site,i)=>(
                    <div key={site._id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white flex-shrink-0 ${i===0?"bg-green-600":i===itinerary.sites.length-1?"bg-red-500":"bg-blue-600"}`}>{i+1}</div>
                        <div><p className="text-[12px] font-bold text-gray-900">{site.nom}</p><p className="text-[10px] text-gray-400">{site.ville}</p></div>
                        {(site.categorie==="plage"||site.categorie==="nature")&&<span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[9px] font-bold border border-cyan-200">Plein air</span>}
                      </div>
                      <WeatherWidget lat={site.coordonnees.lat} lng={site.coordonnees.lng} city={site.ville} categorie={site.categorie}/>
                      {i<itinerary.sites.length-1&&<div className="border-b border-gray-100 mt-3"/>}
                    </div>
                  ))}
                </div>
              )}

              {tab==="trafic"&&(
                <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
                  <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${traffic.color}`}>
                    <traffic.Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${traffic.ic}`}/>
                    <div><p className="font-extrabold text-[14px]">Trafic {traffic.level}</p><p className="text-[11px] mt-0.5 opacity-80">{traffic.tip}</p></div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {[
                      {tip:"Partez avant 7h ou après 21h pour éviter les bouchons",Icon:Timer},
                      {tip:"En taxi-moto vous évitez les embouteillages en centre-ville",Icon:Route},
                      {tip:"Par temps de pluie, prévoyez 30-50% de temps supplémentaire",Icon:CloudSun},
                      {tip:"Les routes nationales (RNIE) sont fluides hors Cotonou",Icon:Navigation},
                    ].map(({tip,Icon})=>(
                      <div key={tip} className="flex items-start gap-2">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-green-600 mt-0.5"/>
                        <p className="text-[11px] text-gray-600">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

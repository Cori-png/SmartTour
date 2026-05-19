// src/components/WeatherWidget.tsx
// Affiche la météo 7 jours pour un site (Open-Meteo, gratuit)
import { CloudOff, Droplets } from "lucide-react";
import { useWeather } from "../hooks/useWeather";

const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

type Props = {
  lat:   number;
  lng:   number;
  city:  string;
  /** Catégorie du site — pour les alertes météo (outdoor = plage, nature) */
  categorie?: string;
};

export default function WeatherWidget({ lat, lng, city, categorie }: Props) {
  const { data, loading, error } = useWeather(lat, lng, city);

  const isOutdoor = categorie === "nature" || categorie === "plage";

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-gray-400">
        <CloudOff className="w-4 h-4" />
        Météo indisponible
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Prévision 7 jours */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {data.forecasts.map((day, i) => {
          const date  = new Date(day.date);
          const label = i === 0 ? "Auj." : JOURS_FR[date.getDay()];
          const isRainy = day.rainProba >= 60;
          const isWarn  = isOutdoor && isRainy;

          return (
            <div
              key={day.date}
              className={`flex-none flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-center min-w-[52px] border ${
                isWarn
                  ? "bg-amber-50 border-amber-200"
                  : i === 0
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${isWarn ? "text-amber-600" : i === 0 ? "text-green-700" : "text-gray-500"}`}>
                {label}
              </span>
              <span className="text-xl leading-none">{day.emoji}</span>
              <span className="text-[11px] font-bold text-gray-800">{day.tempMax}°</span>
              <div className="flex items-center gap-0.5">
                <Droplets className={`w-2.5 h-2.5 ${isRainy ? "text-blue-500" : "text-gray-300"}`} />
                <span className={`text-[10px] font-semibold ${isRainy ? "text-blue-600" : "text-gray-400"}`}>
                  {day.rainProba}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerte site outdoor si pluie prévue */}
      {isOutdoor && data.forecasts[0].rainProba >= 60 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-[11px] text-amber-800 leading-snug">
            <strong>Pluie probable aujourd'hui ({data.forecasts[0].rainProba}%)</strong> — 
            site en plein air. Envisagez de décaler cette visite à{" "}
            <strong>
              {(() => {
                const best = data.forecasts.find((d, i) => i > 0 && d.rainProba < 40);
                if (!best) return "un jour plus favorable";
                const d = new Date(best.date);
                return JOURS_FR[d.getDay()];
              })()}
            </strong>.
          </p>
        </div>
      )}
    </div>
  );
}

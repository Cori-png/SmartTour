// src/hooks/useWeather.ts
// Utilise Open-Meteo (https://open-meteo.com) — 100% gratuit, aucune clé requise
import { useState, useEffect } from "react";

export type DayForecast = {
  date:           string;  // "2026-05-15"
  tempMax:        number;
  tempMin:        number;
  rainProba:      number;  // 0–100
  weatherCode:    number;  // WMO code
  emoji:          string;
  description:    string;
};

export type WeatherData = {
  city:     string;
  forecasts: DayForecast[];
};

// ── WMO weather code → emoji + label ────────────────────────
function decodeWeatherCode(code: number): { emoji: string; description: string } {
  if (code === 0)                   return { emoji: "☀️",  description: "Ciel dégagé"       };
  if (code <= 3)                    return { emoji: "🌤️",  description: "Partiellement nuageux" };
  if (code <= 48)                   return { emoji: "🌫️",  description: "Brumeux"            };
  if (code <= 57)                   return { emoji: "🌦️",  description: "Bruine"             };
  if (code <= 67)                   return { emoji: "🌧️",  description: "Pluie"              };
  if (code <= 77)                   return { emoji: "🌨️",  description: "Neige / Grésil"    };
  if (code <= 82)                   return { emoji: "⛈️",  description: "Averses"            };
  if (code >= 95)                   return { emoji: "⛈️",  description: "Orage"              };
  return { emoji: "🌥️", description: "Nuageux" };
}

// ── Jours de la semaine en français ─────────────────────────
const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// ── Hook ─────────────────────────────────────────────────────
export function useWeather(lat: number, lng: number, city: string, enabled = true) {
  const [data,    setData]    = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    const cached   = sessionStorage.getItem(cacheKey);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const url = `https://api.open-meteo.com/v1/forecast?`
      + `latitude=${lat}&longitude=${lng}`
      + `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode`
      + `&timezone=Africa%2FAbidjan`
      + `&forecast_days=7`;

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;

        const daily   = json.daily;
        const forecasts: DayForecast[] = daily.time.map((dateStr: string, i: number) => {
          const code = daily.weathercode[i] as number;
          const d    = decodeWeatherCode(code);
          const day  = new Date(dateStr);
          return {
            date:        dateStr,
            tempMax:     Math.round(daily.temperature_2m_max[i]),
            tempMin:     Math.round(daily.temperature_2m_min[i]),
            rainProba:   daily.precipitation_probability_max[i] ?? 0,
            weatherCode: code,
            emoji:       d.emoji,
            description: d.description,
            dayLabel:    JOURS_FR[day.getDay()],
          } as DayForecast & { dayLabel: string };
        });

        const result: WeatherData = { city, forecasts };
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
        setData(result);
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [lat, lng, city, enabled]);

  return { data, loading, error };
}

// src/hooks/useNearbyServices.ts
// Utilise l'API Overpass (OpenStreetMap) — 100% gratuit, aucune clé requise
import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────
export type ServiceType =
  | "hospital"
  | "police"
  | "restaurant"
  | "lodging"
  | "bar"
  | "pharmacy";

export type NearbyService = {
  type: ServiceType;
  nom: string;
  distance: string;
  coordonnees: { lat: number; lng: number };
};

type Coords = { lat: number; lng: number };

// ── Config des types OSM ─────────────────────────────────────
const OSM_QUERIES: Record<ServiceType, string> = {
  hospital:   `node["amenity"="hospital"]`,
  police:     `node["amenity"="police"]`,
  restaurant: `node["amenity"="restaurant"]`,
  lodging:    `node["tourism"="hotel"]`,
  bar:        `node["amenity"="bar"]`,
  pharmacy:   `node["amenity"="pharmacy"]`,
};

// ── Calcul de distance (Haversine) ───────────────────────────
function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

// ── Requête Overpass unique pour tous les types ───────────────
function buildOverpassQuery(lat: number, lng: number, radius: number): string {
  const parts = Object.values(OSM_QUERIES)
    .map((q) => `${q}(around:${radius},${lat},${lng});`)
    .join("\n");

  return `
    [out:json][timeout:20];
    (
      ${parts}
    );
    out body;
  `;
}

// ── Détermine le ServiceType d'un nœud OSM ───────────────────
function getServiceType(tags: Record<string, string>): ServiceType | null {
  if (tags.amenity === "hospital")   return "hospital";
  if (tags.amenity === "police")     return "police";
  if (tags.amenity === "restaurant") return "restaurant";
  if (tags.tourism === "hotel")      return "lodging";
  if (tags.amenity === "bar")        return "bar";
  if (tags.amenity === "pharmacy")   return "pharmacy";
  return null;
}

// ── Hook principal ────────────────────────────────────────────
export function useNearbyServices(coords: Coords, enabled = true) {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const cacheKey = `osm_nearby_${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setServices(JSON.parse(cached));
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetchNearby = async () => {
      try {
        const radius = 50000; // 50 km
        const query  = buildOverpassQuery(coords.lat, coords.lng, radius);

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (!res.ok) throw new Error("Overpass API error");
        const data = await res.json();
        if (cancelled) return;

        const best: Partial<Record<ServiceType, { service: NearbyService; km: number }>> = {};

        for (const element of data.elements) {
          const type = getServiceType(element.tags ?? {});
          if (!type) continue;

          const km = haversineKm(
            coords.lat, coords.lng,
            element.lat, element.lon
          );

          if (!best[type] || km < best[type]!.km) {
            best[type] = {
              service: {
                type,
                nom: element.tags?.name ?? labelFallback(type),
                distance: formatDistance(km),
                coordonnees: { lat: element.lat, lng: element.lon },
              },
              km,
            };
          }
        }

        const ordered: ServiceType[] = [
          "hospital", "police", "restaurant", "lodging", "bar", "pharmacy",
        ];
        const result = ordered
          .filter((t) => best[t])
          .map((t) => best[t]!.service);

        sessionStorage.setItem(cacheKey, JSON.stringify(result));
        setServices(result);
      } catch {
        if (!cancelled) setServices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNearby();
    return () => { cancelled = true; };
  }, [coords.lat, coords.lng, enabled]);

  return { services, loading };
}

// ── Fallback nom si le nœud OSM n'a pas de nom ───────────────
export function labelFallback(type: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    hospital:   "Hôpital",
    police:     "Commissariat",
    restaurant: "Restaurant",
    lodging:    "Hôtel",
    bar:        "Bar",
    pharmacy:   "Pharmacie",
  };
  return labels[type];
}
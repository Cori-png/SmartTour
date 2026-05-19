// src/components/ItineraryMapView.tsx
// Carte Leaflet pour la page Planifier et l'itinéraire optimisé :
// – Marqueurs numérotés (vert=départ, rouge=fin, bleu=intermédiaires)
// – Polyline reliant les étapes dans l'ordre
// – invalidateSize() quand le conteneur redevient visible
import { useEffect, useRef } from "react";
import type { Site } from "./SiteCard";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

type Props = {
  sites:    Site[];
  launched: boolean;
  /** Passer false quand le conteneur est caché (display:none) pour déclencher invalidateSize au retour */
  visible?: boolean;
};

export default function ItineraryMapView({ sites, launched, visible = true }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layersRef      = useRef<any[]>([]);

  // ── Init carte ────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let destroyed = false;
    (mapRef.current as any)._leaflet_id = null;

    import("leaflet").then((L) => {
      if (destroyed || !mapRef.current || mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(mapRef.current!, {
        center: [9.3077, 2.3158] as [number, number],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) (mapRef.current as any)._leaflet_id = null;
    };
  }, []);

  // ── invalidateSize quand on revient sur l'onglet Carte ────
  useEffect(() => {
    if (!visible || !mapInstanceRef.current) return;
    const t = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 60);
    return () => clearTimeout(t);
  }, [visible]);

  // ── Marqueurs + tracé quand sites changent ────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) {
      // La carte peut ne pas encore être prête : retenter après un délai
      const t = setTimeout(() => {
        drawMarkers();
      }, 300);
      return () => clearTimeout(t);
    }
    drawMarkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites, launched]);

  function drawMarkers() {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Supprimer anciens calques
      layersRef.current.forEach((l) => l.remove());
      layersRef.current = [];

      if (sites.length === 0) return;

      // Marqueurs numérotés
      sites.forEach((site, i) => {
        const isFirst = i === 0;
        const isLast  = launched && i === sites.length - 1;
        const bg      = isFirst ? "#15803d" : isLast ? "#dc2626" : "#2563eb";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:${bg};color:white;
            width:32px;height:32px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-weight:800;font-size:13px;
            border:2.5px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            font-family:sans-serif;">${i + 1}</div>`,
          iconSize:    [32, 32],
          iconAnchor:  [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([site.coordonnees.lat, site.coordonnees.lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:140px">
              <div style="font-size:11px;color:#6b7280;margin-bottom:2px">Étape ${i + 1}</div>
              <div style="font-size:13px;font-weight:700;color:#111">${site.nom}</div>
              <div style="font-size:11px;color:#6b7280">${site.ville}</div>
              ${i > 0
                ? `<div style="font-size:11px;color:#15803d;margin-top:4px">
                     ~${haversineKm(sites[i - 1].coordonnees, site.coordonnees).toFixed(0)} km de l'étape précédente
                   </div>`
                : ""}
            </div>`,
            { maxWidth: 220 }
          );
        layersRef.current.push(marker);
      });

      // Polyline entre les étapes
      if (sites.length >= 2) {
        const latlngs = sites.map((s) => [s.coordonnees.lat, s.coordonnees.lng] as [number, number]);
        const poly = L.polyline(latlngs, {
          color:     launched ? "#15803d" : "#9ca3af",
          weight:    launched ? 4          : 2,
          dashArray: launched ? "12,6"     : "6,6",
          opacity:   launched ? 0.9        : 0.5,
        }).addTo(mapInstanceRef.current);
        layersRef.current.push(poly);
        mapInstanceRef.current.fitBounds(poly.getBounds(), { padding: [48, 48] });
      } else if (sites.length === 1) {
        mapInstanceRef.current.setView([sites[0].coordonnees.lat, sites[0].coordonnees.lng], 11);
      }
    });
  }

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", minHeight: "460px" }}
    />
  );
}

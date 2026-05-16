import { useEffect, useRef } from "react";
import type { Site } from "./SiteCard";
import type { NearbyService, ServiceType } from "../hooks/useNearbyServices";

// ── Config des marqueurs de services ────────────────────────
const SERVICE_MARKER_CONFIG: Record<
  ServiceType,
  { bg: string; emoji: string; label: string }
> = {
  hospital:   { bg: "#ef4444", emoji: "🏥", label: "Hôpital"      },
  police:     { bg: "#3b82f6", emoji: "🚔", label: "Police"       },
  restaurant: { bg: "#f97316", emoji: "🍽️", label: "Restaurant"   },
  lodging:    { bg: "#10b981", emoji: "🏨", label: "Hôtel"        },
  bar:        { bg: "#f59e0b", emoji: "🍷", label: "Bar"          },
  pharmacy:   { bg: "#ec4899", emoji: "💊", label: "Pharmacie"    },
};

type Props = {
  sites: Site[];
  hoveredSite: Site | null;
  nearbyServices?: NearbyService[];
};

export default function MapView({ sites, hoveredSite, nearbyServices }: Props) {
  const mapRef          = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef  = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef      = useRef<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceMarkersRef = useRef<any[]>([]);

  // ── Initialisation de la carte ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let destroyed = false;
    (mapRef.current as any)._leaflet_id = null;

    import("leaflet").then((L) => {
      if (destroyed || !mapRef.current || mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [9.3077, 2.3158],
        zoom: 7,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      addSiteMarkers(L, map, sites);
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
        serviceMarkersRef.current = [];
      }
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mise à jour des marqueurs sites ────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
      addSiteMarkers(L, mapInstanceRef.current, sites);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites]);

  // ── Highlight du marqueur survolé ──────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const isHovered = hoveredSite?._id === id;
        marker.setIcon(isHovered ? makeSiteIcon(L, true) : makeSiteIcon(L, false));
        if (isHovered) {
          marker.openPopup();
          mapInstanceRef.current.setView(
            marker.getLatLng(),
            Math.max(mapInstanceRef.current.getZoom(), 10),
            { animate: true }
          );
        }
      });
    });
  }, [hoveredSite]);

  // ── Marqueurs de services à proximité ──────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Supprimer les anciens marqueurs de services
      serviceMarkersRef.current.forEach((m) => m.remove());
      serviceMarkersRef.current = [];

      if (!nearbyServices || nearbyServices.length === 0) return;

      nearbyServices.forEach((service) => {
        const cfg = SERVICE_MARKER_CONFIG[service.type];
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              background: ${cfg.bg};
              width: 32px; height: 32px;
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              font-size: 15px;
              border: 2.5px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            ">${cfg.emoji}</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(
          [service.coordonnees.lat, service.coordonnees.lng],
          { icon }
        )
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<div style="min-width:140px;font-family:sans-serif;padding:2px 0">
              <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:2px">
                ${service.nom}
              </div>
              <div style="font-size:11px;color:#6b7280">${cfg.label} · ${service.distance}</div>
            </div>`,
            { maxWidth: 220 }
          );

        serviceMarkersRef.current.push(marker);
      });
    });
  }, [nearbyServices]);

  // ── Helpers ─────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeSiteIcon(L: any, active: boolean) {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          width: ${active ? 36 : 28}px;
          height: ${active ? 36 : 28}px;
          background: ${active ? "#15803d" : "#ffffff"};
          border: 3px solid ${active ? "#15803d" : "#16a34a"};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg) ${active ? "scale(1.2)" : ""};
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transition: all 0.2s ease;
        "></div>
      `,
      iconSize: [active ? 36 : 28, active ? 36 : 28],
      iconAnchor: [active ? 18 : 14, active ? 36 : 28],
      popupAnchor: [0, -30],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addSiteMarkers(L: any, map: any, sitesToAdd: Site[]) {
    sitesToAdd.forEach((site) => {
      const marker = L.marker(
        [site.coordonnees.lat, site.coordonnees.lng],
        { icon: makeSiteIcon(L, false) }
      )
        .addTo(map)
        .bindPopup(
          `<div style="min-width:160px;font-family:sans-serif">
            <strong style="font-size:13px;color:#111">${site.nom}</strong><br/>
            <span style="font-size:11px;color:#6b7280">${site.ville}</span><br/>
            <span style="font-size:11px;color:#15803d;font-weight:600">
              ${site.prix === 0 ? "Gratuit" : site.prix.toLocaleString("fr-FR") + " FCFA"}
            </span>
          </div>`,
          { maxWidth: 220 }
        );

      markersRef.current[site._id] = marker;
    });
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-2xl overflow-hidden border border-gray-200"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}

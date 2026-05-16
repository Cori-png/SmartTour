// src/components/SiteMiniMap.tsx
// Mini carte Leaflet pour le modal de détail d'un site
import { useEffect, useRef } from "react";

type Props = {
  coords: { lat: number; lng: number };
  nom: string;
};

export default function SiteMiniMap({ coords, nom }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

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
        center: [coords.lat, coords.lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:32px; height:32px;
            background:#15803d;
            border:3px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
          "></div>
        `,
        iconSize:    [32, 32],
        iconAnchor:  [16, 32],
        popupAnchor: [0, -34],
      });

      L.marker([coords.lat, coords.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<strong style="font-size:12px;font-family:sans-serif">${nom}</strong>`,
          { closeButton: false }
        )
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = null;
      }
    };
  }, [coords.lat, coords.lng, nom]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden border border-gray-200"
      style={{ minHeight: "180px" }}
    />
  );
}

// src/components/NearbyServicesBar.tsx
import { useRef, useState, useEffect, Fragment } from "react";
import {
  Activity, Shield, Utensils, BedDouble, Wine, Pill, Plus,
} from "lucide-react";
import { useNearbyServices } from "../hooks/useNearbyServices";
import type { ServiceType, NearbyService } from "../hooks/useNearbyServices";

// ── Config visuelle par type ─────────────────────────────────
const SERVICE_STYLE: Record<
  ServiceType,
  { icon: React.ReactNode; iconBg: string; textColor: string; label: string }
> = {
  hospital: {
    icon: <Activity className="w-3 h-3" />,
    iconBg: "bg-red-100 text-red-500",
    textColor: "text-gray-600",
    label: "Hôpital",
  },
  police: {
    icon: <Shield className="w-3 h-3" />,
    iconBg: "bg-blue-100 text-blue-500",
    textColor: "text-gray-600",
    label: "Police",
  },
  restaurant: {
    icon: <Utensils className="w-3 h-3" />,
    iconBg: "bg-orange-100 text-orange-500",
    textColor: "text-gray-600",
    label: "Restaurants",
  },
  lodging: {
    icon: <BedDouble className="w-3 h-3" />,
    iconBg: "bg-emerald-100 text-emerald-500",
    textColor: "text-gray-600",
    label: "Lodges",
  },
  bar: {
    icon: <Wine className="w-3 h-3" />,
    iconBg: "bg-amber-100 text-amber-500",
    textColor: "text-gray-600",
    label: "Bars",
  },
  pharmacy: {
    icon: <Pill className="w-3 h-3" />,
    iconBg: "bg-pink-100 text-pink-500",
    textColor: "text-gray-600",
    label: "Pharmacie",
  },
};

// ── Chip individuel ──────────────────────────────────────────
function ServiceChip({ service }: { service: NearbyService }) {
  const cfg = SERVICE_STYLE[service.type];
  return (
    <span className="flex items-center gap-1.5 flex-shrink-0">
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 p-0.5 rounded-full flex-shrink-0 ${cfg.iconBg}`}
        style={{ width: "18px", height: "18px" }}
      >
        {cfg.icon}
      </span>
      <span className={`text-[11px] ${cfg.textColor}`}>
        <span className="font-medium">{cfg.label}</span>
        {" "}à {service.distance}
      </span>
    </span>
  );
}

// ── Skeleton de chargement ───────────────────────────────────
function ServiceSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {[80, 64, 72].map((w) => (
        <span key={w} className="flex items-center gap-1.5">
          <span className="w-[18px] h-[18px] rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
          <span
            className="h-3 rounded bg-gray-100 animate-pulse"
            style={{ width: w }}
          />
        </span>
      ))}
    </div>
  );
}

// ── Composant principal ──────────────────────────────────────
type Props = {
  coords: { lat: number; lng: number };
};

export default function NearbyServicesBar({ coords }: Props) {
  const ref             = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Chargement lazy : fetch déclenché seulement à la visibilité
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { services, loading } = useNearbyServices(coords, inView);

  const MAX_VISIBLE = 3;
  const visible = showAll ? services : services.slice(0, MAX_VISIBLE);
  const extra   = services.length - MAX_VISIBLE;

  return (
    <div ref={ref} className="border-t border-gray-100 px-4 py-2.5 bg-white">
      {loading ? (
        <ServiceSkeleton />
      ) : services.length > 0 ? (
        <div className="flex items-center gap-0 flex-wrap">
          {/* Chips interleaved avec séparateurs verticaux */}
          {visible.map((s, i) => (
            <Fragment key={s.type}>
              {i > 0 && (
                <span className="w-px h-3 bg-gray-200 mx-2.5 flex-shrink-0" />
              )}
              <ServiceChip service={s} />
            </Fragment>
          ))}

          {/* Bouton "+" pour voir plus */}
          {!showAll && extra > 0 && (
            <>
              <span className="w-px h-3 bg-gray-200 mx-2.5 flex-shrink-0" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAll(true);
                }}
                className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                title={`Voir ${extra} service${extra > 1 ? "s" : ""} de plus`}
              >
                <Plus className="w-2.5 h-2.5 text-gray-500" />
              </button>
            </>
          )}
        </div>
      ) : inView ? (
        // Overpass a répondu mais aucun service trouvé
        <span className="text-[11px] text-gray-400">Aucun service à proximité</span>
      ) : null}
    </div>
  );
}

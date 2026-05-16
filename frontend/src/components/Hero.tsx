import { MapPin, BarChart2, Home } from "lucide-react";
import type { ReactNode } from "react";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
};

// ─────────────────────────────────────────
// Données
// ─────────────────────────────────────────
const FEATURES: Feature[] = [
  {
    icon: <MapPin className="w-5 h-5 text-emerald-300" />,
    title: "Sites touristiques",
    desc: "Explorez les plus beaux lieux du Bénin",
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-emerald-300" />,
    title: "Itinéraires intelligents",
    desc: "Optimisez vos trajets et gagnez du temps",
  },
  {
    icon: <Home className="w-5 h-5 text-emerald-300" />,
    title: "Services à proximité",
    desc: "Santé, sécurité, restos et plus",
  },
];

// ─────────────────────────────────────────
// Composant
// ─────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative h-[450px] overflow-hidden">

      {/* vidéo de fond */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/images/VID-20260506-WA0110.mp4" type="video/mp4" />
      </video>

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col justify-center h-full px-14 max-w-[560px]">

        <h1 className="text-[38px] font-bold text-white leading-[1.2] mb-4">
          Découvrez le Bénin autrement avec{" "}
          <div className="text-[38px] font-extrabold tracking-tight text-gray-900">
          Smart<span className="text-green-400">Tour</span>
          </div>
        </h1>

        <p className="text-white/80 text-[15px] mb-8 leading-relaxed">
          Planifiez votre voyage, explorez les merveilles et vivez des expériences inoubliables.
        </p>

        {/* Features */}
        <div className="flex gap-7">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-1">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-1">
                {f.icon}
              </div>
              <strong className="text-sm font-bold text-white">{f.title}</strong>
              <span className="text-xs text-white/70 max-w-[110px]">
                {f.desc}
              </span>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
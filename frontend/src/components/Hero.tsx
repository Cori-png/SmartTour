import { MapPin, BarChart2, Home } from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
};

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

export default function Hero() {
  return (
    <section className="relative h-[340px] sm:h-[400px] md:h-[450px] overflow-hidden">

      {/* Vidéo de fond */}
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
      <div className="absolute inset-0 bg-black/45" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 md:px-14 max-w-[90vw] sm:max-w-[560px]">

        <h1 className="text-[26px] sm:text-[32px] md:text-[38px] font-bold text-white leading-[1.2] mb-3 sm:mb-4">
          Découvrez le Bénin autrement avec{" "}
          <span className="block font-extrabold tracking-tight text-gray-900">
            Smart<span className="text-green-400">Tour</span>
          </span>
        </h1>

        <p className="text-white/80 text-[13px] sm:text-[15px] mb-6 sm:mb-8 leading-relaxed">
          Explorez le Bénin selon vos envies. Trouvez les meilleurs sites touristiques adaptés à vos centres d'interêts, puis planifiez facilement votre séjour.
        </p>

        {/* Features — scroll horizontal sur très petit écran */}
        <div className="flex gap-4 sm:gap-7 overflow-x-auto scrollbar-hide">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-1 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center mb-1">
                {f.icon}
              </div>
              <strong className="text-[11px] sm:text-sm font-bold text-white whitespace-nowrap">{f.title}</strong>
              <span className="text-[10px] sm:text-xs text-white/70 max-w-[100px] sm:max-w-[110px]">
                {f.desc}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
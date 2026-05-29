import { useState, useEffect, useRef } from "react";
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
  const [showTitle, setShowTitle] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showFeatures, setShowFeatures] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fullText = "Explorez le Bénin selon vos envies. Trouvez les meilleurs sites touristiques adaptés à vos centres d’intérêt, puis planifiez facilement votre séjour.";

  useEffect(() => {
    // Tenter de lire la vidéo programmatiquement (contourne certains blocages navigateur)
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => setVideoError(true));
    }

    // 1. D'abord on voit uniquement la vidéo, puis le titre apparaît après 500ms
    const titleT = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    // Les features apparaissent après 2 secondes pour guider l'utilisateur
    const featuresT = setTimeout(() => {
      setShowFeatures(true);
    }, 2000);

    return () => {
      clearTimeout(titleT);
      clearTimeout(featuresT);
    };
  }, [videoError]);

  useEffect(() => {
    if (!showTitle) return;

    let timer: number;

    if (!isDeleting) {
      // Phase d'écriture
      if (typedText.length < fullText.length) {
        timer = window.setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 15); // vitesse de dactylographie
      } else {
        // Fin de l'écriture -> on attend 4 secondes avant d'effacer
        timer = window.setTimeout(() => {
          setIsDeleting(true);
        }, 4000);
      }
    } else {
      // Phase d'effacement
      if (typedText.length > 0) {
        timer = window.setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length - 1));
        }, 8); // effacement rapide
      } else {
        // Fin de l'effacement -> on attend 500ms puis on recommence à écrire
        timer = window.setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [showTitle, typedText, isDeleting]);

  return (
    <section className="relative h-[340px] sm:h-[400px] md:h-[450px] overflow-hidden">

      {/* Image de fond de secours (visible si la vidéo ne charge pas) */}
      <img
        src="/images/herobg.png"
        alt="Bénin paysage"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Vidéo de fond par-dessus l'image, masquée si erreur */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={() => setVideoError(true)}
          onCanPlay={() => videoRef.current?.play().catch(() => setVideoError(true))}
        >
          <source src="/images/VID-20260506-WA0110.mp4" type="video/mp4" />
        </video>
      )}

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 md:px-14 max-w-[90vw] sm:max-w-[560px]">

        {/* Titre principal animé */}
        <h1 className={`text-[26px] sm:text-[32px] md:text-[38px] font-bold text-white leading-[1.2] mb-3 sm:mb-4 transition-all duration-1000 transform ${
          showTitle ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}>
          Découvrez le Bénin autrement avec{" "}
          <span className="block font-extrabold tracking-tight text-black drop-shadow-md">
            Smart<span className="text-green-400">Tour</span>
          </span>
        </h1>

        {/* Sous-titre avec effet de dactylographie */}
        <p className="text-white/95 text-[20px] sm:text-[17.5px] md:text-[19px] mb-6 sm:mb-8 leading-relaxed min-h-[90px] sm:min-h-[68px] font-medium drop-shadow-md">
          {typedText}
          {typedText.length < fullText.length && (
            <span className="inline-block w-[2px] h-[18px] bg-green-400 ml-1.5 align-middle animate-pulse">|</span>
          )}
        </p>

        {/* Features animées */}
        <div className={`flex gap-4 sm:gap-7 overflow-x-auto scrollbar-hide transition-all duration-1000 transform ${
          showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`flex flex-col gap-1 flex-shrink-0 ${i === 0 ? "animate-float" : i === 1 ? "animate-float-delay-1" : "animate-float-delay-2"}`}>
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
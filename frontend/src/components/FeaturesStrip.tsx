import { Activity, Home, DollarSign, Share2 } from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: <Activity className="w-5 h-5 text-green-700" strokeWidth={1.8} />,
    title: "Planification intelligente",
    desc: "Obtenez l'ordre de visite optimal et gagnez du temps",
  },
  {
    icon: <Home className="w-5 h-5 text-green-700" strokeWidth={1.8} />,
    title: "Infos en temps réel",
    desc: "Météo, trafic, horaires d'ouverture et bien plus",
  },
  {
    icon: <DollarSign className="w-5 h-5 text-green-700" strokeWidth={1.8} />,
    title: "Budget maîtrisé",
    desc: "Estimez vos dépenses et voyagez en toute sérénité",
  },
  {
    icon: <Share2 className="w-5 h-5 text-green-700" strokeWidth={1.8} />,
    title: "Sauvegarde & partage",
    desc: "Enregistrez vos itinéraires et partagez-les facilement",
  },
];

export default function FeaturesStrip() {
  return (
    <div className="grid grid-cols-4 bg-gray-50 border-t border-b border-gray-200">
      {FEATURES.map((f, i) => (
        <div
          key={f.title}
          className={`flex items-start gap-3.5 px-6 py-7 ${
            i < FEATURES.length - 1 ? "border-r border-gray-200" : ""
          }`}
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-[10px] bg-green-50 flex items-center justify-center">
            {f.icon}
          </div>
          <div>
            <p className="text-[13.5px] font-bold text-gray-900 mb-1">{f.title}</p>
            <p className="text-[12px] text-gray-500 leading-[1.45]">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

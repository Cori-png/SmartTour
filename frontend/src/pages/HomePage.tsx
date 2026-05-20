import Navbar        from "../components/Navbar";
import Hero          from "../components/Hero";
import SearchBar     from "../components/SearchBar";
import Destinations  from "../components/Destinations";
import FeaturesStrip from "../components/FeaturesStrip";
import Footer        from "../components/Footer";
import ScrollReveal  from "../components/ScrollReveal";
import { useState }  from "react";
import {
  ChevronDown, ChevronUp, HelpCircle, MessageCircle,
  Map, ClipboardList, User, Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

// ── Catégories FAQ avec icônes Lucide ────────────────────────
type FaqCategory = {
  id:        string;
  label:     string;
  icon:      ReactNode;
  questions: { q: string; a: string }[];
};

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "decouverte",
    label: "Découverte",
    icon: <Map className="w-4 h-4" />,
    questions: [
      { q: "Quels sites touristiques peut-on explorer avec SmartTour ?", a: "SmartTour référence 12 sites incontournables du Bénin : patrimoine historique (Palais d'Abomey, Route de l'Esclave), nature (Parc de la Pendjari, Cascade de Kota), plages (Grand-Popo), culture (Ganvié, Dantokpa) et spiritualité (Temple des Pythons, Forêt de Kpassè)." },
      { q: "Comment fonctionne la recherche de sites ?", a: "Entrez votre activité souhaitée, la destination, la durée de visite max et votre budget dans la barre de recherche. SmartTour filtre automatiquement les sites correspondants et les affiche sur la carte interactive." },
      { q: "Les informations sur les sites sont-elles à jour ?", a: "Oui, les horaires, prix et descriptions sont régulièrement mis à jour par notre équipe. L'administrateur peut ajouter, modifier et supprimer des sites depuis son tableau de bord." },
    ],
  },
  {
    id: "planification",
    label: "Planification",
    icon: <ClipboardList className="w-4 h-4" />,
    questions: [
      { q: "Comment créer un itinéraire personnalisé ?", a: "Sélectionnez les sites qui vous intéressent sur la page Explorer, ajoutez-les à votre itinéraire, puis cliquez sur 'Planifier'. SmartTour génère automatiquement l'ordre optimal de visite en tenant compte des distances." },
      { q: "Puis-je modifier mon itinéraire après l'avoir créé ?", a: "Oui ! Depuis votre tableau de bord (onglet 'Mes itinéraires'), vous pouvez voir, partager et imprimer vos itinéraires. La modification complète est disponible en retournant sur la page Explorer." },
      { q: "Comment partager mon itinéraire avec quelqu'un ?", a: "Dans votre tableau de bord, cliquez sur l'icône de partage à côté d'un itinéraire. Une fenêtre s'ouvre pour entrer l'adresse email du destinataire et l'itinéraire est envoyé automatiquement." },
    ],
  },
  {
    id: "compte",
    label: "Compte & Accès",
    icon: <User className="w-4 h-4" />,
    questions: [
      { q: "Dois-je créer un compte pour utiliser SmartTour ?", a: "Vous pouvez explorer les sites et consulter les informations sans compte. Cependant, la création d'itinéraires, la sauvegarde de favoris et l'accès au tableau de bord nécessitent une inscription gratuite." },
      { q: "Comment me connecter en tant qu'administrateur ?", a: "Utilisez l'email administrateur fourni lors de la configuration. Le système détecte automatiquement le rôle admin et vous redirige vers le tableau de bord d'administration avec toutes les fonctionnalités de gestion." },
      { q: "Mes données sont-elles sécurisées ?", a: "Vos informations sont stockées localement de manière sécurisée. Nous ne partageons jamais vos données personnelles avec des tiers. La connexion utilise un système d'authentification robuste." },
    ],
  },
  {
    id: "budget",
    label: "Budget & Tarifs",
    icon: <Wallet className="w-4 h-4" />,
    questions: [
      { q: "SmartTour est-il gratuit ?", a: "Oui, l'utilisation de SmartTour est entièrement gratuite. Créez un compte, explorez les sites et planifiez vos itinéraires sans aucun frais." },
      { q: "Comment sont calculés les prix des visites ?", a: "Les prix affichés correspondent aux droits d'entrée officiels de chaque site touristique. Certains sites comme la Plage de Grand-Popo et la Place de l'Amazone sont gratuits." },
      { q: "Puis-je filtrer les sites par budget ?", a: "Absolument ! Utilisez le filtre 'Budget max' dans la barre de recherche ou dans le panneau de filtres de la page Explorer pour n'afficher que les sites correspondant à votre budget." },
    ],
  },
];

// ── Accordéon ────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? "border-green-300 bg-green-50/40" : "border-gray-200 bg-white"}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left gap-3"
      >
        <span className={`text-[13px] font-semibold leading-snug ${open ? "text-green-800" : "text-gray-800"}`}>{question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-green-600 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4">
          <p className="text-[13px] text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("decouverte");
  const currentCat = FAQ_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-white font-sans">

      <Navbar />
      <Hero />
      <SearchBar />
      <Destinations />
      <ScrollReveal delay={100}>
        <FeaturesStrip />
      </ScrollReveal>

      {/* ── Section FAQ ────────────────────────────────────── */}
      <ScrollReveal delay={200}>
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Titre */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-[12px] font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Aide &amp; FAQ
          </span>
          <h2 className="text-[24px] sm:text-[28px] md:text-[34px] font-extrabold text-gray-900 tracking-tight">
            Questions fréquentes
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] mt-2 max-w-xl mx-auto">
            Tout ce que vous devez savoir pour planifier votre aventure béninoise avec SmartTour.
          </p>
        </div>

        {/* Layout 2 colonnes sur md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8">

          {/* Colonne gauche — catégories en pills sur mobile, sidebar sur desktop */}
          <aside>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 px-1 hidden md:block">Catégories</p>

            {/* Pills horizontaux sur mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-hide">
              {FAQ_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-full text-[12px] font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-green-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sidebar vertical sur desktop */}
            <div className="hidden md:flex flex-col gap-2">
              {FAQ_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold text-left transition-all ${
                    activeCategory === cat.id
                      ? "bg-green-700 text-white shadow-md shadow-green-200"
                      : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}

              {/* Bloc contact */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-600 text-white">
                <MessageCircle className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-[13px] font-bold">Vous n'avez pas trouvé votre réponse ?</p>
                <p className="text-[12px] opacity-75 mt-1">Notre équipe est disponible pour vous aider.</p>
                <a href="/contact"
                  className="inline-block mt-3 px-4 py-2 rounded-xl bg-white text-green-700 text-[12px] font-bold hover:bg-green-50 transition-colors">
                  Nous contacter →
                </a>
              </div>
            </div>
          </aside>

          {/* Colonne droite — questions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-700">{currentCat.icon}</span>
              <h3 className="text-[15px] sm:text-[16px] font-extrabold text-gray-900">{currentCat.label}</h3>
              <span className="ml-auto text-[11px] text-gray-400 font-medium">{currentCat.questions.length} questions</span>
            </div>
            {currentCat.questions.map(item => (
              <FAQItem key={item.q} question={item.q} answer={item.a} />
            ))}

            {/* Bloc contact mobile (sous les questions) */}
            <div className="md:hidden mt-4 p-4 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-600 text-white">
              <MessageCircle className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-[13px] font-bold">Pas trouvé votre réponse ?</p>
              <a href="/contact"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-white text-green-700 text-[12px] font-bold hover:bg-green-50 transition-colors">
                Nous contacter →
              </a>
            </div>
          </div>

        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}

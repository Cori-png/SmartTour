import { Link } from "react-router-dom";
import { Mail, Phone} from "lucide-react";
import Logo from "/images/Logo_ST.png";
// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};



// ─────────────────────────────────────────────────────────────
// Données
// ─────────────────────────────────────────────────────────────
const SECTIONS: FooterSection[] = [
  {
    title: "Explorer",
    links: [
      { label: "Sites touristiques", href: "/explorer" },
      { label: "Boutiques artisanales", href: "/boutiques" },
      { label: "Carte interactive", href: "/carte" },
      { label: "Événements locaux", href: "/evenements" },
    ],
  },
  {
    title: "Planifier",
    links: [
      { label: "Créer un itinéraire", href: "/itineraire/nouveau" },
      { label: "Estimation du budget", href: "/budget" },
      { label: "Services à proximité", href: "/services" },
      { label: "Météo & trafic", href: "/infos" },
    ],
  },
  {
    title: "SmartTour",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Aide & FAQ", href: "/aide" },
    ],
  },
];


const LEGAL_LINKS: FooterLink[] = [
  { label: "Confidentialité",       href: "/confidentialite" },
  { label: "Conditions d'utilisation", href: "/conditions" },
  { label: "Mentions légales",      href: "/mentions" },
  { label: "Cookies",               href: "/cookies" },
];

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      {/* ── Partie principale ── */}
      <div className="px-12 pt-14 pb-10 grid grid-cols-12 gap-8">

        {/* Colonne marque */}
        <div className="col-span-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <img src={Logo} alt="SmartTour Logo" className="w-30 h-20 object-contain"/>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-[280px]">
            La plateforme intelligente de planification touristique au Bénin.
            Itinéraires optimisés, recommandations personnalisées et infos en temps réel.
          </p>

          {/* Contact */}
          <div className="flex flex-col gap-2.5 mb-6">
            <a
              href="mailto:contact@smarttour-benin.com"
              className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              contact@smarttour-benin.com
            </a>
            <a
              href="tel:+22901000000"
              className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              +229 01 00 00 00
            </a>
          </div>

         
        </div>

        {/* Colonnes de liens */}
        {SECTIONS.map((section) => (
          <div key={section.title} className="col-span-2 col-start-auto">
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Application mobile */}
        <div className="col-span-2">
          <h3 className="text-sm font-bold text-white mb-4 tracking-wide">Application</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Emportez SmartTour partout avec vous.
          </p>

          {/* Google Play */}
          <a
            href="#"
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 mb-2 hover:border-green-500 transition-colors"
            aria-label="Télécharger sur Google Play"
          >
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M3.18 23.18c.28.16.6.16.88 0l9.5-5.5-2.5-2.5-7.88 8zM.5 1.39C.19 1.7 0 2.19 0 2.85v18.3c0 .66.19 1.15.5 1.46l.08.07 10.25-10.25v-.24L.58 1.32.5 1.39zm20.18 7.19L17.5 6.56l-2.65 2.65 2.65 2.65 3.2-1.87c.91-.53.91-1.39-.02-1.91zM3.18.82 13.06 6.44 10.58 8.92 3.18.82z" />
            </svg>
            <div>
              <p className="text-[8px] uppercase tracking-wider text-gray-400">Disponible sur</p>
              <p className="text-xs font-bold text-white">Google Play</p>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 hover:border-green-500 transition-colors"
            aria-label="Télécharger sur l'App Store"
          >
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div>
              <p className="text-[8px] uppercase tracking-wider text-gray-400">Télécharger dans</p>
              <p className="text-xs font-bold text-white">l'App Store</p>
            </div>
          </a>
        </div>

      </div>

      {/* ── Barre de bas de page ── */}
      <div className="border-t border-gray-800 px-12 py-5 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} SmartTour Bénin. Tous droits réservés.
        </p>
        <nav className="flex gap-5" aria-label="Liens légaux">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs text-gray-500 hover:text-green-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

    </footer>
  );
}

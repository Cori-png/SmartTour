import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Logo = "/images/Logo_ST.png";

// ─────────────────────────────────────────────────────────────
// Liens du footer — uniquement des routes qui existent
// ─────────────────────────────────────────────────────────────
const COL1 = [
  { label: "Accueil",           href: "/" },
  { label: "Explorer les sites",href: "/explorer" },
  { label: "Planifier un voyage",href: "/planifier" },
  { label: "Mon tableau de bord",href: "/dashboard" },
];

const COL2 = [
  { label: "À propos de SmartTour", href: "/a-propos" },
  { label: "Nous contacter",        href: "/contact" },
  { label: "Se connecter",          href: "/login" },
  { label: "Créer un compte",       href: "/register" },
];

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">

      {/* ── Corps principal ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-12 pb-6 sm:pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

        {/* Marque */}
        <div className="md:col-span-2">
          <Link to="/" className="inline-flex items-center mb-4">
            <img src={Logo} alt="SmartTour" className="w-24 h-16 object-contain" />
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            La plateforme intelligente de planification touristique au Bénin.
            Itinéraires optimisés, sites incontournables et infos en temps réel.
          </p>
          {/* Contacts */}
          <div className="flex flex-col gap-2 mt-5">
            <a href="mailto:contact@smarttour-benin.com"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
              <Mail className="w-4 h-4 flex-shrink-0" />
              contact@smarttour-benin.com
            </a>
            <a href="tel:+22901000000"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
              <Phone className="w-4 h-4 flex-shrink-0" />
              +229 01 00 00 00
            </a>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Cotonou, Bénin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Navigation</h3>
          <ul className="flex flex-col gap-2.5">
            {COL1.map((l) => (
              <li key={l.href}>
                <Link to={l.href}
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SmartTour */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">SmartTour</h3>
          <ul className="flex flex-col gap-2.5">
            {COL2.map((l) => (
              <li key={l.href}>
                <Link to={l.href}
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Barre bas ── */}
      <div className="border-t border-gray-800 px-4 sm:px-6 md:px-12 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} SmartTour Bénin. Tous droits réservés.
        </p>
        <div className="flex gap-5">
          <Link to="/contact" className="text-xs text-gray-500 hover:text-green-400 transition-colors">
            Confidentialité
          </Link>
          <Link to="/a-propos" className="text-xs text-gray-500 hover:text-green-400 transition-colors">
            Mentions légales
          </Link>
          <Link to="/contact" className="text-xs text-gray-500 hover:text-green-400 transition-colors">
            Cookies
          </Link>
        </div>
      </div>

    </footer>
  );
}

import { Scale, Building, Globe, Mail, FileWarning, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MentionsLegales() {
  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative text-white py-14 sm:py-16 md:py-20 overflow-hidden bg-emerald-950">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center p-3.5 bg-white/10 backdrop-blur-md rounded-2xl mb-5 border border-white/20 animate-float">
            <Scale className="text-emerald-400" size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 tracking-tight">
            Mentions Légales
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto">
            Cadre réglementaire et informations légales de l'application SmartTour Bénin.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Column - Publisher and Hosting info */}
          <div className="md:col-span-2 space-y-8">
            {/* 1. Éditeur */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
              <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <Building className="text-emerald-600 dark:text-emerald-400" size={24} />
                Éditeur de l'application
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed text-base">
                <p>
                  L'application web <span className="font-bold text-gray-950 dark:text-white">SmartTour Bénin</span> est éditée par la société **SmartTour Bénin SAS**, société par actions simplifiée au capital social de **5 000 000 FCFA**.
                </p>
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-xs uppercase font-bold">Siège social</p>
                    <p className="font-semibold text-gray-800 dark:text-white">Cotonou, Bénin</p>
                    <p>Quartier Ganhi, Immeuble SmartTour</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-xs uppercase font-bold">Enregistrement</p>
                    <p className="font-semibold text-gray-800 dark:text-white">RCCM COTONOU</p>
                    <p>N° RB/COT/25 B 98765</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-xs uppercase font-bold">Numéro IFU</p>
                    <p className="font-semibold text-gray-800 dark:text-white">3202512345678</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-xs uppercase font-bold">Contact principal</p>
                    <p className="font-semibold text-gray-800 dark:text-white">aladecorina@gmail.com</p>
                    <p>+229 01 00 00 00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Hébergement */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
              <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <Globe className="text-emerald-600 dark:text-emerald-400" size={24} />
                Hébergement et base de données
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
                <p>
                  L'infrastructure technique de la plateforme SmartTour Bénin repose sur des solutions cloud modernes garantissant disponibilité et rapidité d'affichage :
                </p>
                <div className="border border-gray-150 dark:border-slate-800 rounded-2xl divide-y divide-gray-150 dark:divide-slate-800 overflow-hidden">
                  <div className="p-4 flex gap-4 items-start">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md font-bold text-xs uppercase mt-0.5">Base de données</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Convex Inc.</p>
                      <p className="text-gray-500 dark:text-slate-400">Siège social : San Francisco, Californie, USA. Plateforme cloud backend temps réel.</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 items-start">
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md font-bold text-xs uppercase mt-0.5">Hébergement Web</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Vercel Inc.</p>
                      <p className="text-gray-500 dark:text-slate-400">Siège social : 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Déploiement et CDN mondial.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Propriété Intellectuelle */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
              <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
                Propriété intellectuelle
              </h2>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4 text-sm">
                La structure générale de l'application (code, composants interactifs, maquette), ainsi que les textes, logos, designs, images et vidéos intégrés sont la propriété exclusive de **SmartTour Bénin**, sauf mention contraire.
              </p>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
              </p>
            </div>
          </div>

          {/* Right Column - Sidebars / Editorial responsibility */}
          <div className="space-y-8">
            {/* Responsabilité éditoriale */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-lg">
              <h3 className="text-lg font-bold font-serif text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileWarning className="text-amber-500" size={20} />
                Responsabilité
              </h3>
              <p className="text-gray-600 dark:text-slate-300 text-xs leading-relaxed mb-3">
                SmartTour Bénin s'efforce de fournir des données touristiques fiables et mises à jour (horaires, prix indicatifs, météo, etc.). Toutefois, les informations ne sont fournies qu'à titre indicatif.
              </p>
              <p className="text-gray-600 dark:text-slate-300 text-xs leading-relaxed">
                La société ne saurait être tenue pour responsable des erreurs, d'une absence de disponibilité des informations, ou de modifications soudaines des conditions d'accès aux sites touristiques répertoriés.
              </p>
            </div>

            {/* Publication */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-lg">
              <h3 className="text-lg font-bold font-serif text-gray-900 dark:text-white mb-4">Directeurs de la publication</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-gray-400 uppercase font-bold">Directeur de publication</p>
                  <p className="font-semibold text-gray-800 dark:text-white">L'équipe SmartTour Bénin</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-bold">Contact Editorial</p>
                  <p className="font-semibold text-gray-850 dark:text-white">aladecorina@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-emerald-50 dark:bg-slate-900/60 border border-emerald-100/50 dark:border-slate-800 rounded-3xl p-8 text-center">
              <Mail className="mx-auto text-emerald-600 dark:text-emerald-400 mb-3" size={24} />
              <h4 className="font-bold font-serif text-gray-950 dark:text-white text-sm mb-1">Un signalement ?</h4>
              <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed mb-4">
                Pour signaler un contenu inapproprié ou erroné sur un site touristique :
              </p>
              <a
                href="mailto:aladecorina@gmail.com"
                className="inline-block text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-2 rounded-xl"
              >
                aladecorina@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

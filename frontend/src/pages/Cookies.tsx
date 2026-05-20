import { Cookie, Settings, ShieldCheck, Trash2, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cookies() {
  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative text-white py-14 sm:py-16 md:py-20 overflow-hidden bg-emerald-950">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center p-3.5 bg-white/10 backdrop-blur-md rounded-2xl mb-5 border border-white/20 animate-float">
            <Cookie className="text-emerald-400 animate-pulse" size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 tracking-tight">
            Utilisation des Cookies
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto">
            Comment et pourquoi nous utilisons le stockage pour améliorer votre navigation.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Intro Banner */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg mb-10 flex flex-col sm:flex-row gap-6 items-start">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-2xl">
            <Info size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white mb-3">
              Qu'est-ce qu'un cookie ?
            </h2>
            <p className="text-gray-600 dark:text-slate-350 leading-relaxed text-sm">
              Un cookie est un petit fichier texte sauvegardé par votre navigateur sur votre ordinateur ou appareil mobile lorsque vous visitez un site internet. Il permet au site de mémoriser vos actions et préférences (comme la connexion, la langue choisie ou le thème d'affichage) pendant un certain temps, pour que vous n'ayez pas à les réintroduire à chaque visite.
            </p>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-8">
          {/* Nos cookies essentiels */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
              Cookies et stockages strictement nécessaires
            </h3>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6 text-sm">
              SmartTour Bénin privilégie une approche respectueuse de la vie privée. Nous n'utilisons **aucun cookie publicitaire** ni aucun tracker de ciblage tiers. Nos stockages (utilisant principalement le `localStorage` de votre navigateur) sont exclusivement fonctionnels et indispensables pour vous fournir nos services :
            </p>

            <div className="space-y-4">
              {/* Theme preference */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-850/50 border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-750 dark:text-emerald-400 font-bold text-xs rounded-lg flex-shrink-0 uppercase">Thème</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">smarttour-theme</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Enregistre votre choix d'affichage entre le mode clair et le mode sombre (dark mode) afin d'assurer un confort visuel constant d'une page à l'autre.
                  </p>
                </div>
              </div>

              {/* Language preference */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-850/50 border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-750 dark:text-emerald-400 font-bold text-xs rounded-lg flex-shrink-0 uppercase">Langue</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">smarttour-lang</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Stocke la langue sélectionnée (par ex., le Français) pour traduire automatiquement l'interface utilisateur lors de vos prochaines visites.
                  </p>
                </div>
              </div>

              {/* Authentication */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-850/50 border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-750 dark:text-emerald-400 font-bold text-xs rounded-lg flex-shrink-0 uppercase">Connexion</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Session Utilisateur</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Gère de façon chiffrée et ultra-sécurisée l'authentification de votre compte. Il vous évite d'avoir à retaper vos identifiants à chaque clic et sécurise l'accès à votre tableau de bord ainsi qu'à la planification de vos itinéraires.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies analytiques */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-4">
              <Settings className="text-emerald-600 dark:text-emerald-400" size={24} />
              Cookies de mesure d'audience
            </h3>
            <p className="text-gray-600 dark:text-slate-350 leading-relaxed text-sm">
              Afin de mesurer les performances de SmartTour Bénin, de détecter d'éventuels bugs et d'améliorer la navigation (par exemple, voir quels sites touristiques sont les plus consultés afin de mieux vous les proposer), nous pouvons être amenés à utiliser des outils analytiques anonymisés respectueux de la vie privée. Ces statistiques ne contiennent aucune information permettant de vous identifier personnellement.
            </p>
          </div>

          {/* Comment supprimer / bloquer */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <Trash2 className="text-emerald-600 dark:text-emerald-400" size={24} />
              Comment gérer ou supprimer ces stockages ?
            </h3>
            <p className="text-gray-600 dark:text-slate-350 leading-relaxed text-sm mb-6">
              Vous avez la liberté de bloquer, restreindre ou supprimer les cookies et les données de stockage local en configurant directement les paramètres de votre navigateur web. Sachez toutefois que si vous désactivez les stockages essentiels, vous ne pourrez plus vous connecter à votre compte ni enregistrer vos itinéraires personnalisés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-600 dark:text-slate-400">
              <div className="p-4 bg-gray-50 dark:bg-slate-850 rounded-2xl">
                <p className="font-bold text-gray-900 dark:text-white mb-2">Google Chrome</p>
                <p>Menu &gt; Paramètres &gt; Confidentialité et sécurité &gt; Effacer les données de navigation ou Cookies et autres données de site.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-850 rounded-2xl">
                <p className="font-bold text-gray-900 dark:text-white mb-2">Mozilla Firefox</p>
                <p>Menu &gt; Paramètres &gt; Vie privée et sécurité &gt; Section "Cookies et données de sites" &gt; Effacer les données.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-850 rounded-2xl">
                <p className="font-bold text-gray-900 dark:text-white mb-2">Apple Safari</p>
                <p>Réglages &gt; Safari &gt; Avancé &gt; Données de sites &gt; Supprimer toutes les données de sites.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

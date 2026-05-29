import { Shield, Lock, Database, Mail, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Confidentialite() {
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
            <Shield className="text-emerald-400" size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-4 tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto">
            Chez SmartTour Bénin, nous protégeons vos données personnelles avec autant de soin que nous planifions vos voyages.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Introduction */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg mb-10">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-4">
            <Lock className="text-emerald-600 dark:text-emerald-400" size={24} />
            Notre engagement de transparence
          </h2>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
            Dernière mise à jour : 20 mai 2026.
          </p>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
            SmartTour Bénin s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la législation béninoise sur la protection des données à caractère personnel (Loi N° 2017-20 portant Code du numérique en République du Bénin).
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          
          {/* 1. Collecte des données */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-bold">1</span>
              Quelles données collectons-nous ?
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
              Nous recueillons uniquement les informations nécessaires au bon fonctionnement de la plateforme et à la personnalisation de vos itinéraires touristiques au Bénin.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800">
                <p className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Données de profil
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Nom, adresse e-mail, mot de passe (haché de manière sécurisée via notre fournisseur d'authentification) pour la création et la gestion de votre compte.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800">
                <p className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Données d'itinéraire
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Destinations favorites, choix des sites, budgets définis et durées de visite renseignées afin de générer vos circuits touristiques sur mesure.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800">
                <p className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Données techniques
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Adresse IP, type de navigateur, choix du thème (clair ou sombre) et préférences linguistiques sauvegardés localement.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100/50 dark:border-slate-800">
                <p className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Géolocalisation (optionnelle)
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Avec votre consentement explicite, votre position GPS actuelle pour calculer les distances et afficher les points d'intérêt ou services proches sur la carte interactive.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Utilisation des données */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-bold">2</span>
              Comment utilisons-nous vos données ?
            </h3>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
              Vos informations sont traitées dans le but exclusif de vous proposer un service de planification optimal et sécurisé. Plus spécifiquement, elles servent à :
            </p>
            <ul className="space-y-3.5 text-gray-600 dark:text-slate-300 pl-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2.5 flex-shrink-0" />
                <span>Générer et optimiser vos itinéraires à travers le Bénin (algorithme de calcul des trajets).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2.5 flex-shrink-0" />
                <span>Permettre la sauvegarde et la synchronisation de vos voyages sur votre tableau de bord.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2.5 flex-shrink-0" />
                <span>Garantir la sécurité de votre compte et prévenir d'éventuels abus ou fraudes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-2.5 flex-shrink-0" />
                <span>Vous envoyer des notifications de support (par ex., confirmation d'envoi du formulaire de contact).</span>
              </li>
            </ul>
          </div>

          {/* 3. Sécurité et Hébergement */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-bold">3</span>
              Sécurité et transmission des données
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                  Nous appliquons des mesures de sécurité techniques et organisationnelles rigoureuses pour protéger vos informations contre tout accès non autorisé, altération ou divulgation. Vos données de profil et d'itinéraires sont stockées sur des serveurs cloud ultra-sécurisés via notre base de données cloud **Convex**.
                </p>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-gray-950 dark:text-white">Aucune revente commerciale :</span> SmartTour Bénin ne vendra, n'échangera, ni ne louera jamais vos données personnelles à des tiers. Les seules transmissions de données s'effectuent vers les prestataires cloud indispensables au bon fonctionnement technique de l'application (hébergement de base de données, infrastructure réseau, authentification).
                </p>
              </div>
              <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-100 dark:border-slate-800/80 flex flex-col items-center text-center">
                <Database className="text-emerald-600 dark:text-emerald-400 mb-3" size={40} />
                <p className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-1">Base de données</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md mb-2">Convex Cloud</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Chiffrement de bout en bout et isolation rigoureuse des sessions utilisateurs.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Droits des utilisateurs */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-bold">4</span>
              Vos droits et contrôle
            </h3>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6">
              Conformément à la réglementation sur la protection des données, vous disposez d'un contrôle total sur vos données à caractère personnel :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 border border-gray-100 dark:border-slate-850 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">Droit d'accès</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Consulter à tout moment l'ensemble des informations vous concernant enregistrées sur votre compte.
                </p>
              </div>
              <div className="p-4 border border-gray-100 dark:border-slate-850 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">Rectification</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Mettre à jour, modifier ou corriger vos informations directement via votre tableau de bord utilisateur.
                </p>
              </div>
              <div className="p-4 border border-gray-100 dark:border-slate-850 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">Suppression</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Demander la suppression définitive de votre compte et de toutes vos données d'itinéraires de nos bases.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-emerald-50 dark:bg-slate-900/60 border border-emerald-100/50 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center">
            <Mail className="mx-auto text-emerald-600 dark:text-emerald-400 mb-4" size={32} />
            <h4 className="text-xl font-bold font-serif text-gray-950 dark:text-white mb-2">Une question sur vos données ?</h4>
            <p className="text-gray-650 dark:text-slate-350 max-w-xl mx-auto text-sm leading-relaxed mb-6">
              Pour exercer vos droits ou pour toute question concernant la confidentialité de vos données chez SmartTour Bénin, vous pouvez nous écrire à l'adresse e-mail dédiée :
            </p>
            <a 
              href="mailto:aladecorina@gmail.com" 
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold rounded-2xl text-base shadow-sm"
            >
              aladecorina@gmail.com
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

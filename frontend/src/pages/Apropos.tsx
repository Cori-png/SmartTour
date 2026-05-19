
import { Users, Target, Heart, Map } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section — vidéo background identique au Hero */}
      <div className="relative text-white py-28 overflow-hidden">
        {/* Vidéo background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/VID-20260506-WA0110.mp4"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Contenu */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">À Propos de SmartTour</h1>
          <p className="text-lg sm:text-2xl text-white/85 max-w-3xl mx-auto">
            Votre compagnon intelligent pour découvrir les richesses du Bénin
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Notre Mission */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">Notre Mission</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Faciliter l'accès au tourisme béninois en proposant des expériences{" "}
            <span className="text-emerald-600 font-medium">authentiques, intelligentes et durables</span>.{" "}
            Nous voulons faire découvrir le vrai Bénin : sa culture riche, ses paysages époustouflants
            et l'hospitalité légendaire de son peuple.
          </p>
        </div>

        {/* Qui sommes-nous ? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
          <div>
            <h3 className="text-3xl font-semibold mb-6">L'histoire de SmartTour</h3>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                Née à Cotonou en 2025, SmartTour est une initiative 100% béninoise qui vise à moderniser
                et à valoriser le tourisme au Bénin grâce à la technologie.
              </p>
              <p>
                Nous avons créé cette plateforme pour résoudre les principales difficultés rencontrées
                par les touristes : manque d'informations fiables, itinéraires mal optimisés, et difficulté
                à découvrir des lieux hors des sentiers battus.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-semibold mb-8">Nos Valeurs</h3>
            <div className="space-y-8">
              {[
                { icon: <Heart className="text-red-500" size={32} />, title: "Authenticité", desc: "Mettre en avant la vraie culture béninoise" },
                { icon: <Target className="text-emerald-600" size={32} />, title: "Innovation", desc: "Utiliser la technologie pour simplifier le voyage" },
                { icon: <Map className="text-blue-600" size={32} />, title: "Durabilité", desc: "Promouvoir un tourisme responsable et respectueux" },
                { icon: <Users className="text-amber-600" size={32} />, title: "Accessibilité", desc: "Rendre le Bénin accessible à tous les voyageurs" },
              ].map((value, i) => (
                <div key={i} className="flex gap-5">
                  <div>{value.icon}</div>
                  <div>
                    <p className="font-semibold text-lg">{value.title}</p>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="text-center bg-emerald-50 rounded-3xl p-12">
          <h3 className="text-3xl font-semibold mb-6">Notre Vision</h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Devenir la plateforme de référence du tourisme en Afrique de l'Ouest,
            en valorisant chaque région du Bénin et en contribuant au développement économique local
            tout en préservant notre patrimoine culturel et naturel.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
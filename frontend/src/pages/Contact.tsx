import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("✅ Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.");
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Contactez SmartTour Bénin</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Nous sommes là pour vous aider à préparer le voyage de vos rêves au Bénin
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-semibold mb-8 text-gray-900">Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                <select
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="info">Demande d'information</option>
                  <option value="reservation">Réservation d'itinéraire</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="support">Support technique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  className="w-full px-5 py-4 border border-gray-300 rounded-3xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg disabled:opacity-70"
              >
                {loading ? "Envoi en cours..." : (
                  <>
                    <Send size={22} /> Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-semibold mb-8">Nos coordonnées</h2>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <MapPin size={28} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Adresse</p>
                    <p className="text-gray-600 mt-1">Cotonou, Littoral • Bénin</p>
                    <p className="text-gray-600">Quartier Ganhi, près du Stade de l'Amitié</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <Phone size={28} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Téléphone</p>
                    <p className="text-gray-600 mt-1">+229 01 23 45 67 89</p>
                    <p className="text-gray-600">+229 97 65 43 21 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <Mail size={28} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Email</p>
                    <p className="text-gray-600 mt-1">contact@smarttour.bj</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <Clock size={28} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Horaires d'ouverture</p>
                    <p className="text-gray-600 mt-1">Lundi - Samedi : 08h00 - 18h00</p>
                    <p className="text-gray-600">Dimanche : Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte placeholder */}
            <div className="bg-white rounded-3xl shadow-xl p-10 h-[380px] flex items-center justify-center border border-dashed border-gray-300">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-emerald-500 mb-4" />
                <p className="text-xl font-medium text-gray-700">Carte Interactive</p>
                <p className="text-gray-500 mt-2">Leaflet sera intégré ici bientôt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
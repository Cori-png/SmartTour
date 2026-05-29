// src/components/PlatformRatingModal.tsx
import { useState } from "react";
import { Star, X, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userNom: string;
};

export type Testimonial = {
  id: string;
  nom: string;
  note: number;
  commentaire: string;
  date: string;
  isUserGenerated?: boolean;
};

export default function PlatformRatingModal({ isOpen, onClose, userNom }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez donner une note sous forme d'étoiles.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Veuillez rédiger un commentaire.");
      return;
    }

    const newReview: Testimonial = {
      id: "rev_" + Date.now(),
      nom: userNom || "Voyageur Anonyme",
      note: rating,
      commentaire: comment.trim(),
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      isUserGenerated: true,
    };

    try {
      const existingReviews: Testimonial[] = JSON.parse(localStorage.getItem("smarttour-reviews") ?? "[]");
      localStorage.setItem("smarttour-reviews", JSON.stringify([newReview, ...existingReviews]));
      setSubmitted(true);
      toast.success("Merci pour votre avis !");
    } catch (err) {
      console.error("Erreur de sauvegarde de l'avis :", err);
      toast.error("Impossible d'enregistrer votre avis localement.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-6 py-5 text-white flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Votre avis compte !</h3>
            <p className="text-[12px] text-white/80 mt-0.5">Notez votre expérience sur SmartTour Bénin</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                <CheckCircle2 className="w-10 h-10 text-green-600 animate-bounce" />
              </div>
              <h4 className="text-[16px] font-bold text-gray-900">Avis enregistré !</h4>
              <p className="text-[13px] text-gray-500 mt-2">
                Merci d'avoir pris le temps de noter la plateforme. Votre témoignage a été ajouté sur la page d'accueil !
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-[13px] font-bold transition-all shadow-md"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star rating selection */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wide">Sélectionnez votre note</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-[13px] font-semibold text-green-700">
                    {rating === 5 ? "Excellent !" : rating === 4 ? "Très bon" : rating === 3 ? "Moyen" : rating === 2 ? "Médiocre" : "Décevant"}
                  </span>
                )}
              </div>

              {/* Comment text area */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Votre commentaire / Témoignage</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec nous (ex: itinéraire optimal, budget estimé, ce que vous avez préféré...)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none placeholder-gray-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Plus tard
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-[13px] font-bold transition-all shadow-md shadow-green-100"
                >
                  <Send className="w-4 h-4" /> Envoyer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

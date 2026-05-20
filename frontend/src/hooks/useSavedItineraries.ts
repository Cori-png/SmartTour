// src/hooks/useSavedItineraries.ts
// Persistance des itinéraires sauvegardés par utilisateur via Convex
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { SavedItinerary } from "../context/ItineraryContext";

export function useSavedItineraries(userId: string | null | undefined) {
  const saved = useQuery(
    api.itineraires.getItinerariesByUser,
    userId ? { userId: userId as any } : "skip"
  );

  const saveItinerary = useMutation(api.itineraires.saveItinerary);
  const deleteItineraryMutation = useMutation(api.itineraires.deleteItinerary);

  async function addItinerary(it: SavedItinerary) {
    if (!userId) return;
    try {
      // Calculer la durée totale (somme des durées de visite)
      const duree = it.sites.reduce((s, x) => s + x.dureeVisite, 0);
      
      await saveItinerary({
        userId: userId as any,
        nom: it.name,
        sites: it.sites.map(s => s._id as any),
        duree,
        budget: it.totalEntree,
        startPosition: it.startPosition ?? undefined,
        totalKm: it.totalKm,
        sejour: it.sejour,
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'itinéraire :", error);
    }
  }

  async function deleteItinerary(id: string) {
    try {
      await deleteItineraryMutation({ id: id as any });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'itinéraire :", error);
    }
  }

  return {
    savedItineraries: saved || [],
    addItinerary,
    deleteItinerary,
  };
}


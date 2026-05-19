// src/hooks/useSavedItineraries.ts
// Persistance des itinéraires sauvegardés par utilisateur via localStorage
import { useState, useEffect } from "react";
import type { SavedItinerary } from "../context/ItineraryContext";

function storageKey(email: string) {
  return `smarttour_itineraries_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
}

function load(email: string): SavedItinerary[] {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? (JSON.parse(raw) as SavedItinerary[]) : [];
  } catch {
    return [];
  }
}

function persist(email: string, data: SavedItinerary[]) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(data));
  } catch {
    /* quota exceeded */
  }
}

export function useSavedItineraries(email: string | null | undefined) {
  const [saved, setSaved] = useState<SavedItinerary[]>(() =>
    email ? load(email) : []
  );

  // Rechargement à chaque changement d'utilisateur (login / logout)
  useEffect(() => {
    setSaved(email ? load(email) : []);
  }, [email]);

  // Persistance automatique à chaque modification
  useEffect(() => {
    if (email) persist(email, saved);
  }, [saved, email]);

  function addItinerary(it: SavedItinerary) {
    setSaved(prev => [it, ...prev]);
  }

  function deleteItinerary(id: string) {
    setSaved(prev => prev.filter(it => it.id !== id));
  }

  return { savedItineraries: saved, addItinerary, deleteItinerary };
}

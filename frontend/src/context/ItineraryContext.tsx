// src/context/ItineraryContext.tsx
// Contexte global pour partager les sites sélectionnés entre Explorer et Planifier
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Site } from "../components/SiteCard";

export type StartPosition = {
  lat:   number;
  lng:   number;
  label: string;
};

type ItineraryContextType = {
  itinerarySites:  Site[];
  sejour:          string;
  startPosition:   StartPosition | null;
  optimizedRoute:  Site[];
  addSites:        (sites: Site[]) => void;
  removeSite:      (id: string)   => void;
  reorderSites:    (sites: Site[]) => void;
  clearItinerary:  () => void;
  setSejour:       (s: string)    => void;
  setStartPosition:(pos: StartPosition | null) => void;
  setOptimizedRoute(sites: Site[]): void;
};

const ItineraryContext = createContext<ItineraryContextType | null>(null);

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [itinerarySites,  setItinerarySites]  = useState<Site[]>([]);
  const [sejour,          setSejour]          = useState<string>("");
  const [startPosition,   setStartPosition]   = useState<StartPosition | null>(null);
  const [optimizedRoute,  setOptimizedRoute]  = useState<Site[]>([]);

  function addSites(newSites: Site[]) {
    setItinerarySites((prev) => {
      const existingIds = new Set(prev.map((s) => s._id));
      const unique = newSites.filter((s) => !existingIds.has(s._id));
      return [...prev, ...unique];
    });
  }

  function removeSite(id: string) {
    setItinerarySites((prev) => prev.filter((s) => s._id !== id));
  }

  function reorderSites(sites: Site[]) {
    setItinerarySites(sites);
  }

  function clearItinerary() {
    setItinerarySites([]);
    setSejour("");
  }

  return (
    <ItineraryContext.Provider value={{
      itinerarySites,
      sejour,
      startPosition,
      optimizedRoute,
      addSites,
      removeSite,
      reorderSites,
      clearItinerary,
      setSejour,
      setStartPosition,
      setOptimizedRoute,
    }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext);
  if (!ctx) throw new Error("useItinerary doit être utilisé dans <ItineraryProvider>");
  return ctx;
}

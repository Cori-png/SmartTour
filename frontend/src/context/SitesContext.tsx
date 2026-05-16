// src/context/SitesContext.tsx — CRUD des sites touristiques
import { createContext, useContext, useState, type ReactNode } from "react";
import { INITIAL_SITES } from "../data/sites";
import type { Site } from "../components/SiteCard";

const KEY = "smarttour-sites";

function load(): Site[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : INITIAL_SITES;
  } catch { return INITIAL_SITES; }
}
function save(sites: Site[]) { localStorage.setItem(KEY, JSON.stringify(sites)); }

type SitesContextType = {
  sites:       Site[];
  addSite:     (s: Omit<Site,"_id"|"score">) => void;
  updateSite:  (s: Site) => void;
  deleteSite:  (id: string) => void;
};

const SitesContext = createContext<SitesContextType | null>(null);

export function SitesProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>(load);

  function addSite(s: Omit<Site,"_id"|"score">) {
    const newSite: Site = { ...s, _id: Date.now().toString(), score: 80 } as Site;
    const next = [...sites, newSite];
    setSites(next); save(next);
  }
  function updateSite(updated: Site) {
    const next = sites.map(s => s._id === updated._id ? updated : s);
    setSites(next); save(next);
  }
  function deleteSite(id: string) {
    const next = sites.filter(s => s._id !== id);
    setSites(next); save(next);
  }

  return (
    <SitesContext.Provider value={{ sites, addSite, updateSite, deleteSite }}>
      {children}
    </SitesContext.Provider>
  );
}

export function useSites() {
  const ctx = useContext(SitesContext);
  if (!ctx) throw new Error("useSites must be inside SitesProvider");
  return ctx;
}

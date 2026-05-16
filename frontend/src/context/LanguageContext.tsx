// src/context/LanguageContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

// ── Dictionnaire de traductions ──────────────────────────────
const dict = {
  fr: {
    nav: {
      home:      "Accueil",
      explorer:  "Explorer",
      planifier: "Planifier",
      about:     "À propos",
      contact:   "Contact",
      login:     "Se connecter",
      register:  "S'inscrire",
      logout:    "Déconnexion",
      dashboard: "Tableau de bord",
      profile:   "Mon profil",
    },
    theme: {
      dark:  "Mode sombre",
      light: "Mode clair",
    },
    explorer: {
      searchPlaceholder: "Rechercher un site, une ville…",
      filters:          "Filtres",
      results:          "résultat(s) trouvé(s)",
      addItinerary:     "Ajouter à l'itinéraire",
      loadMore:         "Charger plus",
      noResults:        "Aucun site trouvé",
      noResultsSub:     "Essayez de modifier vos filtres.",
    },
    planifier: {
      title:       "Planifier mon voyage",
      sites:       "Sites sélectionnés",
      params:      "Paramètres du voyage",
      sejour:      "Durée de séjour",
      transport:   "Mode de transport",
      hebergement: "Hébergement",
      restauration: "Restauration / jour",
      budget:      "Budget estimé",
      launch:      "Lancer l'itinéraire",
      addMore:     "+ Ajouter d'autres sites",
      clear:       "Tout effacer",
    },
    auth: {
      loginRequired: "Connexion requise",
      loginDesc:     "Connectez-vous pour créer et sauvegarder vos itinéraires.",
      email:         "Adresse e-mail",
      password:      "Mot de passe",
      login:         "Se connecter",
      register:      "Créer un compte",
      continueGuest: "Continuer sans compte",
      loggingIn:     "Connexion…",
      error:         "Email ou mot de passe incorrect.",
      or:            "ou",
    },
    dashboard: {
      welcome:      "Bienvenue",
      myItineraries:"Mes itinéraires",
      favorites:    "Favoris",
      stats:        "Statistiques",
      sitesVisited: "Sites visités",
      kmTraveled:   "Km parcourus",
      totalBudget:  "Budget total",
      daysTravel:   "Jours de voyage",
      noItinerary:  "Aucun itinéraire sauvegardé.",
      createFirst:  "Créez votre premier itinéraire →",
      editProfile:  "Modifier le profil",
      // Admin
      totalSites:   "Sites enregistrés",
      totalUsers:   "Utilisateurs",
      generated:    "Itinéraires générés",
      reviews:      "Avis reçus",
      manageSites:  "Gérer les sites",
      manageUsers:  "Gérer les utilisateurs",
    },
    common: {
      back:   "Retour",
      save:   "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit:   "Modifier",
      view:   "Voir",
      free:   "Gratuit",
      print:  "Imprimer",
      close:  "Fermer",
    },
  },
  en: {
    nav: {
      home:      "Home",
      explorer:  "Explore",
      planifier: "Plan",
      about:     "About",
      contact:   "Contact",
      login:     "Sign in",
      register:  "Sign up",
      logout:    "Sign out",
      dashboard: "Dashboard",
      profile:   "My profile",
    },
    theme: {
      dark:  "Dark mode",
      light: "Light mode",
    },
    explorer: {
      searchPlaceholder: "Search a site, a city…",
      filters:          "Filters",
      results:          "result(s) found",
      addItinerary:     "Add to itinerary",
      loadMore:         "Load more",
      noResults:        "No sites found",
      noResultsSub:     "Try adjusting your filters.",
    },
    planifier: {
      title:       "Plan my trip",
      sites:       "Selected sites",
      params:      "Travel parameters",
      sejour:      "Stay duration",
      transport:   "Transport mode",
      hebergement: "Accommodation",
      restauration: "Food / day",
      budget:      "Estimated budget",
      launch:      "Launch itinerary",
      addMore:     "+ Add more sites",
      clear:       "Clear all",
    },
    auth: {
      loginRequired: "Sign in required",
      loginDesc:     "Sign in to create and save your itineraries.",
      email:         "Email address",
      password:      "Password",
      login:         "Sign in",
      register:      "Create account",
      continueGuest: "Continue as guest",
      loggingIn:     "Signing in…",
      error:         "Incorrect email or password.",
      or:            "or",
    },
    dashboard: {
      welcome:      "Welcome",
      myItineraries:"My itineraries",
      favorites:    "Favorites",
      stats:        "Statistics",
      sitesVisited: "Sites visited",
      kmTraveled:   "Km traveled",
      totalBudget:  "Total budget",
      daysTravel:   "Travel days",
      noItinerary:  "No saved itineraries.",
      createFirst:  "Create your first itinerary →",
      editProfile:  "Edit profile",
      totalSites:   "Registered sites",
      totalUsers:   "Users",
      generated:    "Generated itineraries",
      reviews:      "Reviews received",
      manageSites:  "Manage sites",
      manageUsers:  "Manage users",
    },
    common: {
      back:   "Back",
      save:   "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit:   "Edit",
      view:   "View",
      free:   "Free",
      print:  "Print",
      close:  "Close",
    },
  },
} as const;

type DeepValue<T> = T extends string
  ? T
  : T extends Record<string, unknown>
  ? DeepValue<T[keyof T]>
  : never;

// ── Accès par clé pointée "nav.home" ────────────────────────
function resolve(obj: unknown, path: string): string {
  return path
    .split(".")
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj) as string ?? path;
}

type LanguageContextType = {
  lang:       Lang;
  setLang:    (l: Lang) => void;
  toggleLang: () => void;
  t:          (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("smarttour-lang") as Lang) ?? "fr";
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("smarttour-lang", l);
  }

  function toggleLang() {
    const next: Lang = lang === "fr" ? "en" : "fr";
    setLang(next);
  }

  function t(key: string): string {
    return resolve(dict[lang], key);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

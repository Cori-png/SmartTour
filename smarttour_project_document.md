# 🗺️ DOCUMENTATION TECHNIQUE DU PROJET : SMARTTOUR BÉNIN

Bienvenue dans la documentation officielle de **SmartTour Bénin**, l'application web de planification d'itinéraires et d'exploration touristique intelligente en République du Bénin. Ce document présente de manière exhaustive l'analyse fonctionnelle, l'architecture technique, les réalisations majeures et le guide de déploiement de la plateforme.

---

## 🌟 1. Vision et Objectifs du Projet

**SmartTour Bénin** vise à moderniser l'expérience touristique au Bénin en offrant aux voyageurs locaux et internationaux un outil d'aide à la décision intelligent et interactif.
* **Optimisation des trajets** : Calculer l'ordre optimal de visite des sites touristiques béninois pour réduire le temps de transport.
* **Planification sur-mesure** : Permettre la création d'itinéraires basés sur des points de départ personnalisés, des séjours définis, des durées et budgets précis.
* **Tableau de bord personnalisé** : Conserver de manière persistante les sélections et les carnets de voyage du voyageur, indépendamment de ses connexions.
* **Information en temps réel** : Présenter la météo à 7 jours par étape et les conditions de circulation pour anticiper les imprévus.

---

## 🚀 2. Fonctionnalités Clés Implémentées

### 🔍 A. Recherche et Filtrage Intelligent (`SearchBar` & `FilterPanel`)
* Système de recherche dynamique avec sélection de la catégorie du site (Histoire, Nature, Plage, Religion, Culture).
* Filtrage avancé par ville (Cotonou, Ouidah, Abomey, Grand-Popo, Natitingou, etc.) et par budget maximum.

### 🗺️ B. Calcul de Route et Carte Interactive (`ItineraryMapView`)
* Utilisation du moteur **Leaflet** pour cartographier les coordonnées des sites géographiques béninois.
* Rendu persistant : Remplacement du rendu conditionnel par un masquage CSS (`display: block/none`), évitant la destruction de l'instance de la carte.
* **Tracé optimisé** : Liaison des sites sélectionnés dans l'ordre chronologique optimal de visite grâce à un tracé d'itinéraire dynamique en pointillés épais verts.
* **Marquage intelligent** : Puces numérotées colorées (Vert pour le point de départ, Bleu pour les étapes intermédiaires, Rouge pour l'étape finale) pour une lisibilité instantanée.

### ☀️ C. Widgets Météo et Trafic en Temps Réel (`WeatherWidget`)
* **Météo** : Récupération des prévisions de température, d'humidité et d'ensoleillement par site géographique sur 7 jours.
* **Trafic** : Diagnostic des conditions de circulation au Bénin en fonction de l'heure courante (Fluide, Modéré, Élevé) avec conseils personnalisés (bouchons à Cotonou, influence de la pluie, trajets alternatifs).

### 💼 D. Tableau de Bord Client (`ClientDashboard` & `SavedItineraryDetail`)
* **Persistance Totale Hors-Ligne** : Intégration du hook personnalisé `useSavedItineraries` basé sur le `localStorage` cloisonné par adresse e-mail. Les itinéraires survivent aux rafraîchissements et aux déconnexions.
* **Accordion interactif** : Visualisation synthétique et déploiement de la liste détaillée des étapes.
* **Modal détaillée Eye (`Eye` icon)** : Clic sur l'œil ouvre un tableau de bord miroir de l'itinéraire contenant la carte tracée, la météo dynamique par étape et l'onglet trafic.

### 📄 E. Export PDF et Partage E-mail Premium
* **Génération PDF Client (`jsPDF`)** : Module de dessin vectoriel exportant l'itinéraire sous format PDF professionnel (Bandeau de marque, statistiques en boîtes colorées, puces numérotées, grilles de tarifs et durées propres).
* **Formatage des données strict** : 
  * Durées formatées en langage naturel (ex: `2h30` au lieu de `2.5h`).
  * Tarifs utilisant un espace standard (ex: `1 000 FCFA` au lieu de `1/000 FCFA` lié aux problèmes d'encodage des espaces insécables dans les PDF).
* **Partage Mail intelligent** : Télécharge automatiquement le fichier PDF de l'itinéraire sur l'appareil et pré-remplit un courrier électronique de messagerie avec un récapitulatif textuel propre, demandant au destinataire de joindre le PDF généré.

---

## 🛠️ 3. Architecture Technique

Le projet repose sur des technologies modernes, modulaires et robustes assurant d'excellentes performances (Vite).

```
💻 FRONTEND (Vite + React + TS)
 ├── Contextes Globaux (Authentification, Itinéraire en cours)
 ├── Composants Visuels (Navbar, Cartes, Modals, Widgets)
 ├── Cartographie (Leaflet / OpenStreetMap)
 ├── Moteur PDF (jsPDF)
 └── Persistance (LocalStorage cloisonné par utilisateur)
```

### 📦 Dépendances Clés (`package.json`)
* **React 19 & TypeScript** : Typage statique robuste de bout en bout (0 erreur TSC).
* **Leaflet & React Leaflet** : Rendu des fonds de carte OpenStreetMap et des overlays géographiques.
* **jsPDF** : Génération de documents PDF vectoriels à la volée.
* **Lucide React** : Catalogue complet d'icônes vectorielles modernes et harmonieuses.
* **TailwindCSS 4** : Conception responsive fluide, moderne et épurée.

---

## 📂 4. Structure Globale du Code Source

```
SmartTour/
 ├── frontend/
 │    ├── src/
 │    │    ├── components/
 │    │    │    ├── Navbar.tsx             # Barre de navigation globale et responsive
 │    │    │    ├── Footer.tsx             # Pied de page épuré
 │    │    │    ├── ItineraryMapView.tsx   # Composant Leaflet d'itinéraire tracé numéroté
 │    │    │    ├── WeatherWidget.tsx      # Prévisions météo par étape
 │    │    │    ├── SavedItineraryDetail.tsx # Modal d'itinéraire complet (Carte, météo, trafic)
 │    │    │    └── SearchBar.tsx          # Barre de recherche avancée responsive
 │    │    ├── context/
 │    │    │    ├── AuthContext.tsx        # Contexte d'authentification utilisateur
 │    │    │    └── ItineraryContext.tsx   # Contexte des états de planification d'itinéraires
 │    │    ├── hooks/
 │    │    │    └── useSavedItineraries.ts # Hook de persistance localStorage par utilisateur
 │    │    ├── pages/
 │    │    │    ├── HomePage.tsx           # Page d'accueil épurée (sans liens mobiles superflus)
 │    │    │    ├── PlanifierPage.tsx      # Espace de planification et de sélection des sites
 │    │    │    ├── ItineraryResultPage.tsx# Résultat de la planification optimisée avec carte + météo
 │    │    │    └── ClientDashboard.tsx    # Espace utilisateur, accordions, partage, PDF et suppression
 │    │    ├── data/
 │    │    │    └── sites.ts               # Base de données locale des sites du Bénin
 │    │    ├── index.css                   # Styles globaux et tokens CSS
 │    │    └── main.tsx                    # Point d'entrée de l'application
 └── convex/                               # Dossier prêt pour la synchronisation base de données cloud
```

---

## 💻 5. Lancer et Valider le Projet Localement

### Lancement du serveur de développement :
```bash
cd frontend
npm install
npm run dev
```
L'application se lance sur `http://localhost:5173`.

### Validation TypeScript (0 erreur garantie) :
```bash
npx tsc --noEmit
```

### Build de production :
```bash
npm run build
```

---

## 🔮 6. Perspectives et Recommandations futures

Pour faire évoluer SmartTour Bénin, voici les préconisations d'intégration :
1. **Convex Cloud DB** : Lier le hook `useSavedItineraries` aux mutations/requêtes Convex pour sauvegarder les itinéraires en base de données temps réel au lieu du localStorage.
2. **Dynamic Route Sharing** : Créer un endpoint dynamique de partage du type `smarttour.bj/itineraire/:id` pour permettre aux utilisateurs de consulter la carte en direct sans être connectés.
3. **Météo Live API** : Remplacer le widget météo de simulation par une clé d'API OpenWeatherMap ou Météo Bénin pour obtenir les prévisions temps réel.

---
*Ce document a été généré avec soin pour servir de support complet à vos travaux.*

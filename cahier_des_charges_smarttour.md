# 🎓 CAHIER DES CHARGES & DOCUMENT DE PROJET
## PROJET : SMARTTOUR BÉNIN
### *Cadre : Mémoire de Fin de Cycle (Licence Professionnelle / Master en Ingénierie Logicielle & Systèmes d'Information)*

---

## 📄 PREAMBULE & PRESENTATION GENERAL DU PROJET

### 1. Contexte du Projet
La République du Bénin regorge d'une richesse culturelle, historique et naturelle exceptionnelle (les Palais Royaux d'Abomey, la cité lacustre de Ganvié, le Parc National de la Pendjari, la cité historique de Ouidah, etc.). Le gouvernement béninois a placé le tourisme comme un pilier majeur de développement économique et de rayonnement international. 

Cependant, les voyageurs et touristes (qu'ils soient nationaux ou internationaux) font face à un défi majeur : **la planification et l'optimisation de leur séjour**. L'absence d'outils numériques intégrés regroupant cartographie, prévisions météorologiques locales par étape, conditions de circulation et ordonnancement intelligent des visites rend l'organisation logistique fastidieuse.

### 2. Problématique
Comment concevoir et développer une application web moderne et intelligente capable d'aider un utilisateur à structurer son parcours touristique au Bénin, en optimisant ses trajets (distance et temps), tout en lui fournissant des informations contextuelles temps réel (météo et trafic) et une persistance robuste de ses données ?

---

## 🎯 I. ANALYSE DU BESOIN (BÊTE À CORNES)

* **À qui le produit rend-il service ?** Aux touristes, voyageurs locaux/internationaux et guides touristiques.
* **Sur quoi agit-il ?** Sur la planification du voyage, la sélection des attractions touristiques, le calcul du budget et la logistique.
* **Dans quel but ?** Optimiser l'itinéraire de visite, centraliser les informations pratiques (météo, trafic, budget) et sauvegarder ses plans de voyage.

---

## 📋 II. SPECIFICATIONS FONCTIONNELLES (Besoins Fonctionnels)

L'application **SmartTour Bénin** s'articule autour de 6 modules fonctionnels majeurs :

### 1. Gestion des Utilisateurs (Authentification et Profils)
* **Inscription / Connexion** : Création de compte sécurisée pour les clients (Nom, E-mail, Mot de passe).
* **Espace personnel cloisonné** : Chaque compte utilisateur accède à son propre espace sans interférence.
* **Déconnexion sécurisée** : Fermeture de session avec redirection vers la page d'accueil.

### 2. Exploration et Recherche de Sites
* **Recherche textuelle multi-critères** : Recherche par nom du site, mot-clé, ou description.
* **Filtrage thématique** : Sélection par catégorie (Histoire, Culture, Nature, Plage, Religion).
* **Filtrage logistique** : Filtrage par ville (Cotonou, Ouidah, Abomey, Grand-Popo, Natitingou, Parakou, etc.) et par enveloppe budgétaire (tarif d'entrée).

### 3. Planification et Optimisation d'Itinéraire
* **Sélection à la carte** : L'utilisateur coche et ajoute les sites béninois à son panier d'itinéraire.
* **Définition du point de départ** : Possibilité de spécifier une adresse ou un hôtel de départ pour le calcul initial.
* **Moteur d'ordonnancement intelligent** : Algorithme résolvant le problème du voyageur de commerce (TSP - Travelling Salesperson Problem) pour classer les étapes dans l'ordre de distance le plus court.

### 4. Cartographie et Visualisation interactive
* **Affichage géographique** : Intégration d'un fond de carte interactif (OpenStreetMap via Leaflet).
* **Tracé de la route optimisée** : Liaison visuelle continue des étapes dans l'ordre chronologique.
* **Repères visuels colorés (Markers)** :
  * 🟢 **Vert** : Point de départ de l'itinéraire.
  * 🔵 **Bleu** : Étapes touristiques intermédiaires (avec numéro d'ordre de visite).
  * 🔴 **Rouge** : Étape finale du parcours.

### 5. Diagnostics Logistiques : Météo & Trafic temps réel
* **Widget Météo dynamique** : Température moyenne, humidité, climat et icône descriptive sur 7 jours pour chaque site de l'itinéraire.
* **Widget Conditions de Circulation** : Analyse dynamique du trafic béninois (Cotonou et grands axes) en fonction de l'heure système, avertissant des ralentissements saisonniers (saison des pluies) ou heures de pointe.

### 6. Espace d'Archivage (Client Dashboard)
* **Sauvegarde persistante** : Enregistrement de l'itinéraire généré dans le profil de l'utilisateur. Les données sont sauvegardées de façon persistante (résistance à la fermeture du navigateur ou déconnexion).
* **Consultation détaillée instantanée (Modal Eye)** : Visualisation complète de l'itinéraire enregistré (carte, étapes dans l'ordre, météo, trafic) sans recharger la page.
* **Export PDF officiel** : Génération instantanée d'un document PDF esthétique et imprimable reprenant les statistiques clés, le tableau des prix et durées d'étapes.
* **Partage Mail interactif** : Envoi de l'itinéraire par courriel avec téléchargement automatique du fichier PDF.

---

## 🛠️ III. SPECIFICATIONS TECHNIQUES & ARCHITECTURE

### 1. Architecture Logicielle (Architecture 3-Tiers client-side)
Le système adopte une architecture moderne de type **Single Page Application (SPA)** hautement modulaire :

```
┌─────────────────────────────────────────────────────────┐
│                    PRÉSENTATION (UI)                    │
│      React 19 + TypeScript + TailwindCSS 4 + Lucide     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    CONTRÔLE & LOGIQUE                   │
│   React Context API (ItineraryContext, AuthContext)     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                  ACCÈS AUX DONNÉES / API                │
│ Custom Hooks (useSavedItineraries) + Convex Database ready │
└─────────────────────────────────────────────────────────┘
```

### 2. Justification des choix technologiques
* **React 19** : Permet de concevoir des interfaces réactives et synchrones (changement d'onglets instantané, affichage dynamique de la carte Leaflet).
* **TypeScript** : Typage statique garantissant la qualité industrielle du code et la réduction drastique des bugs en production.
* **TailwindCSS 4** : Framework CSS moderne optimisé pour la vitesse de chargement et le responsive design (adaptabilité smartphones, tablettes, PC).
* **Leaflet & OpenStreetMap** : Alternative gratuite, open source et performante à Google Maps, idéale pour cartographier le Bénin sans surcoût financier d'API.
* **jsPDF** : Permet de générer des fichiers PDF directement côté client, soulageant le serveur et offrant un téléchargement instantané hors-ligne.
* **LocalStorage cloisonné** : Utilise le stockage local du navigateur structuré par adresse e-mail (`smarttour_itineraries_[email]`) pour garantir une persistance robuste sans serveur d'authentification tiers lourd.

---

## 📐 IV. MODELISATION CONCEPTUELLE (UML & DONNÉES)

### 1. Diagramme de Cas d'Utilisation (Use Cases)
* **Acteur : Visiteur Anonyme**
  * Consulter la page d'accueil
  * Rechercher et filtrer des sites touristiques
  * Simuler un itinéraire sans sauvegarde
* **Acteur : Client Authentifié**
  * S'inscrire et se connecter / déconnecter
  * Enregistrer son itinéraire généré
  * Accéder à son Dashboard (Mes itinéraires sauvegardés)
  * Visualiser les détails complets (Carte interactive, météo, trafic)
  * Exporter son itinéraire au format PDF officiel
  * Partager son parcours par e-mail
* **Acteur : Administrateur**
  * Gérer le catalogue des sites touristiques (CRUD)
  * Visualiser les métriques d'utilisateurs inscrits

### 2. Modèle Conceptuel de Données (MCD / Entités)

```
[ UTILISATEUR ] 1 ------- * [ ITINÉRAIRE ]
- email (Clé)               - id (Clé)
- nom                       - name
- motDePasse                - savedAt
                            - totalKm
                            - totalEntree
                            - startPosition (label, lat, lng)
                                     |
                                     | 1
                                     |
                                     *
                                [ ÉTAPE ]
                                     *
                                     |
                                     | 1
                                [ SITE TOURISTIQUE ]
                                - _id (Clé)
                                - nom
                                - ville
                                - categorie
                                - description
                                - latitude
                                - longitude
                                - prix
                                - dureeVisite
                                - noteMoyenne
```

---

## 📈 V. PLANIFICATION & METHODOLOGIE DE GESTION DE PROJET

Le projet a été mené selon la **méthodologie Agile SCRUM**, découpé en 5 sprints de développement de 1 à 2 semaines :

* **Sprint 1 : Phase de cadrage et UI/UX (Conception)**
  * Rédaction du cahier des charges, modélisation UML, conception graphique premium (Glassmorphism, tons vert nature #15803d, responsive grid).
* **Sprint 2 : Moteur Cartographique et Recherche**
  * Intégration de Leaflet, placement des marqueurs géographiques du Bénin, développement de la recherche dynamique multi-critères.
* **Sprint 3 : Algorithme d'Optimisation et Logistique**
  * Implémentation du moteur de calcul d'itinéraire optimisé, développement des widgets météo 7 jours et circulation dynamique.
* **Sprint 4 : Espace Client Persistant et Exports**
  * Développement du hook `useSavedItineraries`, création de l'espace utilisateur (Dashboard), intégration de la modal détaillée interactive.
  * Implémentation du module de génération PDF avec `jsPDF` et du partage e-mail structuré.
* **Sprint 5 : Recette, Tests et Livraison**
  * Tests d'intégration, vérification de la compatibilité mobile, validation de la compilation TypeScript (`tsc --noEmit` à 0 erreur), rédaction du présent cahier des charges.

---

## 🏅 VI. VALEUR AJOUTEE & RETOMBEES DU PROJET

L'application **SmartTour Bénin** apporte une réponse technologique innovante aux enjeux du secteur touristique au Bénin :
1. **Valorisation du Patrimoine** : Promotion active et structurée des sites béninois auprès des touristes.
2. **Optimisation Économique** : Permet aux voyageurs de budgétiser précisément leurs entrées et d'estimer leur consommation de carburant (distance en kilomètres).
3. **Autonomie Numérique** : Outil fonctionnant de manière autonome côté client, rapide à charger et ne nécessitant pas de ressources serveurs coûteuses.

---
*Ce document de projet constitue un socle académique formel et structuré, rédigé en bonne et due forme pour l'intégration directe dans votre mémoire de fin d'études.*

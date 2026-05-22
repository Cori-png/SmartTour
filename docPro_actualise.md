# 🎓 CAHIER DES CHARGES & DOCUMENT DE PROJET
## PROJET : SMARTTOUR BÉNIN — VERSION ACTUALISÉE
### *Cadre : Mémoire de Fin de Cycle (Licence Professionnelle / Master en Ingénierie Logicielle & Systèmes d'Information)*

---

## 📄 PREAMBULE & PRESENTATION GENERALE DU PROJET

### 1. Contexte du Projet
La République du Bénin regorge d'une richesse culturelle, historique et naturelle exceptionnelle (les Palais Royaux d'Abomey classés UNESCO, la cité lacustre de Ganvié, le Parc National de la Pendjari, la cité historique de Ouidah, la Route de l'Esclave, etc.). Le gouvernement béninois a placé le tourisme comme un pilier majeur de développement économique et de rayonnement international.

Cependant, les voyageurs et touristes (qu'ils soient nationaux ou internationaux) font face à plusieurs défis majeurs :
- **La planification optimale de leurs déplacements** : Les touristes perdent un temps précieux dans des trajets géographiquement mal agencés, faute d'un outil d'ordonnancement intelligent.
- **L'absence d'intégration des services d'urgence civile** : En cas de besoin médical ou de problème de sécurité, le voyageur doit recourir à des outils non contextualisés et non adaptés au territoire béninois.
- **Le manque de données contextuelles en temps réel** : La météo locale par étape et les conditions de trafic réelles ne sont pas prises en compte lors de la préparation des circuits.

### 2. Problématique
Comment concevoir et développer une application web moderne, intelligente et sécurisée, capable d'aider un utilisateur à structurer son parcours touristique au Bénin — en optimisant ses trajets (distance et temps), en lui fournissant des informations contextuelles dynamiques (météo et trafic), en géolocalisant les services d'urgence civile à proximité de chaque étape, et en garantissant une persistance robuste et sécurisée de ses données de voyage ?

---

## 🎯 I. ANALYSE DU BESOIN (BÊTE À CORNES)

* **À qui le produit rend-il service ?** Aux touristes, voyageurs locaux et internationaux, guides touristiques professionnels et établissements hôteliers partenaires.
* **Sur quoi agit-il ?** Sur la planification du voyage, la sélection des attractions, le calcul du budget, la logistique de sécurité et la sauvegarde des carnets de voyage.
* **Dans quel but ?** Optimiser l'itinéraire de visite, centraliser les informations pratiques (météo, trafic, urgences, budget) et offrir une persistance multi-appareils des plans de voyage grâce à un backend serverless temps réel.

---

## 📋 II. SPECIFICATIONS FONCTIONNELLES (Besoins Fonctionnels)

L'application **SmartTour Bénin** s'articule autour de **7 modules fonctionnels majeurs** :

### 1. Gestion des Utilisateurs (Authentification & Profils Sécurisés)
* **Inscription / Connexion sécurisée** : Création de compte (Nom, E-mail, Mot de passe) avec validation des champs (minimum 6 caractères exigé).
* **Chiffrement cryptographique industriel (SHA-256 + sel 16 octets)** : À l'inscription, le serveur Convex génère un sel aléatoire unique de 16 octets, hache le couple `{sel + mot de passe}` en SHA-256 via l'API WebCrypto et stocke uniquement le résultat sous la forme `sel$hachage`. Le mot de passe original n'est jamais persisté ni transmis.
* **Espace personnel cloisonné** : Chaque compte utilisateur accède à son propre espace de données sans interférence avec un autre compte.
* **Déconnexion sécurisée** : Fermeture de session propre avec redirection vers la page d'accueil.
* **Page Administrateur** : Console réservée à la gestion globale de la plateforme (utilisateurs, métriques globales, modération).

### 2. Exploration et Recherche de Sites Touristiques
* **Catalogue enrichi** : Chaque fiche de site touristique comprend une description détaillée, une galerie d'images, les horaires d'ouverture, le prix d'entrée (en FCFA ou mention "Gratuit"), la durée estimée de visite, la note moyenne des avis voyageurs et les coordonnées GPS précises.
* **Recherche textuelle dynamique** : Recherche instantanée par nom du site ou mot-clé dans la description.
* **Filtrage thématique** : Sélection par catégorie (Histoire, Culture, Nature, Plage, Religion).
* **Filtrage logistique** : Tri et filtrage par ville (Cotonou, Ouidah, Abomey, Grand-Popo, Natitingou, Parakou, Tanguiéta, etc.) et par enveloppe budgétaire maximum.

### 3. Planification et Optimisation d'Itinéraire (TSP & Haversine)
* **Filtres de voyage sur-mesure** : L'utilisateur définit sa ville pivot, la durée de séjour (en jours), son budget d'entrée maximum (FCFA) et ses catégories de préférence.
* **Définition du point de départ personnalisé** : Possibilité de spécifier une adresse, un hôtel ou une position GPS de départ. En l'absence de saisie, l'algorithme utilise le premier site recommandé comme point de départ par défaut.
* **Résolution du Problème du Voyageur de Commerce (TSP)** : Algorithme du Proche Voisin (Nearest Neighbor) calculant l'ordre optimal de visite pour minimiser la distance totale de trajet.
* **Calcul géodésique de précision (Formule de Haversine)** : Les distances inter-étapes sont calculées sur la sphère terrestre (avec prise en compte de la courbure), garantissant une précision kilométrique réelle.
* **Estimations combinées** : Distance totale du parcours (km), durée de transport estimée (à vitesse prudente de 40 km/h), cumul des durées de visite individuelles et coût total des entrées.

### 4. Cartographie et Visualisation Interactive (Leaflet & OpenStreetMap)
* **Fond de carte libre (OpenStreetMap via Leaflet)** : Affichage géographique réactif et gratuit, adapté aux coordonnées des monuments béninois.
* **Tracé dynamique de la route optimisée** : Polyligne continue vert émeraude reliant toutes les étapes dans l'ordre chronologique de visite calculé par l'algorithme.
* **Repères visuels colorés et numérotés (Markers)** :
  * 🟢 **Vert** : Point de départ de l'itinéraire.
  * 🔵 **Bleu** : Étapes touristiques intermédiaires, numérotées dans l'ordre de passage.
  * 🔴 **Rouge** : Étape finale du parcours.
* **Rendu persistant anti-démontage** : La carte est intégrée avec un masquage CSS (`display: block/none`) plutôt qu'un démontage conditionnel React, préservant l'état du zoom et du centrage lors des navigations entre onglets.

### 5. Services de Sécurité et d'Escale à Proximité (Scanner Géographique)
Pour chaque étape du voyage, la plateforme intègre un scanner géographique (`useNearbyServices`) qui recherche et liste automatiquement tous les services enregistrés dans un rayon de moins de 15 km autour du monument visité :
* 🚑 **Urgences et Santé (Priorité Absolue)** : Hôpitaux régionaux, centres de santé, pharmacies de garde.
* 🚨 **Sécurité Civile** : Commissariats de police, brigades territoriales.
* 🏨 **Logistique et Escale** : Hôtels, restaurants, bars locaux.

Chaque service affiche sa distance exacte calculée en kilomètres (à vol d'oiseau) et son numéro de téléphone direct pour un appel d'urgence immédiat.

### 6. Diagnostics Logistiques : Météo & Trafic Dynamiques
* **Widget Météo Contextuel (7 jours par étape)** : Prévisions de température, humidité, couverture nuageuse et conditions climatiques adaptées à la localisation géographique précise de chaque site de l'itinéraire. Alerte automatique en cas de météo défavorable pour les activités de plein air (ex : randonnée à la Cascade de Kota par temps de pluie).
* **Conseiller Trafic Intelligent** : Analyse dynamique de l'heure courante du système utilisateur pour diagnostiquer les conditions de circulation sur les axes béninois (Cotonou, Abomey-Calavi, Grand-Popo) : Fluide, Modéré ou Dense. Formule des recommandations personnalisées (ex: éviter la zone de Dantokpa et du Port de Cotonou aux heures de pointe, privilégier les Zémidjans par temps sec).

### 7. Espace Client Premium (Dashboard & Livrables)
* **Sauvegarde persistante multi-appareils (Convex)** : Les itinéraires sont enregistrés en base de données cloud temps réel via Convex. Toute modification se synchronise instantanément sur tous les appareils connectés, sans nécessiter de rechargement de page.
* **Consultation détaillée instantanée (Modal "Œil")** : Visualisation complète d'un itinéraire archivé (carte Leaflet réactivée, liste des étapes, météo et trafic) en modal plein écran sans rechargement.
* **Export PDF Officiel (jsPDF)** : Génération instantanée d'un carnet de voyage vectoriel professionnel comprenant : le logo officiel SmartTour, les boîtes statistiques (km, étapes, budget), la liste ordonnée des monuments avec prix et durées, et la numérotation des pages.
* **Partage Mail Interactif** : Double action simultanée — téléchargement automatique du PDF sur l'appareil et ouverture du client de messagerie (via protocole `mailto:`) avec un email de partage professionnel pré-rédigé (objet, corps, consignes d'attache du PDF).
* **Formulaire de Contact** : Interface d'assistance client permettant l'envoi de requêtes techniques ou commerciales au support SmartTour Bénin.
* **Pages Légales Réglementaires** : Mentions légales, Charte de confidentialité (conformité Loi n°2017-20 du Code du Numérique du Bénin) et Politique de gestion des cookies.

---

## 🛠️ III. SPECIFICATIONS TECHNIQUES & ARCHITECTURE

### 1. Architecture Logicielle (Architecture 3-Tiers Moderne)
Le système adopte une architecture **Single Page Application (SPA)** hautement modulaire et découplée :

```
┌─────────────────────────────────────────────────────────────┐
│                    PRÉSENTATION (UI)                        │
│    React 19 + TypeScript + TailwindCSS 4 + Lucide Icons    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 CONTRÔLE & LOGIQUE MÉTIER                   │
│  React Context API (ItineraryContext, AuthContext)          │
│  Hooks personnalisés (useSavedItineraries, useNearbyServices)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│           BACKEND SERVERLESS & BASE DE DONNÉES              │
│   Convex (NoSQL Réactif, Mutations, Queries, WebSockets)   │
│   WebCrypto API (Hachage SHA-256 + Sel 16 octets)          │
└─────────────────────────────────────────────────────────────┘
```

### 2. Justification des Choix Technologiques

| Technologie | Justification |
|---|---|
| **React 19 + TypeScript** | Interfaces réactives, typage statique rigoureux (0 erreur TSC garantie en production), architecture composants modulaires |
| **TailwindCSS 4** | Système de design premium (couleurs émeraude harmonieuses, dark mode, glassmorphism), responsive mobile-first |
| **Convex Serverless** | Backend NoSQL temps réel sans serveur à gérer, synchronisation instantanée par WebSockets sur tous appareils, fonctions serverless isolées pour la sécurité |
| **WebCrypto API (SHA-256)** | Standard cryptographique industriel W3C, exécution serveur-side pour zéro risque de fuite, sel unique de 16 octets par compte |
| **Leaflet & OpenStreetMap** | Alternative gratuite open source à Google Maps, idéale pour le Bénin, sans redevance API, rendu persistant optimisé |
| **jsPDF** | Génération PDF vectorielle côté client, téléchargement instantané sans sollicitation serveur |
| **Vite 8** | Bundler ultrarapide (HMR < 100ms), build de production optimisé |

---

## 📐 IV. MODELISATION CONCEPTUELLE (UML & DONNÉES)

### 1. Diagramme de Cas d'Utilisation (Use Cases)

* **Acteur : Visiteur Anonyme**
  * Consulter la page d'accueil et découvrir les sites béninois
  * Rechercher et filtrer des sites touristiques par critères
  * Simuler un itinéraire (sans sauvegarde)

* **Acteur : Client Authentifié**
  * S'inscrire et se connecter / déconnecter de manière sécurisée
  * Planifier un itinéraire multicritères (ville, budget, durée, catégories)
  * Générer l'ordre de visite optimal (algorithme TSP + Haversine)
  * Consulter les services d'urgence et d'escale à proximité de chaque étape
  * Enregistrer son itinéraire généré (persistance Convex multi-appareils)
  * Accéder à son Dashboard (historique de mes itinéraires sauvegardés)
  * Visualiser les détails complets (Carte Leaflet, météo 7j, trafic)
  * Exporter son itinéraire au format PDF officiel avec logo
  * Partager son parcours par e-mail (email pré-rédigé + PDF joint)
  * Contacter le support SmartTour via formulaire de contact

* **Acteur : Administrateur**
  * Visualiser les métriques globales de la plateforme (utilisateurs inscrits, itinéraires créés, budget moyen)
  * Gérer les comptes utilisateurs (consultation et suppression)

### 2. Modèle Conceptuel de Données (MCD / Schéma Convex)

```
[ UTILISATEUR ]   1 ─────── * [ ITINÉRAIRE ]
- _id (Clé)                   - _id (Clé)
- nom                         - userId (FK → UTILISATEUR)
- email (Unique)              - nom
- motDePasse (sel$hash)       - duree (heures)
- preferences                 - budget (FCFA)
                              - dateCreation (timestamp)
                              - totalKm
                              - startPosition {lat, lng, label}
                              - sejour
                                       │
                              * ───────┘ (étapes = tableau d'IDs)
                              │
                    [ SITE TOURISTIQUE ]
                    - _id (Clé)
                    - nom
                    - description
                    - categorie (histoire/nature/plage/culture/religion)
                    - ville
                    - coordonnees {lat, lng}
                    - prix (FCFA)
                    - horaires
                    - images (tableau d'URLs)
                    - dureeVisite (heures)
                    - noteMoyenne
                    - nombreAvis
                    - tags

[ UTILISATEUR ] * ─── 1 [ AVIS ] * ─── 1 [ SITE TOURISTIQUE ]
                        - note (1 à 5)
                        - commentaire
                        - date (timestamp)

[ SERVICE DE PROXIMITÉ ]
- _id (Clé)
- type (hopital / commissariat / pharmacie / hotel / restaurant / bar)
- nom
- coordonnees {lat, lng}
- siteId (FK optionnel → SITE TOURISTIQUE)
- ville
- telephone
```

---

## 📈 V. PLANIFICATION & METHODOLOGIE DE GESTION DE PROJET

Le projet a été mené selon la **méthodologie Agile SCRUM**, découpé en **6 sprints** de développement :

* **Sprint 1 : Phase de cadrage et UI/UX (Conception)**
  * Rédaction du cahier des charges et des spécifications fonctionnelles.
  * Modélisation UML (Use Cases, MCD/MCT).
  * Conception graphique premium (tons vert nature #15803d, glassmorphism, responsive mobile-first, police Inter/Outfit via Google Fonts).

* **Sprint 2 : Socle Technique & Sécurité (Backend Convex)**
  * Initialisation du projet Vite + React + TypeScript.
  * Intégration du backend Convex (schéma de tables, fonctions serverless).
  * Implémentation du module d'authentification cryptographique côté serveur (SHA-256 + sel aléatoire de 16 octets via WebCrypto API).

* **Sprint 3 : Moteur Cartographique & Recherche**
  * Intégration de la librairie Leaflet avec fond de carte OpenStreetMap.
  * Développement du composant `ItineraryMapView` (marqueurs colorés, tracé de route, rendu persistant CSS).
  * Développement du moteur de recherche et filtrage multi-critères.

* **Sprint 4 : Algorithme d'Optimisation & Widgets Logistiques**
  * Implémentation de l'algorithme Haversine et du solveur TSP (Nearest Neighbor).
  * Développement des widgets météo contextuels (prévisions 7 jours par site).
  * Développement du conseiller trafic intelligent (analyse heure système, trafic béninois).
  * Intégration du hook `useNearbyServices` pour la géolocalisation des urgences à proximité.

* **Sprint 5 : Espace Client Premium & Exports**
  * Développement du tableau de bord client (historique, accordéons, modal de consultation).
  * Implémentation du module de génération PDF vectorielle (jsPDF) avec logo, statistiques et liste des étapes.
  * Développement du module de partage e-mail (protocole `mailto:` + téléchargement PDF automatique).
  * Intégration de la synchronisation des itinéraires via Convex (remplacement du localStorage volatile).

* **Sprint 6 : Conformité Légale, Tests & Livraison**
  * Création et intégration des pages légales (Mentions Légales, Charte de Confidentialité, Politique Cookies).
  * Tests d'intégration complets, vérification de la compatibilité responsive (mobile, tablette, PC).
  * Validation de la compilation TypeScript (`npx tsc --noEmit` = 0 erreur).
  * Construction du bundle de production optimisé (`npm run build`).
  * Rédaction des documents de référence : présent cahier des charges actualisé + protocole de test de production.

---

## 🏅 VI. VALEUR AJOUTEE & RETOMBEES DU PROJET

L'application **SmartTour Bénin** apporte une réponse technologique innovante et à forte valeur ajoutée aux enjeux du secteur touristique béninois :

1. **Valorisation du Patrimoine Culturel et Naturel** : Promotion structurée des sites béninois (UNESCO, naturel, culturel, religieux) auprès des touristes nationaux et internationaux grâce à un catalogue numérique riche et accessible.

2. **Optimisation Économique pour le Voyageur** : Calcul précis du budget d'entrée cumulé (FCFA), estimation des distances (km) et des durées de trajet, permettant une préparation financière rigoureuse sans mauvaise surprise.

3. **Sécurité Civile Renforcée pour les Touristes** : Géolocalisation instantanée des hôpitaux, pharmacies et commissariats les plus proches de chaque étape — une fonctionnalité d'une importance critique, notamment pour les touristes en zones rurales isolées (Atacora, Pendjari).

4. **Conformité Réglementaire** : Respect de la Loi n°2017-20 portant Code du Numérique en République du Bénin — chiffrement des données personnelles, gestion des cookies, droit à l'oubli numérique (suppression des données en cascade).

5. **Architecture Scalable et Moderne** : Le choix d'un backend serverless Convex permet une montée en charge automatique sans infrastructure à gérer, idéal pour absorber des pics de trafic touristique (hautes saisons, événements culturels nationaux comme le Festival International de Ouidah).

---

## 🔮 VII. PERSPECTIVES ET EVOLUTIONS FUTURES

Pour faire évoluer SmartTour Bénin en plateforme nationale de référence, les extensions suivantes sont envisagées :

1. **API Météo Live (OpenWeatherMap)** : Remplacer les prévisions simulées par des données climatiques réelles en temps réel pour chaque site béninois.
2. **Partage d'Itinéraire en Lien Public** : Créer un endpoint dynamique (`smarttour.bj/itineraire/:id`) permettant à un utilisateur de partager son circuit via un lien URL sans que le destinataire ait besoin d'être inscrit.
3. **Application Mobile Native (React Native)** : Extension de la plateforme vers iOS et Android pour une utilisation hors-ligne optimale sur le terrain au Bénin, grâce au cache de données Convex.
4. **Système de Réservation Intégré** : Partenariat avec les hôtels et prestataires de transport béninois pour permettre la réservation directe depuis l'application.
5. **Recommandation par Intelligence Artificielle** : Analyse du comportement des voyageurs pour suggérer des circuits personnalisés basés sur les circuits populaires et les avis vérifiés des autres touristes.

---

## 📌 Informations du Projet

| Champ | Valeur |
|---|---|
| **Nom du projet** | SmartTour Bénin |
| **Type** | Application Web SPA (Single Page Application) |
| **Framework Frontend** | React 19 + TypeScript + Vite 8 |
| **Backend** | Convex Serverless (NoSQL Réactif) |
| **Langage de programmation** | TypeScript / TSX |
| **Système de styles** | TailwindCSS 4 |
| **Cartographie** | Leaflet + OpenStreetMap |
| **Génération PDF** | jsPDF |
| **Sécurité** | WebCrypto SHA-256 + Sel 16 octets |
| **Statut** | ✅ Opérationnel — Prêt pour déploiement |
| **Compilation** | ✅ 0 erreur TypeScript — Build production validé |

---
*Ce document de projet constitue un socle académique formel et structuré, actualisé pour refléter fidèlement l'intégralité des fonctionnalités développées et déployées de la plateforme SmartTour Bénin. Il est rédigé en bonne et due forme pour intégration directe dans votre mémoire de fin d'études.*

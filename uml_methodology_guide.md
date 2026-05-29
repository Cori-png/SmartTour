# Guide Méthodologique de Conception des Diagrammes UML — SmartTour Bénin

Ce guide purement textuel et méthodologique explique étape par étape comment concevoir, structurer et réussir chacun des diagrammes UML requis pour documenter le projet SmartTour Bénin, en utilisant des logiciels de modélisation standards (tels que Draw.io, StarUML, Lucidchart ou PlantUML).

---

## 📌 1. Le Diagramme de Cas d'Utilisation (Use Cases)

### A. Objectif
Présenter la vue fonctionnelle externe du système en montrant "qui" interagit avec l'application et "quelles" actions ils peuvent réaliser, sans détailler le code ou le déroulement technique.

### B. Méthodologie de Création pas à pas
1.  **Définir les limites du système** : Tracez un rectangle représentant la plateforme "SmartTour". Tout ce qui est à l'intérieur est le logiciel ; tout ce qui est à l'extérieur représente les acteurs (humains ou machines).
2.  **Identifier les Acteurs (à placer à l'extérieur du rectangle)** :
    *   **Acteur Principal 1 : Le Touriste (Voyageur)**. C'est l'utilisateur final qui consulte et planifie.
    *   **Acteur Principal 2 : L'Administrateur**. C'est le gestionnaire du contenu et de la modération.
    *   **Acteur Secondaire (optionnel) : Système externe de Localisation (GPS)** ou la base de données.
3.  **Définir les Cas d'Utilisation (à placer sous forme d'ellipses à l'intérieur du rectangle)** :
    *   Chaque bulle doit commencer par un verbe à l'infinitif (ex: *Explorer les sites*, *Planifier un itinéraire*, *Gérer les témoignages*).
4.  **Établir les relations** :
    *   **Associations simples** : Reliez les acteurs aux bulles d'action qu'ils déclenchent par une simple ligne continue.
    *   **Relation d'Inclusion (`<<include>>`)** : Utilisez une flèche pointillée orientée vers une action obligatoire. Pour SmartTour, la bulle *Sauvegarder l'itinéraire* inclut obligatoirement la bulle *Se connecter / S'inscrire*.
    *   **Relation d'Extension (`<<extend>>`)** : Utilisez une flèche pointillée orientée de l'action optionnelle vers l'action de base. Par exemple, *Donner une note de feedback* étend le cas d'utilisation *Sauvegarder l'itinéraire* (car le modal de notation s'affiche après, mais l'utilisateur peut choisir de le passer).

---

## 🏛️ 2. Le Diagramme de Classes

### A. Objectif
Représenter la structure statique du code orienté objet, en montrant les structures de données (classes, interfaces), leurs propriétés, leurs comportements (méthodes) et la manière dont elles sont liées.

### B. Méthodologie de Création pas à pas
1.  **Identifier les Classes clés (représentées par des rectangles divisés en 3 sections)** :
    *   Section 1 : Le Nom de la classe (ex: `User`, `Site`, `SavedItinerary`, `Testimonial`).
    *   Section 2 : Les Attributs (données membres).
    *   Section 3 : Les Opérations (fonctions/méthodes).
2.  **Définir la visibilité (encapsulation)** :
    *   Ajoutez le symbole adéquat devant chaque attribut et méthode :
        *   `+` : Public (accessible depuis l'extérieur, ex: les méthodes de contextes React).
        *   `-` : Private (strictement interne, ex: `passwordHash` ou des clés internes).
3.  **Spécifier les types** :
    *   Indiquez le type de chaque propriété (ex: `email: string`, `prix: number`) et le type de retour des méthodes (ex: `login(): Promise<AuthResult>`).
4.  **Dessiner les relations et multiplicités** :
    *   **Association simple** : Ligne continue reliant deux classes.
    *   **Agrégation (losange vide sur la classe conteneur)** : Montre une relation de type "est composé de", mais où les parties peuvent exister indépendamment. Un `SavedItinerary` agrège des objets `Site` (si l'itinéraire est supprimé, les monuments physiques existent toujours).
    *   **Multiplicité** : Indiquez les cardinalités aux extrémités (ex: un itinéraire contient `1..*` (un à plusieurs) sites ; un site peut appartenir à `0..*` itinéraires).

---

## ⏱️ 3. Le Diagramme de Séquence

### A. Objectif
Modéliser le comportement dynamique de l'application en décrivant l'ordre chronologique des messages échangés entre les différents objets pour accomplir une tâche précise.

### B. Méthodologie de Création pas à pas
1.  **Placer les Lignes de Vie (Lifelines)** :
    *   Représentées par des rectangles en haut, prolongés par une ligne verticale en pointillés.
    *   De gauche à droite, alignez l'acteur (`Touriste`), puis les vues frontales (`Page Planifier`), puis le contrôleur/moteur de calcul (`ItineraryContext / TSP Engine`), et enfin le stockage local (`localStorage`).
2.  **Représenter le temps** :
    *   Le temps s'écoule du haut vers le bas. Les rectangles d'activation (bandes verticales blanches sur la ligne en pointillés) représentent la période durant laquelle un objet est actif.
3.  **Tracer les messages (flèches horizontales)** :
    *   **Message Synchrone (ligne continue, flèche pleine)** : L'émetteur attend une réponse immédiate. Par exemple, le clic sur "Planifier" appelle l'algorithme `tspFromPosition()`.
    *   **Message Asynchrone (ligne continue, flèche ouverte)** : L'émetteur continue son traitement sans attendre.
    *   **Message de Retour (ligne pointillée, flèche ouverte)** : Renvoie le résultat du calcul (ex: retourne la liste triée des sites).
4.  **Détailler le scénario TSP de SmartTour** :
    *   Message 1 : Le touriste clique sur "Lancer l'optimisation".
    *   Message 2 : L'interface appelle le moteur contextuel.
    *   Message 3 : Le moteur exécute les calculs de distance (Haversine) et trie la liste.
    *   Message 4 : Le moteur retourne la liste triée à l'interface.
    *   Message 5 : L'interface redirige vers la page de résultats et affiche le tracé cartographique.

---

## 🔄 4. Le Diagramme d'Activité

### A. Objectif
Représenter graphiquement le déroulement du flux de contrôle ou de données d'un algorithme ou d'un processus métier (semblable à un organigramme).

### B. Méthodologie de Création pas à pas
1.  **Placer les nœuds de départ et d'arrivée** :
    *   Point de départ : Un cercle noir plein.
    *   Point d'arrivée : Un double cercle (cercle noir à l'intérieur d'un cercle vide).
2.  **Dessiner les actions (rectangles aux coins arrondis)** :
    *   Chaque rectangle décrit une étape élémentaire du processus (ex: *Choisir moyen de transport*, *Cumuler les frais d'entrée*, *Télécharger le PDF*).
3.  **Créer des branches de décision (losanges)** :
    *   Le losange possède une entrée et au moins deux sorties conditionnelles écrites entre crochets (les "gardes", ex: `[Oui]` / `[Non]`).
    *   Pour SmartTour : Losange après la sauvegarde de l'itinéraire. Si `[Connecté]` -> on enregistre en base locale ; si `[Non Connecté]` -> on affiche le modal de connexion.
4.  **Définir la synchronisation (Barres de Fork et de Join)** :
    *   Une barre horizontale noire épaisse (Fork) permet de diviser un flux en deux activités parallèles (ex: générer le PDF et lancer le mailto en même temps).
    *   Une seconde barre (Join) réunit les flux parallèles avant de passer à l'étape suivante.

---

## ⚙️ 5. Le Diagramme d'États-Transitions

### A. Objectif
Décrire le cycle de vie d'un objet ou d'un composant de l'application en montrant ses différents états possibles et les événements qui provoquent le changement d'état.

### B. Méthodologie de Création pas à pas
1.  **Déterminer l'élément à modéliser** :
    *   Dans notre cas, modélisons l'état de la session utilisateur (ou l'état de l'itinéraire en cours de création).
2.  **Définir les États (rectangles aux coins arrondis)** :
    *   Chaque état représente une situation stable (ex: `Anonyme`, `Connecté_Touriste`, `Connecté_Admin`).
3.  **Tracer les Transitions (flèches orientées)** :
    *   Reliez les états par des flèches indiquant le sens du changement.
4.  **Ajouter les événements déclencheurs sur les flèches** :
    *   Syntaxe : `Evénement [Condition] / Action`.
    *   Exemple de transition de `Anonyme` vers `Connecté_Touriste` :
        *   Déclencheur : `ValiderConnexion`
        *   Garde (Condition) : `[Rôle == Touriste]`
        *   Action : `ChargerHistoriqueLocal()`
    *   Exemple de transition vers `Anonyme` :
        *   Déclencheur : `ClicDéconnexion`
        *   Action : `ViderSession()`
5.  **Définir l'état initial et final** :
    *   Démarrez avec un cercle noir et terminez par un cercle double (si le cycle s'arrête, par exemple à la fermeture de l'application).

---

## 🛠️ 6. Outils recommandés et Conseils Pratiques

*   **Draw.io (Gratuit & Open Source)** : Le plus simple pour dessiner manuellement. Utilisez les bibliothèques d'icônes standard "UML" pour respecter scrupuleusement la norme graphique (losanges vides pour les agrégations, lignes pleines avec flèches triangulaires pour les héritages).
*   **StarUML (Professionnel)** : Outil de modélisation strict. Il vous empêchera de faire des erreurs de syntaxe (par exemple, connecter des éléments de manière non conforme aux spécifications UML).
*   **PlantUML (Modélisation par texte)** : Permet de générer des diagrammes au format standard UML via de simples lignes de description textuelles descriptives.

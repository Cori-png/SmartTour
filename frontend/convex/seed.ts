// convex/seed.ts
// Exécuter avec : npx convex run seed:run
import { mutation } from "./_generated/server";

const SITES = [
  {
    nom: "Route de l'Esclave - Ouidah",
    description:
      "Chemin historique de 4 km que parcouraient les esclaves avant d'embarquer pour les Amériques. Un lieu de mémoire incontournable avec la Porte du Non-Retour au bout de la route.",
    categorie: "histoire",
    ville: "Ouidah",
    coordonnees: { lat: 6.3536, lng: 2.0887 },
    prix: 1000,
    horaires: "08h00 - 18h00",
    images: [],
    noteMoyenne: 4.8,
    nombreAvis: 312,
    dureeVisite: 2,
    tags: ["patrimoine", "UNESCO", "histoire", "mémoire"],
  },
  {
    nom: "Village lacustre de Ganvié",
    description:
      "Surnommée la 'Venise de l'Afrique', Ganvié est un village entier construit sur le lac Nokoué. Ses habitants vivent sur pilotis depuis le XVIIe siècle. Une expérience unique accessible en pirogue.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.4667, lng: 2.4167 },
    prix: 5000,
    horaires: "07h00 - 17h00",
    images: [

    ],
    noteMoyenne: 4.7,
    nombreAvis: 489,
    dureeVisite: 3,
    tags: ["pirogue", "lac", "village", "unique", "incontournable"],
  },
  {
    nom: "Palais Royal d'Abomey",
    description:
      "Site classé au patrimoine mondial de l'UNESCO, les Palais Royaux d'Abomey retracent l'histoire du puissant Royaume du Dahomey. Sculptures et bas-reliefs racontent les conquêtes des rois.",
    categorie: "histoire",
    ville: "Abomey",
    coordonnees: { lat: 7.1833, lng: 1.9833 },
    prix: 2000,
    horaires: "09h00 - 17h00",
    images: ["/images/PRA.png"],
    noteMoyenne: 4.9,
    nombreAvis: 276,
    dureeVisite: 2.5,
    tags: ["UNESCO", "royauté", "Dahomey", "musée", "patrimoine"],
  },
  {
    nom: "Parc National de la Pendjari",
    description:
      "L'un des derniers grands écosystèmes de savane d'Afrique de l'Ouest. On y trouve lions, éléphants, buffles, hippopotames et guépards. Safari inoubliable dans le nord du Bénin.",
    categorie: "nature",
    ville: "Tanguiéta",
    coordonnees: { lat: 11.1667, lng: 1.5167 },
    prix: 10000,
    horaires: "06h00 - 18h00",
    images: ["/images/Pendjari.png"],
    noteMoyenne: 4.9,
    nombreAvis: 198,
    dureeVisite: 8,
    tags: ["safari", "lions", "nature", "faune", "savane"],
  },
  {
    nom: "Cathédrale de Ouidah",
    description:
      "La plus ancienne cathédrale du Bénin, construite par des missionnaires portugais au XVIIIe siècle. Un chef-d'œuvre d'architecture coloniale au cœur de la ville vaudou.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.3614, lng: 2.0843 },
    prix: 0,
    horaires: "07h00 - 19h00",
    images: ["/images/Cathédrale.png"],
    noteMoyenne: 4.3,
    nombreAvis: 87,
    dureeVisite: 1,
    tags: ["religion", "architecture", "colonial", "gratuit"],
  },
  {
    nom: "Place de l'Amazone - Cotonou",
    description:
      "La grande place centrale de Cotonou, dominée par la célèbre statue de l'Amazone du Dahomey. Symbole de la résistance féminine du Royaume du Danxomè. Point de repère incontournable.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.3654, lng: 2.4183 },
    prix: 0,
    horaires: "Toute la journée",
    images: ["/images/amazone.jpg"],
    noteMoyenne: 4.1,
    nombreAvis: 143,
    dureeVisite: 0.5,
    tags: ["statue", "amazone", "gratuit", "photo"],
  },
  {
    nom: "Plage de Grand-Popo",
    description:
      "Une des plus belles plages du Bénin, à la frontière du Togo. Cocotiers, sable fin et couchers de soleil spectaculaires. Idéale pour se détendre loin du tumulte de Cotonou.",
    categorie: "plage",
    ville: "Grand-Popo",
    coordonnees: { lat: 6.2833, lng: 1.8167 },
    prix: 0,
    horaires: "Toute la journée",
    images: ["/images/plage.png"],
    noteMoyenne: 4.6,
    nombreAvis: 221,
    dureeVisite: 4,
    tags: ["plage", "détente", "coucher de soleil", "nature", "gratuit"],
  },
  {
    nom: "Musée d'Abomey",
    description:
      "Situé dans les anciens palais royaux, ce musée conserve les trésors du Royaume du Dahomey : trônes, statues, tissus royaux et objets rituels. Guide obligatoire pour une visite enrichissante.",
    categorie: "culture",
    ville: "Abomey",
    coordonnees: { lat: 7.185, lng: 1.985 },
    prix: 3000,
    horaires: "09h00 - 17h00",
    images: ["/images/musee.png"],
    noteMoyenne: 4.7,
    nombreAvis: 156,
    dureeVisite: 2,
    tags: ["musée", "art", "royauté", "histoire"],
  },
  {
    nom: "Temple des Pythons - Ouidah",
    description:
      "Temple sacré dédié au culte vaudou du python. Des dizaines de pythons royaux vivent ici en liberté. Une expérience fascinante et unique au monde, au cœur de la spiritualité béninoise.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.3603, lng: 2.0852 },
    prix: 1500,
    horaires: "08h00 - 18h00",
    images: ["/images/Tpy.jpg"],
    noteMoyenne: 4.5,
    nombreAvis: 302,
    dureeVisite: 1,
    tags: ["vaudou", "python", "spiritualité", "unique"],
  },
  {
    nom: "Cascade de Kota",
    description:
      "Magnifique cascade cachée dans les collines de l'Atacora, dans le nord-ouest du Bénin. Un trekking de 2h à travers la forêt mène à ce joyau naturel peu fréquenté par les touristes.",
    categorie: "nature",
    ville: "Natitingou",
    coordonnees: { lat: 10.3167, lng: 1.3833 },
    prix: 500,
    horaires: "07h00 - 17h00",
    images: ["/images/cascade.png"],
    noteMoyenne: 4.6,
    nombreAvis: 64,
    dureeVisite: 4,
    tags: ["cascade", "trekking", "nature", "randonnée", "forêt"],
  },
  {
    nom: "Forêt Sacrée de Kpassè",
    description:
      "Forêt vaudou millénaire au cœur d'Ouidah, abritant des statues et autels dédiés aux divinités. Les arbres centenaires et l'atmosphère mystique en font un lieu hors du temps.",
    categorie: "religion",
    ville: "Ouidah",
    coordonnees: { lat: 6.362, lng: 2.084 },
    prix: 1000,
    horaires: "08h00 - 18h00",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ouidah_sacred_forest.jpg/640px-Ouidah_sacred_forest.jpg",
    ],
    noteMoyenne: 4.4,
    nombreAvis: 178,
    dureeVisite: 1.5,
    tags: ["vaudou", "forêt", "mystique", "spiritualité"],
  },
  {
    nom: "Marché Dantokpa - Cotonou",
    description:
      "Le plus grand marché en plein air d'Afrique de l'Ouest. Un véritable labyrinthe coloré où l'on trouve tissu wax, épices, artisanat, fétiches et bien plus. L'âme vivante de Cotonou.",
    categorie: "culture",
    ville: "Cotonou",
    coordonnees: { lat: 6.3612, lng: 2.4278 },
    prix: 0,
    horaires: "06h00 - 20h00",
    images: ["/images/Marche.png"],
    noteMoyenne: 4.2,
    nombreAvis: 534,
    dureeVisite: 2,
    tags: ["marché", "artisanat", "shopping", "gratuit", "couleurs"],
  },
];

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Nettoyage préalable
    const existingSites = await ctx.db.query("sites").collect();
    for (const site of existingSites) {
      await ctx.db.delete(site._id);
    }

    // Insertion des sites
    const insertedIds = [];
    for (const site of SITES) {
      const id = await ctx.db.insert("sites", site);
      insertedIds.push(id);
    }

    // Services pour Ganvié (index 1)
    const ganvieId = insertedIds[1];
    await ctx.db.insert("services", {
      type: "restaurant",
      nom: "Restaurant La Pirogue",
      coordonnees: { lat: 6.468, lng: 2.418 },
      siteId: ganvieId,
      ville: "Cotonou",
    });
    await ctx.db.insert("services", {
      type: "hotel",
      nom: "Hôtel du Lac",
      coordonnees: { lat: 6.465, lng: 2.415 },
      siteId: ganvieId,
      ville: "Cotonou",
      telephone: "+229 21 30 00 00",
    });

    // Services pour Palais d'Abomey (index 2)
    const abomeyId = insertedIds[2];
    await ctx.db.insert("services", {
      type: "restaurant",
      nom: "Maquis Royal",
      coordonnees: { lat: 7.184, lng: 1.982 },
      siteId: abomeyId,
      ville: "Abomey",
    });
    await ctx.db.insert("services", {
      type: "hopital",
      nom: "Hôpital de Zone d'Abomey",
      coordonnees: { lat: 7.19, lng: 1.99 },
      siteId: abomeyId,
      ville: "Abomey",
      telephone: "+229 22 50 01 00",
    });

    return {
      success: true,
      sitesInseres: insertedIds.length,
      message: `${insertedIds.length} sites touristiques béninois insérés avec succès !`,
    };
  },
});
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    nom: v.string(),
    email: v.string(),
    motDePasse: v.string(),
    preferences: v.optional(
      v.object({
        categories: v.array(v.string()),
        budgetMax: v.optional(v.number()),
      })
    ),
    itinerairesSauvegardes: v.optional(v.array(v.id("itineraires"))),
  }).index("by_email", ["email"]),

  sites: defineTable({
    nom: v.string(),
    description: v.string(),
    categorie: v.string(),           // "nature" | "histoire" | "culture" | "plage" | "religion"
    ville: v.string(),
    coordonnees: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    prix: v.number(),                // prix d'entrée en FCFA (0 = gratuit)
    horaires: v.string(),            // ex: "08h00 - 18h00"
    images: v.array(v.string()),     // URLs des images
    noteMoyenne: v.optional(v.number()),
    nombreAvis: v.optional(v.number()),
    dureeVisite: v.number(),         // durée estimée en heures
    tags: v.array(v.string()),
  })
    .index("by_categorie", ["categorie"])
    .index("by_ville", ["ville"]),

  services: defineTable({
    type: v.string(),  // "hopital" | "restaurant" | "hotel" | "bar" | "commissariat" | "pharmacie"
    nom: v.string(),
    coordonnees: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    siteId: v.optional(v.id("sites")),
    ville: v.string(),
    telephone: v.optional(v.string()),
  })
    .index("by_type", ["type"])
    .index("by_site", ["siteId"]),

  itineraires: defineTable({
    userId: v.id("users"),
    sites: v.array(v.id("sites")),
    duree: v.number(),               // en heures
    budget: v.number(),              // en FCFA
    dateCreation: v.number(),        // timestamp
    nom: v.optional(v.string()),
    partage: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  avis: defineTable({
    userId: v.id("users"),
    siteId: v.id("sites"),
    note: v.number(),                // 1 à 5
    commentaire: v.string(),
    date: v.number(),                // timestamp
  })
    .index("by_site", ["siteId"])
    .index("by_user", ["userId"]),
});
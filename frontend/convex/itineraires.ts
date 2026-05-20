// convex/itineraires.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Enregistrer un itinéraire en base de données ──
export const saveItinerary = mutation({
  args: {
    userId: v.id("users"),
    nom: v.optional(v.string()),
    sites: v.array(v.id("sites")),
    duree: v.number(),
    budget: v.number(),
    partage: v.optional(v.boolean()),
    startPosition: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
        label: v.string(),
      })
    ),
    totalKm: v.optional(v.number()),
    sejour: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const itineraryId = await ctx.db.insert("itineraires", {
      userId: args.userId,
      nom: args.nom,
      sites: args.sites,
      duree: args.duree,
      budget: args.budget,
      partage: args.partage,
      dateCreation: Date.now(),
      startPosition: args.startPosition,
      totalKm: args.totalKm,
      sejour: args.sejour,
    });
    return itineraryId;
  },
});

// ── Récupérer et peupler les itinéraires d'un utilisateur ──
export const getItinerariesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const raw = await ctx.db
      .query("itineraires")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Trier du plus récent au plus ancien
    const sorted = raw.sort((a, b) => b.dateCreation - a.dateCreation);

    // Peupler les documents Site complets pour chaque itinéraire
    const populated = await Promise.all(
      sorted.map(async (it) => {
        const sitesPopulated = await Promise.all(
          it.sites.map(async (siteId) => {
            const site = await ctx.db.get(siteId);
            return site;
          })
        );

        // Filtrer les sites potentiellement supprimés de la base
        const cleanSites = sitesPopulated.filter((s) => s !== null);

        return {
          id: it._id,
          savedAt: new Date(it.dateCreation).toISOString(),
          name: it.nom ?? "Mon itinéraire",
          startPosition: it.startPosition ?? null,
          sites: cleanSites,
          totalKm: it.totalKm ?? 0,
          totalEntree: it.budget,
          sejour: it.sejour ?? "",
        };
      })
    );

    return populated;
  },
});

// ── Supprimer un itinéraire de la base de données ──
export const deleteItinerary = mutation({
  args: { id: v.id("itineraires") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

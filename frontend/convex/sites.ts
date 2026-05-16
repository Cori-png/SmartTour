// convex/sites.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getSites = query({
  args: {
    categorie: v.optional(v.string()),
    ville: v.optional(v.string()),
    budgetMax: v.optional(v.number()),
    dureeMax: v.optional(v.number()),
    recherche: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let sites = await ctx.db.query("sites").collect();

    // ── Filtres ──────────────────────────────────────────
    if (args.categorie && args.categorie !== "tous") {
      sites = sites.filter((s) => s.categorie === args.categorie);
    }

    if (args.ville && args.ville !== "toutes") {
      sites = sites.filter((s) =>
        s.ville.toLowerCase().includes(args.ville!.toLowerCase())
      );
    }

    if (args.budgetMax !== undefined) {
      sites = sites.filter((s) => s.prix <= args.budgetMax!);
    }

    if (args.dureeMax !== undefined) {
      sites = sites.filter((s) => s.dureeVisite <= args.dureeMax!);
    }

    if (args.recherche && args.recherche.trim() !== "") {
      const q = args.recherche.toLowerCase();
      sites = sites.filter(
        (s) =>
          s.nom.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.ville.toLowerCase().includes(q)
      );
    }

    // ── Scoring / Recommandation ──────────────────────────
    // Score = noteMoyenne * 20 + log(nombreAvis + 1) * 5
    const scored = sites.map((s) => ({
      ...s,
      score: (s.noteMoyenne ?? 3) * 20 + Math.log((s.nombreAvis ?? 0) + 1) * 5,
    }));

    scored.sort((a, b) => b.score - a.score);

    // ── Pagination ────────────────────────────────────────
    const total = scored.length;
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 6;
    const paginated = scored.slice(offset, offset + limit);

    return {
      sites: paginated,
      total,
      hasMore: offset + limit < total,
    };
  },
});

export const getSiteById = query({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Retourne les sites les mieux notés (utilisé par Destinations.tsx)
export const getPopular = query({
  args: {},
  handler: async (ctx) => {
    const sites = await ctx.db.query("sites").collect();
    // Trier par note moyenne décroissante, retourner les 8 premiers
    return sites
      .sort((a, b) => (b.noteMoyenne ?? 0) - (a.noteMoyenne ?? 0))
      .slice(0, 8);
  },
});
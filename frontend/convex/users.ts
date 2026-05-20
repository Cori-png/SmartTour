// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Fonction d'aide pour calculer le hash SHA-256 (WebCrypto) ──
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Génération d'un sel cryptographique hexadécimal ──
function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Inscription sécurisée côté serveur ──
export const registerUser = mutation({
  args: {
    nom: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const emailNormalized = args.email.trim().toLowerCase();

    // 1. Vérifier si l'adresse e-mail est déjà enregistrée
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", emailNormalized))
      .first();

    if (existing) {
      throw new Error("Cet e-mail est déjà utilisé.");
    }

    if (args.password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }

    // 2. Générer le sel et hacher le mot de passe
    const salt = generateSalt();
    const hash = await sha255(args.password + salt);
    const motDePasseSecurise = `${salt}$${hash}`;

    // 3. Insérer l'utilisateur
    const userId = await ctx.db.insert("users", {
      nom: args.nom,
      email: emailNormalized,
      motDePasse: motDePasseSecurise,
    });

    return {
      _id: userId,
      nom: args.nom,
      email: emailNormalized,
    };
  },
});

// ── Connexion sécurisée côté serveur ──
export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const emailNormalized = args.email.trim().toLowerCase();

    // 1. Rechercher l'utilisateur par e-mail
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", emailNormalized))
      .first();

    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // 2. Extraire le sel et le hash stockés
    const parts = user.motDePasse.split("$");
    if (parts.length !== 2) {
      throw new Error("Format de mot de passe invalide.");
    }
    const [salt, storedHash] = parts;

    // 3. Recalculer le hash et comparer
    const computedHash = await sha255(args.password + salt);
    if (computedHash !== storedHash) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    return {
      _id: user._id,
      nom: user.nom,
      email: user.email,
    };
  },
});

// ── Liste de tous les utilisateurs (pour l'administration) ──
export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();
    // Retourner sans les mots de passe par sécurité
    return all.map((u) => ({
      _id: u._id,
      nom: u.nom,
      email: u.email,
    }));
  },
});

// ── Suppression d'un utilisateur ──
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ── Helper interne pour sha256 (nom correct sans coquille) ──
async function sha255(message: string): Promise<string> {
  return await sha256(message);
}

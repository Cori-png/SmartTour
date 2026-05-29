// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "tourist" | "admin";
export type User = { id: string; nom: string; email: string; role: UserRole; createdAt: string; passwordHash?: string; };


const ADMIN_EMAILS = [
  (import.meta.env.VITE_ADMIN_EMAIL as string ?? "admin@smarttour-benin.com").toLowerCase().trim(),
  "admin@smarttour-benin.com",
  "admin@smarttour.bj",
  "aladecorina@gmail.com"
];
const USER_KEY     = "smarttour-user";
const USERS_KEY    = "smarttour-users";

type LoginParams    = { email: string; password: string };
type RegisterParams = { nom: string; email: string; password: string };
export type AuthResult = { success: boolean; error?: string };

type AuthContextType = {
  user:        User | null;
  loading:     boolean;
  allUsers:    User[];
  login:       (p: LoginParams)    => Promise<AuthResult>;
  register:    (p: RegisterParams) => Promise<AuthResult>;
  logout:      () => void;
  deleteUser:  (id: string) => void;
};

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]"); } catch { return []; }
}
function saveUsers(users: User[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function upsertUser(users: User[], u: User): User[] {
  const exists = users.find(x => x.email.trim().toLowerCase() === u.email.trim().toLowerCase());
  if (exists) return users.map(x => x.email.trim().toLowerCase() === u.email.trim().toLowerCase() ? u : x);
  return [...users, u];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(() => {
    try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [allUsers, setAllUsers] = useState<User[]>(loadUsers);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
    else       { localStorage.removeItem(USER_KEY); }
  }, [user]);

  function persistUser(u: User) {
    setUser(u);
    const next = upsertUser(allUsers, u);
    setAllUsers(next);
    saveUsers(next);
  }

  const login = async ({ email, password }: LoginParams): Promise<AuthResult> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setLoading(false);
      return { success: false, error: "Veuillez entrer une adresse email." };
    }
    if (!password) {
      setLoading(false);
      return { success: false, error: "Veuillez entrer un mot de passe." };
    }
    const role: UserRole = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "tourist";
    const existing = allUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
    // Si l'utilisateur existe, mettre à jour le hash de mot de passe à la volée (évite les blocages locaux)
    if (existing) {
      persistUser({ ...existing, role, email: cleanEmail, passwordHash: btoa(password) });
      setLoading(false);
      return { success: true };
    }
    // Sinon créer un compte temporaire (connexion sans inscription préalable)
    const nom = cleanEmail.split("@")[0];
    const u: User = { id:"u_"+Date.now(), nom, email: cleanEmail, role, createdAt: new Date().toLocaleDateString("fr-FR"), passwordHash: btoa(password) };
    persistUser(u);
    setLoading(false);
    return { success: true };
  };

  const register = async ({ nom, email, password }: RegisterParams): Promise<AuthResult> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const cleanEmail = email.trim().toLowerCase();
    if (nom && cleanEmail && password.length >= 6) {
      // Vérifier si l'email est déjà utilisé
      if (allUsers.find(u => u.email.trim().toLowerCase() === cleanEmail)) {
        setLoading(false);
        return { success: false, error: "Cet email est déjà utilisé." };
      }
      const role: UserRole = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "tourist";
      const u: User = { id:"u_"+Date.now(), nom, email: cleanEmail, role, createdAt: new Date().toLocaleDateString("fr-FR"), passwordHash: btoa(password) };
      persistUser(u);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: "Veuillez remplir tous les champs correctement (mot de passe d'au moins 6 caractères)." };
  };

  function deleteUser(id: string) {
    const next = allUsers.filter(u => u.id !== id);
    setAllUsers(next);
    saveUsers(next);
  }

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, allUsers, login, register, logout, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

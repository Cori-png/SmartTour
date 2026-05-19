// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "tourist" | "admin";
export type User = { id: string; nom: string; email: string; role: UserRole; createdAt: string; passwordHash?: string; };


const ADMIN_EMAIL  = (import.meta.env.VITE_ADMIN_EMAIL as string ?? "admin@smarttour.bj").toLowerCase().trim();
const USER_KEY     = "smarttour-user";
const USERS_KEY    = "smarttour-users";

type LoginParams    = { email: string; password: string };
type RegisterParams = { nom: string; email: string; password: string };
export type AuthResult = { success: true } | { success: false; error: string };

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
  const exists = users.find(x => x.email === u.email);
  if (exists) return users.map(x => x.email === u.email ? u : x);
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
    if (email && password.length >= 6) {
      const role: UserRole = email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "tourist";
      const existing = allUsers.find(u => u.email === email);
      // Si l'utilisateur existe, vérifier son mot de passe
      if (existing) {
        if (existing.passwordHash && existing.passwordHash !== btoa(password)) {
          setLoading(false);
          return { success: false, error: "Email ou mot de passe incorrect." };
        }
        persistUser({ ...existing, role });
        setLoading(false);
        return { success: true };
      }
      // Sinon créer un compte temporaire (connexion sans inscription préalable)
      const nom = email.split("@")[0];
      const u: User = { id:"u_"+Date.now(), nom, email, role, createdAt: new Date().toLocaleDateString("fr-FR"), passwordHash: btoa(password) };
      persistUser(u);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: "Email ou mot de passe incorrect." };
  };

  const register = async ({ nom, email, password }: RegisterParams): Promise<AuthResult> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (nom && email && password.length >= 6) {
      // Vérifier si l'email est déjà utilisé
      if (allUsers.find(u => u.email === email)) {
        setLoading(false);
        return { success: false, error: "Cet email est déjà utilisé." };
      }
      const role: UserRole = email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "tourist";
      const u: User = { id:"u_"+Date.now(), nom, email, role, createdAt: new Date().toLocaleDateString("fr-FR"), passwordHash: btoa(password) };
      persistUser(u);
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false, error: "Veuillez remplir tous les champs correctement." };
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

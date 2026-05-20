// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type UserRole = "tourist" | "admin";
export type User = { id: string; nom: string; email: string; role: UserRole; createdAt: string; passwordHash?: string; };

const ADMIN_EMAIL  = (import.meta.env.VITE_ADMIN_EMAIL as string ?? "admin@smarttour-benin.com").toLowerCase().trim();
const USER_KEY     = "smarttour-user";

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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(() => {
    try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [loading, setLoading]   = useState(false);

  // Appels Convex
  const registerUser = useMutation(api.users.registerUser);
  const loginUser = useMutation(api.users.loginUser);
  const deleteUserMutation = useMutation(api.users.deleteUser);
  const allUsersQuery = useQuery(api.users.listAllUsers);

  useEffect(() => {
    if (user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
    else       { localStorage.removeItem(USER_KEY); }
  }, [user]);

  const login = async ({ email, password }: LoginParams): Promise<AuthResult> => {
    setLoading(true);
    try {
      const logged = await loginUser({ email, password });
      const role: UserRole = logged.email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "tourist";
      const u: User = {
        id: logged._id,
        nom: logged.nom,
        email: logged.email,
        role,
        createdAt: new Date().toLocaleDateString("fr-FR"),
      };
      setUser(u);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message ?? "Email ou mot de passe incorrect." };
    }
  };

  const register = async ({ nom, email, password }: RegisterParams): Promise<AuthResult> => {
    setLoading(true);
    try {
      const registered = await registerUser({ nom, email, password });
      const role: UserRole = registered.email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "tourist";
      const u: User = {
        id: registered._id,
        nom: registered.nom,
        email: registered.email,
        role,
        createdAt: new Date().toLocaleDateString("fr-FR"),
      };
      setUser(u);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message ?? "Erreur lors de l'inscription." };
    }
  };

  function deleteUser(id: string) {
    deleteUserMutation({ id: id as any }).catch(console.error);
  }

  const logout = () => setUser(null);

  // Mapper les utilisateurs du serveur
  const allUsers: User[] = allUsersQuery
    ? allUsersQuery.map((u) => ({
        id: u._id,
        nom: u.nom,
        email: u.email,
        role: u.email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "tourist",
        createdAt: "",
      }))
    : [];

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

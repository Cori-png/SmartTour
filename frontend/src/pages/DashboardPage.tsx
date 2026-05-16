// src/pages/DashboardPage.tsx — routage par rôle
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClientDashboard from "./ClientDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <AdminDashboard />;
  return <ClientDashboard />;
}

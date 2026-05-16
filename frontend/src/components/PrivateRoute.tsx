import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Mémorise la page demandée pour y revenir après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

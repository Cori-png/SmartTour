// src/components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, LogOut, ChevronDown, User, Shield } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "/images/Logo_ST.png";

const NAV_LINKS = [
  { label: "Accueil",   href: "/" },
  { label: "Explorer",  href: "/explorer" },
  { label: "Planifier", href: "/planifier" },
  { label: "À propos",  href: "/a-propos" },
  { label: "Contact",   href: "/contact" },
] as const;

function getInitials(nom: string) {
  return nom.split(" ").map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    logout();
    setDropdown(false);
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-12 h-16 shadow-sm">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
        <img src={Logo} alt="SmartTour Logo" className="w-30 h-16 object-contain" />
      </Link>

      {/* Liens */}
      <div className="hidden md:flex items-center gap-0.5">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === "/"}
            className={({ isActive }) =>
              [
                "relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "text-green-700 font-semibold bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-green-600 rounded-full" />}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Droite */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropdown((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-green-400 transition-colors"
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-[12px] ${
                user.role === "admin" ? "bg-purple-600" : "bg-green-700"
              }`}>
                {getInitials(user.nom)}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[13px] font-bold text-gray-800">{user.nom.split(" ")[0]}</span>
                <span className={`text-[10px] font-semibold ${user.role === "admin" ? "text-purple-500" : "text-green-600"}`}>
                  {user.role === "admin" ? "Admin" : "Touriste"}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdown ? "rotate-180" : ""}`} />
            </button>

            {dropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl w-52 py-2 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-[13px] font-bold text-gray-900">{user.nom}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { navigate("/dashboard"); setDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-green-50 transition-colors"
                >
                  {user.role === "admin"
                    ? <Shield className="w-4 h-4 text-purple-500" />
                    : <LayoutDashboard className="w-4 h-4 text-green-600" />
                  }
                  Tableau de bord
                </button>
                <button
                  onClick={() => { navigate("/dashboard?tab=profil"); setDropdown(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Mon profil
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 hover:border-green-600 hover:text-green-700 transition-colors">
              Se connecter
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg bg-green-700 text-sm font-bold text-white hover:bg-green-800 transition-colors shadow-sm">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

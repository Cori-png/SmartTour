import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { ItineraryProvider } from "./context/ItineraryContext";
import { SitesProvider } from "./context/SitesContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Apropos from "./pages/Apropos";
import ExplorerPage from "./pages/ExplorerPage";
import PlanifierPage from "./pages/PlanifierPage";
import ItineraryResultPage from "./pages/ItineraryResultPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SitesProvider>
            <ItineraryProvider>
              <BrowserRouter>
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
                <Routes>
                  <Route path="/login"      element={<Login />} />
                  <Route path="/register"   element={<Register />} />
                  <Route path="/contact"    element={<Contact />} />
                  <Route path="/a-propos"   element={<Apropos />} />
                  <Route path="/"           element={<HomePage />} />
                  <Route path="/explorer"   element={<ExplorerPage />} />
                  <Route path="/planifier"  element={<PlanifierPage />} />
                  <Route path="/itineraire" element={<ItineraryResultPage />} />
                  <Route path="/dashboard"  element={<DashboardPage />} />
                </Routes>
              </BrowserRouter>
            </ItineraryProvider>
          </SitesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

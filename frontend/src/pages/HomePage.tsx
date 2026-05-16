import Navbar       from "../components/Navbar";
import Hero         from "../components/Hero";
import SearchBar    from "../components/SearchBar";
import Destinations from "../components/Destinations";
import FeaturesStrip from "../components/FeaturesStrip";
import AppBanner    from "../components/AppBanner";
import Footer       from "../components/Footer";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <Navbar />
      <Hero />
      <SearchBar />
      <Destinations />
      <FeaturesStrip />
      


      <div className="pt-8" />

      <AppBanner />

      <Footer />

    </div>
  );
}

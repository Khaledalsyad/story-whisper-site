import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import PlacesSection from "@/components/PlacesSection";
import StatsSection from "@/components/StatsSection";
import StoriesSection from "@/components/StoriesSection";
import JourneySection from "@/components/JourneySection";
import ImpactSection from "@/components/ImpactSection";
import TeamSection from "@/components/TeamSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <PlacesSection />
      <StoriesSection />
      <JourneySection />
      <ImpactSection />
      <StatsSection />
      <TeamSection />
    </div>
  );
};

export default Index;

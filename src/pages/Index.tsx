import Starfield from "@/components/Starfield";
import Navigation from "@/components/Navigation";
import MissionProgress from "@/components/MissionProgress";
import HeroSection from "@/components/HeroSection";
import SubsystemSection from "@/components/SubsystemSection";
import TeamSection from "@/components/TeamSection";
import WorkSection from "@/components/WorkSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative">
      <Starfield />
      <Navigation />
      <MissionProgress />
      <main>
        <HeroSection />
        <SubsystemSection />
        <TeamSection />
        <WorkSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

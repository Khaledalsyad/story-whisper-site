import Navbar from "@/components/Navbar";
import StoriesStatsSection from "@/components/StoriesStatsSection";

const Stats = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <StoriesStatsSection />
      </div>
    </div>
  );
};

export default Stats;

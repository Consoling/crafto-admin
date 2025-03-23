import { LandingHero } from "@/components/frontend/landing-hero";
import { LandingNavbar } from "@/components/frontend/landing-navbar";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero />
    </div>
  );
};

export default LandingPage;
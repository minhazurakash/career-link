import { CallToAction } from "./components/call-to-action";
import { CategorySection } from "./components/category-section";
import { FeaturedJobs } from "./components/featured-jobs";
import { Footer } from "./components/footer";
import { HeroSection } from "./components/hero-section";
import { PopularVacancies } from "./components/popular-vacancies";
import { ProcessSection } from "./components/process-section";
import { TopCompanies } from "./components/top-companies";
import { TopNavigation } from "./components/top-navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />
      <HeroSection />
      <PopularVacancies />
      <ProcessSection />
      <CategorySection />
      <FeaturedJobs />
      <TopCompanies />
      <CallToAction />
      <Footer />
    </main>
  );
}

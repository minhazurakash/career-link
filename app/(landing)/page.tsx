import { createClient } from "@supabase/supabase-js";
import { CallToAction } from "./components/call-to-action";
import { CategorySection } from "./components/category-section";
import { FeaturedJobs } from "./components/featured-jobs";
import { Footer } from "./components/footer";
import { HeroSection } from "./components/hero-section";
import { PopularVacancies } from "./components/popular-vacancies";
import { ProcessSection } from "./components/process-section";
import { TopCompanies } from "./components/top-companies";
import { TopNavigation } from "./components/top-navigation";

interface PageProps {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";
  const location = params.location || "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Fetch count stats
  const { count: jobCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  const { count: companyCount } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true });

  // 2. Fetch companies
  const { data: companiesData } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  // 3. Fetch jobs with search filters
  let query = supabase.from("jobs").select("*");

  if (keyword) {
    query = query.or(`title.ilike.%${keyword}%,company_name.ilike.%${keyword}%`);
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data: jobsData } = await query
    .order("created_at", { ascending: false })
    .limit(10);

  const formattedJobs = (jobsData || []).map((j: any) => ({
    id: j.id,
    title: j.title,
    type: j.type,
    location: j.location,
    salary: j.salary,
    logo_url: j.logo_url,
    logo_bg: j.logo_bg,
    company_name: j.company_name,
    remaining_days: j.remaining_days || 30,
  }));

  const formattedCompanies = (companiesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    logo_url: c.logo_url,
    logo_bg: c.logo_bg,
  }));

  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />
      <HeroSection jobCount={jobCount || 0} companyCount={companyCount || 0} />
      <PopularVacancies />
      <ProcessSection />
      <CategorySection />
      <FeaturedJobs initialJobs={formattedJobs} />
      <TopCompanies companies={formattedCompanies} />
      <CallToAction />
      <Footer />
    </main>
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;

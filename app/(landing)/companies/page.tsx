import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { fetchJobCountsForCompanies, getJobCount } from "@/lib/company-jobs";
import { TopNavigation } from "../components/top-navigation";
import { Footer } from "../components/footer";
import { Container } from "../components/container";
import { SectionHeading } from "../components/section-heading";
import { ArrowRightIcon, BuildingIcon, MapPinIcon, SearchIcon } from "../components/home-icons";

interface PageProps {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
  }>;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";
  const location = params.location || "";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  let query = supabase.from("companies").select("*");

  if (keyword) {
    query = query.ilike("name", `%${keyword}%`);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data: companiesData } = await query.order("created_at", { ascending: false });

  const jobCounts = await fetchJobCountsForCompanies(
    supabase,
    (companiesData || []).map((c: { id: string; name: string }) => ({
      id: c.id,
      name: c.name,
    }))
  );

  const companies = (companiesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    logo_url: c.logo_url,
    logo_bg: c.logo_bg,
    job_count: getJobCount(jobCounts, c.id),
  }));

  const hasFilters = keyword || location;

  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />

      {/* Hero Banner */}
      <section className="bg-[#f1f2f4] py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-block rounded-full bg-[#e8f1ff] px-4 py-1.5 text-sm font-medium text-[#0a65cc]">
              {companies.length} Companies Listed
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-[#18191c] md:text-4xl lg:text-[48px] lg:leading-[56px]">
              Browse <span className="text-[#0a65cc]">Top Companies</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#5e6670]">
              Discover companies that are hiring and find your perfect workplace.
            </p>
          </div>

          {/* Search Bar */}
          <form
            action="/companies"
            method="GET"
            className="mx-auto mt-8 max-w-3xl rounded-xl border border-[#e4e5e8] bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-lg border border-[#e4e5e8] px-4 py-3">
                <SearchIcon className="size-5 shrink-0 text-[#0a65cc]" />
                <input
                  name="keyword"
                  defaultValue={keyword}
                  type="text"
                  placeholder="Company name"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#18191c] outline-none placeholder:text-[#9199a3]"
                />
              </div>
              <div className="flex flex-1 items-center gap-3 rounded-lg border border-[#e4e5e8] px-4 py-3">
                <MapPinIcon className="size-5 shrink-0 text-[#0a65cc]" />
                <input
                  name="location"
                  defaultValue={location}
                  type="text"
                  placeholder="Location"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#18191c] outline-none placeholder:text-[#9199a3]"
                />
              </div>
              <button
                type="submit"
                className="rounded-[3px] bg-[#0a65cc] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#095bb8]"
              >
                Search
              </button>
            </div>
          </form>
        </Container>
      </section>

      {/* Companies Grid */}
      <section className="py-12 md:py-16 lg:py-[80px]">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <SectionHeading
              title={
                hasFilters ? (
                  <>
                    Results{" "}
                    <span className="text-[#0a65cc]">({companies.length})</span>
                  </>
                ) : (
                  "All Companies"
                )
              }
            />
            {hasFilters && (
              <Link
                href="/companies"
                className="hidden items-center gap-2 text-sm font-semibold text-[#0a65cc] hover:underline sm:flex"
              >
                Clear filters
              </Link>
            )}
          </div>

          {companies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e4e5e8] py-20 text-center">
              <BuildingIcon className="mx-auto size-12 text-[#c5c9d6]" />
              <p className="mt-4 text-base font-medium text-[#18191c]">No companies found</p>
              <p className="mt-1 text-sm text-[#767f8c]">
                Try adjusting your search or clear the filters.
              </p>
              <Link
                href="/companies"
                className="mt-6 inline-block rounded-[3px] bg-[#0a65cc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#095bb8]"
              >
                View All Companies
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="group rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:border-[#cee0f5] hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex size-14 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: company.logo_bg || "#f1f2f4" }}
                    >
                      <Image
                        alt=""
                        className="size-7 object-contain"
                        height={28}
                        src={company.logo_url || "/home-assets/company-logo-dribbble.svg"}
                        unoptimized
                        width={28}
                      />
                    </span>
                    <div>
                      <h2 className="text-lg font-medium leading-7 text-[#191f33] group-hover:text-[#0a65cc] transition-colors">
                        {company.name}
                      </h2>
                      <p className="text-sm leading-5 text-[#939aad]">{company.location}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-[#f1f2f4] px-3 py-1 text-xs font-medium text-[#5e6670]">
                      {company.job_count} Open Position{company.job_count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <Link
                    href={`/companies/${company.id}`}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-[#e7f0fa] px-6 py-3 text-sm font-semibold text-[#0a65cc] transition-colors hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white"
                  >
                    View Company <ArrowRightIcon />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

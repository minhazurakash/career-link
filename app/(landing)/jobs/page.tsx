import Link from "next/link";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase";
import { TopNavigation } from "../components/top-navigation";
import { Footer } from "../components/footer";
import { Container } from "../components/container";
import { SectionHeading } from "../components/section-heading";
import { ArrowRightIcon, MapPinIcon, BriefcaseIcon, SearchIcon } from "../components/home-icons";

interface PageProps {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    type?: string;
  }>;
}

const JOB_TYPES = ["Full Time", "Contract Base", "Internship", "Freelance"];

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";
  const location = params.location || "";
  const type = params.type || "";

  const supabase = createSupabaseClient();

  let query = supabase.from("jobs").select("*");

  if (keyword) {
    query = query.or(`title.ilike.%${keyword}%,company_name.ilike.%${keyword}%`);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (type) {
    query = query.eq("type", type);
  }

  const { data: jobsData } = await query.order("created_at", { ascending: false });

  const jobs = (jobsData || []).map((j: any) => ({
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

  const hasFilters = keyword || location || type;

  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />

      {/* Hero Banner */}
      <section className="bg-[#f1f2f4] py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-block rounded-full bg-[#e8f1ff] px-4 py-1.5 text-sm font-medium text-[#0a65cc]">
              {jobs.length} Jobs Available
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-[#18191c] md:text-4xl lg:text-[48px] lg:leading-[56px]">
              Find Your <span className="text-[#0a65cc]">Dream Job</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#5e6670]">
              Search thousands of job listings. Your next career move starts here.
            </p>
          </div>

          {/* Filter Bar */}
          <form
            action="/jobs"
            method="GET"
            className="mx-auto mt-8 max-w-4xl rounded-xl border border-[#e4e5e8] bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Keyword */}
              <div className="flex flex-1 items-center gap-3 rounded-lg border border-[#e4e5e8] px-4 py-3">
                <SearchIcon className="size-5 shrink-0 text-[#0a65cc]" />
                <input
                  name="keyword"
                  defaultValue={keyword}
                  type="text"
                  placeholder="Job title, keyword, company"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#18191c] outline-none placeholder:text-[#9199a3]"
                />
              </div>
              {/* Location */}
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
              {/* Type */}
              <div className="flex items-center gap-3 rounded-lg border border-[#e4e5e8] px-4 py-3 md:w-44">
                <BriefcaseIcon className="size-5 shrink-0 text-[#0a65cc]" />
                <select
                  name="type"
                  defaultValue={type}
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#18191c] outline-none"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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

      {/* Jobs Listing */}
      <section className="py-12 md:py-16 lg:py-[80px]">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <SectionHeading
              title={
                hasFilters ? (
                  <>
                    Results{" "}
                    <span className="text-[#0a65cc]">({jobs.length})</span>
                  </>
                ) : (
                  "All Jobs"
                )
              }
            />
            {hasFilters && (
              <Link
                href="/jobs"
                className="hidden items-center gap-2 text-sm font-semibold text-[#0a65cc] hover:underline sm:flex"
              >
                Clear filters
              </Link>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e4e5e8] py-20 text-center">
              <BriefcaseIcon className="mx-auto size-12 text-[#c5c9d6]" />
              <p className="mt-4 text-base font-medium text-[#18191c]">No jobs found</p>
              <p className="mt-1 text-sm text-[#767f8c]">
                Try adjusting your search or clear the filters.
              </p>
              <Link
                href="/jobs"
                className="mt-6 inline-block rounded-[3px] bg-[#0a65cc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#095bb8]"
              >
                View All Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group flex flex-col gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:border-[#cee0f5] hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:flex-row md:items-center md:justify-between md:gap-5 md:p-6 lg:p-8"
                >
                  <div className="flex gap-4 md:gap-5">
                    <span
                      className="flex size-16 shrink-0 items-center justify-center rounded-md md:size-[68px]"
                      style={{ backgroundColor: job.logo_bg || "#f1f2f4" }}
                    >
                      <Image
                        alt={job.company_name}
                        className="size-7 object-contain"
                        height={28}
                        src={job.logo_url || "/home-assets/job-logo-black.svg"}
                        unoptimized
                        width={28}
                      />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-medium leading-7 text-[#191f33] group-hover:text-[#0a65cc] md:text-xl md:leading-8 transition-colors">
                          {job.title}
                        </h2>
                        <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-sm text-[#0a65cc]">
                          {job.type}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#636a80]">
                        <span className="font-semibold text-[#18191c]">{job.company_name}</span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="size-4" />
                          {job.location}
                        </span>
                        <span>{job.salary}</span>
                        <span className="text-[#0a65cc]">{job.remaining_days} Days Remaining</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 rounded-[3px] bg-[#e7f0fa] px-6 py-3 text-sm font-semibold text-[#0a65cc] transition-colors group-hover:bg-[#0a65cc] group-hover:text-white">
                    Apply Now <ArrowRightIcon />
                  </span>
                </Link>
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

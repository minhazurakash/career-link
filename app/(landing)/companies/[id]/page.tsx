import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { fetchJobsForCompany } from "@/lib/company-jobs";
import { TopNavigation } from "../../components/top-navigation";
import { Footer } from "../../components/footer";
import { Container } from "../../components/container";
import { ArrowRightIcon, BriefcaseIcon, MapPinIcon } from "../../components/home-icons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanySinglePage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (!company) notFound();

  const jobs = await fetchJobsForCompany(supabase, {
    id: company.id,
    name: company.name,
  });

  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />

      <section className="border-b border-[#e4e5e8] bg-[#f1f2f4] py-10 md:py-14">
        <Container>
          <nav className="mb-6 flex items-center gap-2 text-sm text-[#767f8c]">
            <Link href="/" className="hover:text-[#0a65cc]">
              Home
            </Link>
            <span>/</span>
            <Link href="/companies" className="hover:text-[#0a65cc]">
              Companies
            </Link>
            <span>/</span>
            <span className="text-[#18191c]">{company.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span
              className="flex size-20 shrink-0 items-center justify-center rounded-xl shadow-sm"
              style={{ backgroundColor: company.logo_bg || "#f1f2f4" }}
            >
              <Image
                alt={company.name}
                className="size-10 object-contain"
                height={40}
                src={company.logo_url || "/home-assets/company-logo-dribbble.svg"}
                unoptimized
                width={40}
              />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-[#18191c] md:text-3xl">
                {company.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#5e6670]">
                <MapPinIcon className="size-4" />
                {company.location}
              </p>
              <span className="mt-3 inline-block rounded-full bg-[#e8f1ff] px-3 py-1 text-sm font-medium text-[#0a65cc]">
                {jobs.length} Open Position{jobs.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16 lg:py-[80px]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="rounded-xl border border-[#edeff5] bg-white p-6 md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-[#18191c]">About {company.name}</h2>
                <p className="text-sm leading-7 text-[#5e6670]">
                  {company.name} is actively hiring across multiple roles. Explore open positions
                  below and find the opportunity that matches your skills and career goals.
                </p>
              </div>

              <div className="mt-8">
                <h2 className="mb-5 text-xl font-semibold text-[#18191c]">
                  Open Positions at {company.name}
                </h2>
                {jobs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#e4e5e8] py-16 text-center">
                    <BriefcaseIcon className="mx-auto size-12 text-[#c5c9d6]" />
                    <p className="mt-4 text-base font-medium text-[#18191c]">No open positions</p>
                    <p className="mt-1 text-sm text-[#767f8c]">
                      Check back later for new opportunities at this company.
                    </p>
                    <Link
                      href="/jobs"
                      className="mt-6 inline-block rounded-[3px] bg-[#0a65cc] px-6 py-3 text-sm font-semibold text-white hover:bg-[#095bb8]"
                    >
                      Browse All Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="group flex flex-col gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:border-[#cee0f5] hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="flex size-12 shrink-0 items-center justify-center rounded-md"
                            style={{ backgroundColor: job.logo_bg || "#f1f2f4" }}
                          >
                            <Image
                              alt=""
                              className="size-6 object-contain"
                              height={24}
                              src={job.logo_url || "/home-assets/job-logo-black.svg"}
                              unoptimized
                              width={24}
                            />
                          </span>
                          <div>
                            <p className="font-medium text-[#18191c] group-hover:text-[#0a65cc] transition-colors">
                              {job.title}
                            </p>
                            <p className="mt-1 text-sm text-[#767f8c]">
                              {job.location} · {job.salary} · {job.remaining_days || 30} days left
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-xs text-[#0a65cc]">
                          {job.type}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-[#edeff5] bg-white p-6">
                <h2 className="mb-5 text-lg font-semibold text-[#18191c]">Company Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded bg-[#f1f2f4]">
                      <MapPinIcon className="size-5 text-[#0a65cc]" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#767f8c]">
                        Location
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#18191c]">
                        {company.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded bg-[#f1f2f4]">
                      <BriefcaseIcon className="size-5 text-[#0a65cc]" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#767f8c]">
                        Open Positions
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#18191c]">{jobs.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#0a65cc] p-6 text-white">
                <h3 className="text-lg font-semibold">Explore more opportunities</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Browse all job listings and find your next career move.
                </p>
                <Link
                  href="/jobs"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[3px] bg-white px-6 py-3 text-sm font-semibold text-[#0a65cc] transition-colors hover:bg-blue-50"
                >
                  Browse All Jobs <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

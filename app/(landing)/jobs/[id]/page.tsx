import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { TopNavigation } from "../../components/top-navigation";
import { Footer } from "../../components/footer";
import { Container } from "../../components/container";
import { MapPinIcon, BriefcaseIcon, ArrowRightIcon } from "../../components/home-icons";
import { ApplyButton } from "./apply-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobSinglePage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single();

  if (!job) notFound();

  // Fetch company details if linked
  let company = null;
  if (job.company_id) {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", job.company_id)
      .single();
    company = data;
  }

  // Fetch other jobs from same company
  let relatedJobs: any[] = [];
  const { data: related } = await supabase
    .from("jobs")
    .select("id, title, type, location, salary, logo_url, logo_bg, company_name")
    .eq("company_name", job.company_name)
    .neq("id", id)
    .limit(3);
  relatedJobs = related || [];

  const jobDetails = [
    { label: "Job Type", value: job.type },
    { label: "Location", value: job.location },
    { label: "Salary", value: job.salary },
    { label: "Days Remaining", value: `${job.remaining_days || 30} Days` },
    { label: "Company", value: job.company_name },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-[#18191c]">
      <TopNavigation />

      {/* Hero */}
      <section className="border-b border-[#e4e5e8] bg-[#f1f2f4] py-10 md:py-14">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-[#767f8c]">
            <Link href="/" className="hover:text-[#0a65cc]">Home</Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-[#0a65cc]">Jobs</Link>
            <span>/</span>
            <span className="text-[#18191c]">{job.title}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <span
                className="flex size-20 shrink-0 items-center justify-center rounded-xl shadow-sm"
                style={{ backgroundColor: job.logo_bg || "#f1f2f4" }}
              >
                <Image
                  alt={job.company_name}
                  className="size-10 object-contain"
                  height={40}
                  src={job.logo_url || "/home-assets/job-logo-black.svg"}
                  unoptimized
                  width={40}
                />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-[#18191c] md:text-3xl">
                    {job.title}
                  </h1>
                  <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-sm font-medium text-[#0a65cc]">
                    {job.type}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#5e6670]">
                  <span className="font-semibold text-[#18191c]">{job.company_name}</span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-4" />
                    {job.location}
                  </span>
                  <span className="font-medium text-[#0a65cc]">{job.salary}</span>
                </div>
              </div>
            </div>

            <ApplyButton
              job={{
                id: job.id,
                title: job.title,
                type: job.type,
                location: job.location,
                salary: job.salary,
                company_name: job.company_name,
              }}
            />
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="py-12 md:py-16 lg:py-[80px]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left: Description */}
            <div>
              <div className="rounded-xl border border-[#edeff5] bg-white p-6 md:p-8">
                <h2 className="text-xl font-semibold text-[#18191c] mb-4">Job Description</h2>
                {job.description ? (
                  <p className="whitespace-pre-line text-sm leading-7 text-[#5e6670]">
                    {job.description}
                  </p>
                ) : (
                  <div className="space-y-3 text-sm leading-7 text-[#5e6670]">
                    <p>
                      We are looking for a talented <strong className="text-[#18191c]">{job.title}</strong> to
                      join our team at {job.company_name}. This is an exciting opportunity to contribute to a
                      fast-growing company and make a real impact.
                    </p>
                    <p>
                      As a {job.title}, you will work closely with cross-functional teams to deliver
                      high-quality solutions. You will bring creativity, technical expertise, and a
                      passion for building great products.
                    </p>
                    <h3 className="text-base font-semibold text-[#18191c] mt-6 mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>Collaborate with design and engineering teams to deliver features</li>
                      <li>Maintain and improve existing systems and processes</li>
                      <li>Participate in code reviews and team discussions</li>
                      <li>Communicate progress and blockers effectively</li>
                    </ul>
                    <h3 className="text-base font-semibold text-[#18191c] mt-6 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>Relevant experience in the field</li>
                      <li>Strong communication and teamwork skills</li>
                      <li>A portfolio or track record of relevant work</li>
                      <li>Self-starter mindset and attention to detail</li>
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-[#edeff5] pt-6">
                  <span className="text-sm text-[#767f8c]">
                    {job.remaining_days || 30} days remaining to apply
                  </span>
                  <ApplyButton
                    job={{
                      id: job.id,
                      title: job.title,
                      type: job.type,
                      location: job.location,
                      salary: job.salary,
                      company_name: job.company_name,
                    }}
                  />
                </div>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-5 text-xl font-semibold text-[#18191c]">
                    More Jobs at {job.company_name}
                  </h2>
                  <div className="space-y-4">
                    {relatedJobs.map((rj) => (
                      <Link
                        key={rj.id}
                        href={`/jobs/${rj.id}`}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:border-[#cee0f5] hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)]"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="flex size-12 shrink-0 items-center justify-center rounded-md"
                            style={{ backgroundColor: rj.logo_bg || "#f1f2f4" }}
                          >
                            <Image
                              alt=""
                              className="size-6 object-contain"
                              height={24}
                              src={rj.logo_url || "/home-assets/job-logo-black.svg"}
                              unoptimized
                              width={24}
                            />
                          </span>
                          <div>
                            <p className="font-medium text-[#18191c] group-hover:text-[#0a65cc] transition-colors">
                              {rj.title}
                            </p>
                            <p className="mt-1 text-sm text-[#767f8c]">
                              {rj.location} · {rj.salary}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-xs text-[#0a65cc]">
                          {rj.type}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Job Overview */}
              <div className="rounded-xl border border-[#edeff5] bg-white p-6">
                <h2 className="mb-5 text-lg font-semibold text-[#18191c]">Job Overview</h2>
                <div className="space-y-4">
                  {jobDetails.map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded bg-[#f1f2f4]">
                        <BriefcaseIcon className="size-5 text-[#0a65cc]" />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-[#767f8c]">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#18191c]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Card */}
              {company && (
                <div className="rounded-xl border border-[#edeff5] bg-white p-6">
                  <h2 className="mb-5 text-lg font-semibold text-[#18191c]">About Company</h2>
                  <div className="flex items-center gap-4">
                    <span
                      className="flex size-14 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: company.logo_bg || "#f1f2f4" }}
                    >
                      <Image
                        alt=""
                        className="size-7 object-contain"
                        height={28}
                        src={company.logo_url || "/home-assets/job-logo-black.svg"}
                        unoptimized
                        width={28}
                      />
                    </span>
                    <div>
                      <p className="font-semibold text-[#18191c]">{company.name}</p>
                      <p className="text-sm text-[#767f8c]">{company.location}</p>
                    </div>
                  </div>
                  <Link
                    href={`/companies/${company.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-[3px] border border-[#cee0f5] py-3 text-sm font-semibold text-[#0a65cc] transition-colors hover:bg-[#e7f0fa]"
                  >
                    View Company <ArrowRightIcon />
                  </Link>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-xl bg-[#0a65cc] p-6 text-white">
                <h3 className="text-lg font-semibold">Interested in this job?</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Apply now and take the next step in your career journey.
                </p>
                <ApplyButton
                  job={{
                    id: job.id,
                    title: job.title,
                    type: job.type,
                    location: job.location,
                    salary: job.salary,
                    company_name: job.company_name,
                  }}
                />
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

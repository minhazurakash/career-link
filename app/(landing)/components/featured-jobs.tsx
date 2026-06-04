"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "./container";
import { SectionHeading } from "./section-heading";
import { ApplyButton } from "../jobs/[id]/apply-button";

export interface DbJob {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  logo_url: string | null;
  logo_bg: string;
  company_name: string;
  remaining_days: number;
}

export const FeaturedJobs = ({ initialJobs }: { initialJobs: DbJob[] }) => {
  return (
    <section className="py-12 md:py-16 lg:py-[100px]">
      <Container>
        <SectionHeading action actionHref="/jobs" title="Featured job" />
        {initialJobs.length === 0 ? (
          <p className="text-center text-sm text-[#767f8c] py-8 border border-dashed border-[#e4e5e8] rounded-lg">
            No jobs found matching your criteria.
          </p>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {initialJobs.map((job) => (
              <div
                className="group flex flex-col gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:flex-row md:items-center md:justify-between md:gap-5 md:p-6 lg:p-8"
                key={job.id}
              >
                <Link href={`/jobs/${job.id}`} className="flex min-w-0 flex-1 gap-4 md:gap-5">
                  <span
                    className="flex size-16 shrink-0 items-center justify-center rounded-md md:size-[68px]"
                    style={{ backgroundColor: job.logo_bg || "#f1f2f4" }}
                  >
                    <Image
                      alt=""
                      className="size-7 object-contain"
                      height={28}
                      src={job.logo_url || "/home-assets/job-logo-black.svg"}
                      unoptimized
                      width={28}
                    />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-medium leading-7 text-[#191f33] transition-colors group-hover:text-[#0a65cc] md:text-xl md:leading-8">
                        {job.title}
                      </h3>
                      <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-sm text-[#0a65cc]">
                        {job.type}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#636a80]">
                      <span className="font-semibold text-[#18191c]">{job.company_name}</span>
                      <span>{job.location}</span>
                      <span>{job.salary}</span>
                      <span>{job.remaining_days} Days Remaining</span>
                    </div>
                  </div>
                </Link>
                <ApplyButton
                  job={{
                    id: job.id,
                    title: job.title,
                    type: job.type,
                    location: job.location,
                    salary: job.salary,
                    company_name: job.company_name,
                  }}
                  variant="secondary"
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

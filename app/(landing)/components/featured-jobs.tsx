"use client";

import Image from "next/image";
import { Container } from "./container";
import { ArrowRightIcon } from "./home-icons";
import { SectionHeading } from "./section-heading";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  const { user, profile } = useAuth();
  const router = useRouter();
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`applied_jobs_${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAppliedJobIds(parsed.map((j: any) => j.id));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);

  const handleApply = (job: DbJob) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (profile && profile.role !== "candidate") {
      alert("Only Candidates can apply for jobs.");
      return;
    }

    const key = `applied_jobs_${user.id}`;
    const saved = localStorage.getItem(key);
    let appliedList = [];
    if (saved) {
      try {
        appliedList = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (appliedList.some((j: any) => j.id === job.id)) {
      alert("You have already applied for this job!");
      return;
    }

    const updated = [
      ...appliedList,
      {
        id: job.id,
        title: job.title,
        type: job.type,
        location: job.location,
        salary: job.salary,
        company_name: job.company_name,
        applied_at: new Date().toISOString(),
      },
    ];

    localStorage.setItem(key, JSON.stringify(updated));
    setAppliedJobIds([...appliedJobIds, job.id]);
    alert(`Successfully applied for the position of ${job.title} at ${job.company_name}!`);
  };

  return (
    <section className="py-12 md:py-16 lg:py-[100px]">
      <Container>
        <SectionHeading title="Featured job" />
        {initialJobs.length === 0 ? (
          <p className="text-center text-sm text-[#767f8c] py-8 border border-dashed border-[#e4e5e8] rounded-lg">
            No jobs found matching your criteria.
          </p>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {initialJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div
                  className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:flex-row md:items-center md:justify-between md:gap-5 md:p-6 lg:p-8"
                  key={job.id}
                >
                  <div className="flex gap-4 md:gap-5">
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
                        <h3 className="text-lg font-medium leading-7 text-[#191f33] md:text-xl md:leading-8">
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
                  </div>
                  <button
                    onClick={() => handleApply(job)}
                    className={`flex cursor-pointer items-center justify-center gap-3 rounded-[3px] px-6 py-3 font-semibold transition-colors ${
                      isApplied
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-[#e7f0fa] text-[#0a65cc] hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white"
                    }`}
                    type="button"
                    disabled={isApplied}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                    {!isApplied && <ArrowRightIcon />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};

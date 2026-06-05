"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { CareerLinkLogo } from "@/components/common/career-link-logo";

interface AppliedJob {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  company_name: string;
  applied_at: string;
}

export default function CandidateDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);

  useEffect(() => {
    // Load applied jobs from localStorage
    const saved = localStorage.getItem(`applied_jobs_${profile?.id}`);
    if (saved) {
      try {
        setAppliedJobs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [profile?.id]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4]/60 font-sans text-[#18191c]">
      {/* Navbar */}
      <header className="border-b border-[#e4e5e8] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <CareerLinkLogo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#5e6670]">
              Candidate Panel
            </span>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-[3px] border border-[#cee0f5] px-4 py-2 text-sm font-semibold text-[#0a65cc] transition-colors hover:bg-[#e7f0fa]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-[#e7f0fa] text-2xl font-bold text-[#0a65cc]">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#191f33]">
                {profile?.full_name || "Job Seeker"}
              </h2>
              <p className="text-sm text-[#767f8c]">@{profile?.username || "username"}</p>
              <div className="mt-2 rounded-full bg-[#e8f1ff] px-3 py-1 text-xs font-medium text-[#0a65cc]">
                Job Seeker
              </div>
            </div>

            <hr className="my-6 border-[#e4e5e8]" />

            <div className="space-y-4">
              <div>
                <span className="text-xs text-[#767f8c] uppercase font-bold tracking-wider">Email Address</span>
                <p className="mt-1 text-sm font-medium text-[#191f33] break-all">{profile?.email}</p>
              </div>
              <div>
                <span className="text-xs text-[#767f8c] uppercase font-bold tracking-wider">Member Since</span>
                <p className="mt-1 text-sm font-medium text-[#191f33]">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"}
                </p>
              </div>
            </div>
            
            <Link
              href="/jobs"
              className="mt-6 flex w-full justify-center rounded bg-[#0a65cc] py-3 text-sm font-semibold text-white hover:bg-[#095bb8] transition-colors"
            >
              Browse & Search Jobs
            </Link>
          </div>

          {/* Right Column - Stats & Applied Jobs */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded bg-[#e7f0fa] text-[#0a65cc]">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <div>
                  <span className="block text-2xl font-bold text-[#191f33]">{appliedJobs.length}</span>
                  <span className="text-sm text-[#767f8c]">Total Applied Jobs</span>
                </div>
              </div>
              
              <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded bg-green-50 text-green-600">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <span className="block text-2xl font-bold text-[#191f33]">Active</span>
                  <span className="text-sm text-[#767f8c]">Profile Status</span>
                </div>
              </div>
            </div>

            {/* Applied Jobs List */}
            <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#191f33] mb-4">Jobs You Applied For</h3>

              {appliedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto size-12 text-[#9199a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2zM6 16H4a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2z" />
                  </svg>
                  <p className="mt-4 text-sm text-[#767f8c]">You haven&apos;t applied for any jobs yet.</p>
                  <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#0a65cc] hover:underline">
                    Find jobs now &rarr;
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#edeff5]">
                  {appliedJobs.map((job) => (
                    <div key={job.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-[#191f33]">{job.title}</h4>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5e6670]">
                          <span>{job.company_name}</span>
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-[#e8f1ff] px-2.5 py-1 text-xs text-[#0a65cc]">
                          {job.type}
                        </span>
                        <span className="text-xs text-[#767f8c]">
                          Applied {new Date(job.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

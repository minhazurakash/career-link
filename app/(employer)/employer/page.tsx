"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CareerLinkLogo } from "@/components/common/career-link-logo";

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  company_name: string;
  remaining_days: number;
  created_at: string;
}

export default function EmployerDashboard() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmployerJobs = async () => {
    if (!user) return;
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setJobs(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handlePostJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const salary = formData.get("salary") as string;
    const companyName = formData.get("companyName") as string;
    const description = formData.get("description") as string;
    const logoUrl = formData.get("logoUrl") as string || "/home-assets/job-logo-black.svg";
    const logoBg = formData.get("logoBg") as string || "#191f33";

    if (!title || !type || !location || !salary || !companyName) {
      setErrorMsg("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("jobs").insert([
        {
          title,
          type,
          location,
          salary,
          company_name: companyName,
          description,
          logo_url: logoUrl,
          logo_bg: logoBg,
          created_by: user?.id,
          remaining_days: 30,
        },
      ]);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Job posted successfully!");
        setShowPostForm(false);
        fetchEmployerJobs(); // Refresh list
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to post job.");
    } finally {
      setIsSubmitting(false);
    }
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
              Employer Panel
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#191f33]">
              Welcome, {profile?.full_name || "Employer"}
            </h1>
            <p className="text-sm text-[#767f8c]">
              Manage your job listings and find the right candidates.
            </p>
          </div>
          <button
            onClick={() => {
              setShowPostForm(!showPostForm);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="cursor-pointer rounded-[3px] bg-[#0a65cc] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#095bb8]"
          >
            {showPostForm ? "Cancel Posting" : "Post a New Job"}
          </button>
        </div>

        {/* Post Job Form */}
        {showPostForm && (
          <div className="mb-8 rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#191f33] mb-4">Post a New Job Listing</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
              {errorMsg && (
                <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {errorMsg}
                </div>
              )}
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Job Title *</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Senior Frontend Developer"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Company Name *</label>
                  <input
                    name="companyName"
                    required
                    placeholder="e.g. Acme Corp"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Job Type *</label>
                  <select
                    name="type"
                    required
                    defaultValue="Full Time"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Contract Base">Contract Base</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Location *</label>
                  <input
                    name="location"
                    required
                    placeholder="e.g. San Francisco, CA"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Salary Range *</label>
                  <input
                    name="salary"
                    required
                    placeholder="e.g. $80K - $100K"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Logo Style / Color (Hex)</label>
                  <input
                    name="logoBg"
                    placeholder="e.g. #eb524f"
                    defaultValue="#eb524f"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Logo Preset</label>
                  <select
                    name="logoUrl"
                    defaultValue="/home-assets/job-logo-red.svg"
                    className="h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                  >
                    <option value="/home-assets/job-logo-red.svg">Red Icon</option>
                    <option value="/home-assets/job-logo-blue.svg">Blue Icon</option>
                    <option value="/home-assets/job-logo-green.svg">Green Icon</option>
                    <option value="/home-assets/job-logo-black.svg">Dark Icon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#767f8c] uppercase tracking-wider mb-2">Job Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the job duties, requirements, benefits, etc."
                  className="w-full rounded border border-[#e4e5e8] bg-white p-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-[#0a65cc] py-3 font-semibold text-white hover:bg-[#095bb8] transition-colors disabled:bg-[#0a65cc]/50"
              >
                {isSubmitting ? "Posting Job..." : "Publish Job Listing"}
              </button>
            </form>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 rounded bg-green-50 p-3 text-sm text-green-600 border border-green-200">
            {successMsg}
          </div>
        )}

        {/* Listings Section */}
        <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#191f33] mb-4">Your Active Job Listings</h2>

          {loadingJobs ? (
            <div className="flex flex-col items-center py-12">
              <div className="size-8 animate-spin rounded-full border-4 border-[#0a65cc] border-t-transparent"></div>
              <p className="mt-4 text-sm text-[#767f8c]">Loading listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto size-12 text-[#9199a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="mt-4 text-sm text-[#767f8c]">You haven&apos;t posted any job listings yet.</p>
              <button
                onClick={() => setShowPostForm(true)}
                className="mt-4 text-sm font-semibold text-[#0a65cc] hover:underline"
              >
                Post your first job &rarr;
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-[#5e6670]">
                <thead>
                  <tr className="border-b border-[#edeff5] text-xs font-bold uppercase text-[#767f8c]">
                    <th className="pb-3 pr-4">Job Title</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Location</th>
                    <th className="pb-3 px-4">Salary</th>
                    <th className="pb-3 px-4">Date Posted</th>
                    <th className="pb-3 pl-4">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeff5]">
                  {jobs.map((job) => (
                    <tr key={job.id} className="group hover:bg-[#f8f9fa]/50">
                      <td className="py-4 pr-4 font-semibold text-[#191f33]">
                        {job.title}
                        <span className="block text-xs font-normal text-[#767f8c]">
                          {job.company_name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-xs text-[#0a65cc]">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">{job.location}</td>
                      <td className="py-4 px-4">{job.salary}</td>
                      <td className="py-4 px-4">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 pl-4 text-xs font-medium text-green-600">
                        {job.remaining_days} Days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

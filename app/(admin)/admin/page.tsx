"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CareerLinkLogo } from "@/components/common/career-link-logo";

interface ProfileItem {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role: string;
  created_at: string;
}

interface JobItem {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  type: string;
}

interface CompanyItem {
  id: string;
  name: string;
  location: string;
}

type TabType = "users" | "jobs" | "companies";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<ProfileItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const { data: userData, error: userErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!userErr) setUsers(userData || []);

      // Fetch Jobs
      const { data: jobData, error: jobErr } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!jobErr) setJobs(jobData || []);

      // Fetch Companies
      const { data: companyData, error: compErr } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (!compErr) setCompanies(companyData || []);
    } catch (e) {
      console.error("Failed to fetch admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user profile?")) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) {
        alert(error.message);
      } else {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) {
        alert(error.message);
      } else {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) {
        alert(error.message);
      } else {
        setCompanies(companies.filter((c) => c.id !== id));
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete company");
    } finally {
      setActionLoading(null);
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
            <span className="rounded bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
              Admin System
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#191f33]">
            Welcome Admin, {profile?.full_name || "Administrator"}
          </h1>
          <p className="text-sm text-[#767f8c]">
            System-wide console to manage users, job postings, and companies.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded bg-[#e8f1ff] text-[#0a65cc]">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <div>
              <span className="block text-2xl font-bold text-[#191f33]">{users.length}</span>
              <span className="text-sm text-[#767f8c]">Active Profiles</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded bg-blue-50 text-blue-600">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <div>
              <span className="block text-2xl font-bold text-[#191f33]">{jobs.length}</span>
              <span className="text-sm text-[#767f8c]">Job Listings</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded bg-purple-50 text-purple-600">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <div>
              <span className="block text-2xl font-bold text-[#191f33]">{companies.length}</span>
              <span className="text-sm text-[#767f8c]">Registered Companies</span>
            </div>
          </div>
        </div>

        {/* Console Box */}
        <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-[#edeff5] mb-6 gap-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`cursor-pointer pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "users"
                  ? "border-[#0a65cc] text-[#0a65cc]"
                  : "border-transparent text-[#767f8c] hover:text-[#18191c]"
              }`}
            >
              Manage Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`cursor-pointer pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "jobs"
                  ? "border-[#0a65cc] text-[#0a65cc]"
                  : "border-transparent text-[#767f8c] hover:text-[#18191c]"
              }`}
            >
              Manage Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`cursor-pointer pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "companies"
                  ? "border-[#0a65cc] text-[#0a65cc]"
                  : "border-transparent text-[#767f8c] hover:text-[#18191c]"
              }`}
            >
              Manage Companies ({companies.length})
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="size-8 animate-spin rounded-full border-4 border-[#0a65cc] border-t-transparent"></div>
              <p className="mt-4 text-sm text-[#767f8c]">Loading system data...</p>
            </div>
          ) : (
            <div>
              {/* Tab 1: Users */}
              {activeTab === "users" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-[#5e6670]">
                    <thead>
                      <tr className="border-b border-[#edeff5] text-xs font-bold uppercase text-[#767f8c]">
                        <th className="pb-3 pr-4">Name / Username</th>
                        <th className="pb-3 px-4">Email</th>
                        <th className="pb-3 px-4">Role</th>
                        <th className="pb-3 px-4">Joined Date</th>
                        <th className="pb-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeff5]">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#f8f9fa]/50">
                          <td className="py-4 pr-4 font-semibold text-[#191f33]">
                            {u.full_name || "No Name"}
                            <span className="block text-xs font-normal text-[#767f8c]">
                              @{u.username || "username"}
                            </span>
                          </td>
                          <td className="py-4 px-4">{u.email}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                u.role === "admin"
                                  ? "bg-red-50 text-red-600"
                                  : u.role === "employer"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-[#e8f1ff] text-[#0a65cc]"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            {u.role !== "admin" ? (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={actionLoading === u.id}
                                className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                {actionLoading === u.id ? "Deleting..." : "Delete"}
                              </button>
                            ) : (
                              <span className="text-xs text-[#9199a3]">Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Jobs */}
              {activeTab === "jobs" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-[#5e6670]">
                    <thead>
                      <tr className="border-b border-[#edeff5] text-xs font-bold uppercase text-[#767f8c]">
                        <th className="pb-3 pr-4">Job Title</th>
                        <th className="pb-3 px-4">Company</th>
                        <th className="pb-3 px-4">Type</th>
                        <th className="pb-3 px-4">Location</th>
                        <th className="pb-3 px-4">Salary</th>
                        <th className="pb-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeff5]">
                      {jobs.map((j) => (
                        <tr key={j.id} className="hover:bg-[#f8f9fa]/50">
                          <td className="py-4 pr-4 font-semibold text-[#191f33]">
                            {j.title}
                          </td>
                          <td className="py-4 px-4">{j.company_name}</td>
                          <td className="py-4 px-4">
                            <span className="rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-xs text-[#0a65cc]">
                              {j.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">{j.location}</td>
                          <td className="py-4 px-4">{j.salary}</td>
                          <td className="py-4 pl-4 text-right">
                            <button
                              onClick={() => handleDeleteJob(j.id)}
                              disabled={actionLoading === j.id}
                              className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {actionLoading === j.id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Companies */}
              {activeTab === "companies" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-[#5e6670]">
                    <thead>
                      <tr className="border-b border-[#edeff5] text-xs font-bold uppercase text-[#767f8c]">
                        <th className="pb-3 pr-4">Company Name</th>
                        <th className="pb-3 px-4">Location</th>
                        <th className="pb-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeff5]">
                      {companies.map((c) => (
                        <tr key={c.id} className="hover:bg-[#f8f9fa]/50">
                          <td className="py-4 pr-4 font-semibold text-[#191f33]">
                            {c.name}
                          </td>
                          <td className="py-4 px-4">{c.location}</td>
                          <td className="py-4 pl-4 text-right">
                            <button
                              onClick={() => handleDeleteCompany(c.id)}
                              disabled={actionLoading === c.id}
                              className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {actionLoading === c.id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

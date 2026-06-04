"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { resolveCompanyForJob } from "@/lib/resolve-company";
import { CareerLinkLogo } from "@/components/common/career-link-logo";
import { useDialog } from "@/components/dialog/dialog-provider";
import type { CompanyOption, NewCompanyFields } from "@/components/dashboard/company-picker";
import { COMPANY_LOGO_PRESETS } from "@/components/dashboard/constants";
import {
  CompanyFormFields,
  emptyCompanyForm,
  type CompanyFormValues,
} from "@/components/dashboard/company-form-fields";
import {
  emptyJobForm,
  JobFormFields,
  type JobFormValues,
} from "@/components/dashboard/job-form-fields";

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
  company_id: string | null;
  location: string;
  salary: string;
  type: string;
  description: string | null;
  logo_url: string | null;
  logo_bg: string | null;
  remaining_days: number;
}

interface CompanyItem {
  id: string;
  name: string;
  location: string;
  logo_url: string | null;
  logo_bg: string | null;
}

type TabType = "users" | "jobs" | "companies";

const defaultNewCompany = (): NewCompanyFields => ({
  name: "",
  location: "",
  logo_url: COMPANY_LOGO_PRESETS[0].url,
  logo_bg: "#ea4c89",
});

export default function AdminDashboard() {
  const { profile, user, signOut } = useAuth();
  const { alert, confirm } = useDialog();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<ProfileItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showJobForm, setShowJobForm] = useState<"create" | "edit" | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<JobFormValues>(emptyJobForm());
  const [companyMode, setCompanyMode] = useState<"existing" | "new">("existing");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newCompany, setNewCompany] = useState<NewCompanyFields>(defaultNewCompany());

  const [showCompanyForm, setShowCompanyForm] = useState<"create" | "edit" | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyFormValues>(emptyCompanyForm());

  const companyOptions: CompanyOption[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    location: c.location,
  }));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!userErr) setUsers(userData || []);

      const { data: jobData, error: jobErr } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!jobErr) setJobs(jobData || []);

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const resetJobForm = () => {
    setJobForm(emptyJobForm());
    setCompanyMode(companyOptions.length > 0 ? "existing" : "new");
    setSelectedCompanyId("");
    setNewCompany(defaultNewCompany());
    setEditingJobId(null);
    setShowJobForm(null);
  };

  const resetCompanyForm = () => {
    setCompanyForm(emptyCompanyForm());
    setEditingCompanyId(null);
    setShowCompanyForm(null);
  };

  const openCreateJob = () => {
    resetJobForm();
    setCompanyMode(companyOptions.length > 0 ? "existing" : "new");
    setShowJobForm("create");
    setFormError(null);
    setFormSuccess(null);
    setActiveTab("jobs");
  };

  const openEditJob = (job: JobItem) => {
    setJobForm({
      title: job.title,
      type: job.type,
      location: job.location,
      salary: job.salary,
      description: job.description || "",
      logo_url: job.logo_url || "/home-assets/job-logo-black.svg",
      logo_bg: job.logo_bg || "#191f33",
      remaining_days: String(job.remaining_days ?? 30),
    });
    if (job.company_id) {
      setCompanyMode("existing");
      setSelectedCompanyId(job.company_id);
    } else {
      const match = companyOptions.find((c) => c.name === job.company_name);
      if (match) {
        setCompanyMode("existing");
        setSelectedCompanyId(match.id);
      } else {
        setCompanyMode("new");
        setNewCompany({
          name: job.company_name,
          location: "",
          logo_url: COMPANY_LOGO_PRESETS[0].url,
          logo_bg: "#ea4c89",
        });
      }
    }
    setEditingJobId(job.id);
    setShowJobForm("edit");
    setFormError(null);
    setFormSuccess(null);
    setActiveTab("jobs");
  };

  const openCreateCompany = () => {
    resetCompanyForm();
    setShowCompanyForm("create");
    setFormError(null);
    setFormSuccess(null);
    setActiveTab("companies");
  };

  const openEditCompany = (company: CompanyItem) => {
    setCompanyForm({
      name: company.name,
      location: company.location,
      logo_url: company.logo_url || COMPANY_LOGO_PRESETS[0].url,
      logo_bg: company.logo_bg || "#ea4c89",
    });
    setEditingCompanyId(company.id);
    setShowCompanyForm("edit");
    setFormError(null);
    setFormSuccess(null);
    setActiveTab("companies");
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    if (!jobForm.title.trim() || !jobForm.location.trim() || !jobForm.salary.trim()) {
      setFormError("Please fill in all required job fields.");
      setIsSubmitting(false);
      return;
    }

    const resolved = await resolveCompanyForJob(
      supabase,
      user?.id,
      companyMode,
      selectedCompanyId,
      companyOptions,
      newCompany
    );

    if ("error" in resolved) {
      setFormError(resolved.error);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: jobForm.title.trim(),
      type: jobForm.type,
      location: jobForm.location.trim(),
      salary: jobForm.salary.trim(),
      company_name: resolved.companyName,
      company_id: resolved.companyId,
      description: jobForm.description.trim() || null,
      logo_url: jobForm.logo_url,
      logo_bg: jobForm.logo_bg,
      remaining_days: parseInt(jobForm.remaining_days, 10) || 30,
      created_by: user?.id,
    };

    try {
      if (editingJobId) {
        const { created_by: _c, ...updatePayload } = payload;
        const { error } = await supabase.from("jobs").update(updatePayload).eq("id", editingJobId);
        if (error) setFormError(error.message);
        else {
          setFormSuccess("Job updated.");
          resetJobForm();
          fetchData();
        }
      } else {
        const { error } = await supabase.from("jobs").insert([payload]);
        if (error) setFormError(error.message);
        else {
          setFormSuccess("Job created.");
          resetJobForm();
          fetchData();
        }
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    if (!companyForm.name.trim() || !companyForm.location.trim()) {
      setFormError("Company name and location are required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: companyForm.name.trim(),
      location: companyForm.location.trim(),
      logo_url: companyForm.logo_url,
      logo_bg: companyForm.logo_bg,
      created_by: user?.id,
    };

    try {
      if (editingCompanyId) {
        const { created_by: _c, ...updatePayload } = payload;
        const { error } = await supabase
          .from("companies")
          .update(updatePayload)
          .eq("id", editingCompanyId);
        if (error) setFormError(error.message);
        else {
          setFormSuccess("Company updated.");
          resetCompanyForm();
          fetchData();
        }
      } else {
        const { error } = await supabase.from("companies").insert([payload]);
        if (error) setFormError(error.message);
        else {
          setFormSuccess("Company created.");
          resetCompanyForm();
          fetchData();
        }
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save company.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete user profile?",
      message: "This user profile will be removed permanently. This action cannot be undone.",
      variant: "warning",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;

    setActionLoading(id);
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) {
        await alert({ title: "Delete failed", message: error.message, variant: "error" });
      } else {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (e: unknown) {
      await alert({
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Failed to delete user",
        variant: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete job listing?",
      message: "This job will be removed permanently. This action cannot be undone.",
      variant: "warning",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;

    setActionLoading(id);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) {
        await alert({ title: "Delete failed", message: error.message, variant: "error" });
      } else {
        setJobs(jobs.filter((j) => j.id !== id));
        if (editingJobId === id) resetJobForm();
      }
    } catch (e: unknown) {
      await alert({
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Failed to delete job",
        variant: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete company?",
      message:
        "This company will be removed permanently. Linked jobs will lose their company reference.",
      variant: "warning",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;

    setActionLoading(id);
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) {
        await alert({ title: "Delete failed", message: error.message, variant: "error" });
      } else {
        setCompanies(companies.filter((c) => c.id !== id));
        if (editingCompanyId === id) resetCompanyForm();
      }
    } catch (e: unknown) {
      await alert({
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Failed to delete company",
        variant: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4]/60 font-sans text-[#18191c]">
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#191f33]">
            Welcome Admin, {profile?.full_name || "Administrator"}
          </h1>
          <p className="text-sm text-[#767f8c]">
            Create, update, and delete companies and job postings across the platform.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
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
          <div className="flex items-center gap-4 rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
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
          <div className="flex items-center gap-4 rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
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

        {(formError || formSuccess) && (
          <div className="mb-6 space-y-2">
            {formError && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                {formSuccess}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#edeff5]">
            <div className="flex gap-6">
              {(["users", "jobs", "companies"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer pb-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-[#0a65cc] text-[#0a65cc]"
                      : "border-transparent text-[#767f8c] hover:text-[#18191c]"
                  }`}
                >
                  {tab === "users" && `Manage Users (${users.length})`}
                  {tab === "jobs" && `Manage Jobs (${jobs.length})`}
                  {tab === "companies" && `Manage Companies (${companies.length})`}
                </button>
              ))}
            </div>
            {activeTab === "jobs" && (
              <button
                type="button"
                onClick={openCreateJob}
                className="cursor-pointer rounded-[3px] bg-[#0a65cc] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095bb8]"
              >
                Add Job
              </button>
            )}
            {activeTab === "companies" && (
              <button
                type="button"
                onClick={openCreateCompany}
                className="cursor-pointer rounded-[3px] bg-[#0a65cc] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095bb8]"
              >
                Add Company
              </button>
            )}
          </div>

          {showJobForm && activeTab === "jobs" && (
            <div className="mb-6 rounded-lg border border-[#edeff5] bg-[#f8f9fa]/30 p-5">
              <h3 className="mb-4 font-semibold text-[#191f33]">
                {showJobForm === "edit" ? "Edit Job" : "Create Job"}
              </h3>
              <form onSubmit={handleSaveJob} className="space-y-4">
                <JobFormFields
                  values={jobForm}
                  onChange={setJobForm}
                  companies={companyOptions}
                  companyMode={companyMode}
                  onCompanyModeChange={setCompanyMode}
                  selectedCompanyId={selectedCompanyId}
                  onSelectCompanyId={setSelectedCompanyId}
                  newCompany={newCompany}
                  onNewCompanyChange={setNewCompany}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-[#0a65cc] px-6 py-2 text-sm font-semibold text-white hover:bg-[#095bb8] disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : showJobForm === "edit" ? "Update Job" : "Create Job"}
                  </button>
                  <button
                    type="button"
                    onClick={resetJobForm}
                    className="rounded border border-[#e4e5e8] px-6 py-2 text-sm font-semibold text-[#5e6670]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {showCompanyForm && activeTab === "companies" && (
            <div className="mb-6 rounded-lg border border-[#edeff5] bg-[#f8f9fa]/30 p-5">
              <h3 className="mb-4 font-semibold text-[#191f33]">
                {showCompanyForm === "edit" ? "Edit Company" : "Create Company"}
              </h3>
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <CompanyFormFields values={companyForm} onChange={setCompanyForm} />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-[#0a65cc] px-6 py-2 text-sm font-semibold text-white hover:bg-[#095bb8] disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : showCompanyForm === "edit"
                        ? "Update Company"
                        : "Create Company"}
                  </button>
                  <button
                    type="button"
                    onClick={resetCompanyForm}
                    className="rounded border border-[#e4e5e8] px-6 py-2 text-sm font-semibold text-[#5e6670]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="size-8 animate-spin rounded-full border-4 border-[#0a65cc] border-t-transparent" />
              <p className="mt-4 text-sm text-[#767f8c]">Loading system data...</p>
            </div>
          ) : (
            <>
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
                          <td className="py-4 pr-4 font-semibold text-[#191f33]">{j.title}</td>
                          <td className="py-4 px-4">{j.company_name}</td>
                          <td className="py-4 px-4">
                            <span className="rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-xs text-[#0a65cc]">
                              {j.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">{j.location}</td>
                          <td className="py-4 px-4">{j.salary}</td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => openEditJob(j)}
                                className="cursor-pointer text-sm font-semibold text-[#0a65cc] hover:text-[#095bb8]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteJob(j.id)}
                                disabled={actionLoading === j.id}
                                className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                {actionLoading === j.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

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
                          <td className="py-4 pr-4 font-semibold text-[#191f33]">{c.name}</td>
                          <td className="py-4 px-4">{c.location}</td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => openEditCompany(c)}
                                className="cursor-pointer text-sm font-semibold text-[#0a65cc] hover:text-[#095bb8]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCompany(c.id)}
                                disabled={actionLoading === c.id}
                                className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                {actionLoading === c.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

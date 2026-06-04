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
  emptyJobForm,
  JobFormFields,
  type JobFormValues,
} from "@/components/dashboard/job-form-fields";

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  company_name: string;
  company_id: string | null;
  description: string | null;
  logo_url: string | null;
  logo_bg: string | null;
  remaining_days: number;
  created_at: string;
}

const defaultNewCompany = (): NewCompanyFields => ({
  name: "",
  location: "",
  logo_url: COMPANY_LOGO_PRESETS[0].url,
  logo_bg: "#ea4c89",
});

export default function EmployerDashboard() {
  const { user, profile, signOut } = useAuth();
  const { alert, confirm } = useDialog();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState<JobFormValues>(emptyJobForm);
  const [companyMode, setCompanyMode] = useState<"existing" | "new">("existing");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newCompany, setNewCompany] = useState<NewCompanyFields>(defaultNewCompany);

  const fetchCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name, location")
      .order("name");

    if (!error) {
      setCompanies(data || []);
    }
  }, []);

  const fetchEmployerJobs = useCallback(async () => {
    if (!user) return;
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setJobs(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCompanies();
    fetchEmployerJobs();
  }, [fetchCompanies, fetchEmployerJobs]);

  const resetForm = () => {
    setJobForm(emptyJobForm());
    setCompanyMode(companies.length > 0 ? "existing" : "new");
    setSelectedCompanyId("");
    setNewCompany(defaultNewCompany());
    setEditingJobId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setCompanyMode(companies.length > 0 ? "existing" : "new");
    setShowPostForm(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const openEditForm = (job: Job) => {
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
      const match = companies.find((c) => c.name === job.company_name);
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
    setShowPostForm(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (!jobForm.title || !jobForm.type || !jobForm.location || !jobForm.salary) {
      setErrorMsg("Please fill in all required job fields.");
      setIsSubmitting(false);
      return;
    }

    const resolved = await resolveCompanyForJob(
      supabase,
      user?.id,
      companyMode,
      selectedCompanyId,
      companies,
      newCompany
    );

    if ("error" in resolved) {
      setErrorMsg(resolved.error);
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
        const { error } = await supabase
          .from("jobs")
          .update(updatePayload)
          .eq("id", editingJobId)
          .eq("created_by", user?.id ?? "");

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Job updated successfully!");
          setShowPostForm(false);
          resetForm();
          fetchEmployerJobs();
          fetchCompanies();
        }
      } else {
        const { error } = await supabase.from("jobs").insert([payload]);

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Job posted successfully!");
          setShowPostForm(false);
          resetForm();
          fetchEmployerJobs();
          fetchCompanies();
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save job.");
    } finally {
      setIsSubmitting(false);
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
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id)
        .eq("created_by", user?.id ?? "");

      if (error) {
        await alert({ title: "Delete failed", message: error.message, variant: "error" });
      } else {
        setJobs(jobs.filter((j) => j.id !== id));
        if (editingJobId === id) {
          setShowPostForm(false);
          resetForm();
        }
      }
    } catch (err: unknown) {
      await alert({
        title: "Delete failed",
        message: err instanceof Error ? err.message : "Failed to delete job.",
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
            <span className="text-sm font-medium text-[#5e6670]">Employer Panel</span>
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#191f33]">
              Welcome, {profile?.full_name || "Employer"}
            </h1>
            <p className="text-sm text-[#767f8c]">
              Post jobs linked to companies. Create a company if it is not listed yet.
            </p>
          </div>
          <button
            onClick={() => {
              if (showPostForm) {
                setShowPostForm(false);
                resetForm();
              } else {
                openCreateForm();
              }
            }}
            className="cursor-pointer rounded-[3px] bg-[#0a65cc] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#095bb8]"
          >
            {showPostForm ? "Cancel" : "Post a New Job"}
          </button>
        </div>

        {showPostForm && (
          <div className="mb-8 rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#191f33]">
              {editingJobId ? "Edit Job Listing" : "Post a New Job Listing"}
            </h2>
            <form onSubmit={handleSubmitJob} className="space-y-4">
              {errorMsg && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}
              <JobFormFields
                values={jobForm}
                onChange={setJobForm}
                companies={companies}
                companyMode={companyMode}
                onCompanyModeChange={setCompanyMode}
                selectedCompanyId={selectedCompanyId}
                onSelectCompanyId={setSelectedCompanyId}
                newCompany={newCompany}
                onNewCompanyChange={setNewCompany}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-[#0a65cc] py-3 font-semibold text-white transition-colors hover:bg-[#095bb8] disabled:bg-[#0a65cc]/50"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingJobId
                    ? "Update Job Listing"
                    : "Publish Job Listing"}
              </button>
            </form>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-600">
            {successMsg}
          </div>
        )}

        <div className="rounded-xl border border-[#e4e5e8] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#191f33]">Your Active Job Listings</h2>

          {loadingJobs ? (
            <div className="flex flex-col items-center py-12">
              <div className="size-8 animate-spin rounded-full border-4 border-[#0a65cc] border-t-transparent" />
              <p className="mt-4 text-sm text-[#767f8c]">Loading listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#767f8c]">You haven&apos;t posted any job listings yet.</p>
              <button
                onClick={openCreateForm}
                className="mt-4 text-sm font-semibold text-[#0a65cc] hover:underline"
              >
                Post your first job →
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
                    <th className="pb-3 px-4">Remaining</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeff5]">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#f8f9fa]/50">
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
                      <td className="py-4 px-4 text-xs font-medium text-green-600">
                        {job.remaining_days} Days
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(job)}
                            className="cursor-pointer text-sm font-semibold text-[#0a65cc] hover:text-[#095bb8]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={actionLoading === job.id}
                            className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {actionLoading === job.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
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

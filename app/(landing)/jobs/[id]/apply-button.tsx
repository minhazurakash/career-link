"use client";

import { useAuth } from "@/context/auth-context";
import { useDialog } from "@/components/dialog/dialog-provider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "../../components/home-icons";

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  company_name: string;
}

export function ApplyButton({
  job,
  variant = "primary",
}: {
  job: Job;
  variant?: "primary" | "secondary";
}) {
  const { user, profile } = useAuth();
  const { alert } = useDialog();
  const router = useRouter();
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`applied_jobs_${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIsApplied(parsed.some((j: any) => j.id === job.id));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user, job.id]);

  const handleApply = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (profile && profile.role !== "candidate") {
      await alert({
        title: "Cannot apply",
        message: "Only candidates can apply for jobs.",
        variant: "warning",
      });
      return;
    }

    const key = `applied_jobs_${user.id}`;
    const saved = localStorage.getItem(key);
    let appliedList: any[] = [];
    if (saved) {
      try {
        appliedList = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (appliedList.some((j: any) => j.id === job.id)) {
      await alert({
        title: "Already applied",
        message: "You have already applied for this job.",
        variant: "info",
      });
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
    setIsApplied(true);
    await alert({
      title: "Application submitted",
      message: `You successfully applied for ${job.title} at ${job.company_name}.`,
      variant: "success",
    });
  };

  if (isApplied) {
    return (
      <button
        disabled
        className={`flex cursor-default items-center justify-center gap-2 rounded-[3px] bg-green-100 px-6 font-semibold text-green-700 ${
          variant === "secondary" ? "py-3 md:w-auto" : "w-full py-4 md:w-auto"
        }`}
      >
        ✓ Applied
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={handleApply}
        type="button"
        className="flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[3px] bg-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] transition-colors hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white"
      >
        Apply Now <ArrowRightIcon />
      </button>
    );
  }

  return (
    <button
      onClick={handleApply}
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-[#0a65cc] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#095bb8] md:w-auto"
    >
      Apply Now <ArrowRightIcon />
    </button>
  );
}

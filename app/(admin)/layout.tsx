"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (profile && profile.role !== "admin") {
        if (profile.role === "employer") {
          router.push("/employer");
        } else if (profile.role === "candidate") {
          router.push("/candidate");
        } else {
          router.push("/");
        }
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !user || (profile && profile.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-[#0a65cc] border-t-transparent"></div>
          <p className="text-sm font-medium text-[#5e6670]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { CareerLinkLogo } from "@/components/common/career-link-logo";
import { SocialMediaLogin } from "@/components/common/social-media-login";
import Link from "next/link";
import { AccountTypeSelect } from "./components/account-type-select";
import { HeroPanel } from "./components/hero-panel";
import { ArrowRightIcon } from "./components/icons";
import { TermsCheckbox } from "./components/terms-checkbox";
import { TextField } from "./components/text-field";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

const SignUpPage = () => {
  const router = useRouter();
  const { profile, user, loading } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "admin") {
        router.push("/admin");
      } else if (profile.role === "employer") {
        router.push("/employer");
      } else {
        router.push("/candidate");
      }
    }
  }, [user, profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const accountType = formData.get("accountType") as string; // 'candidate' or 'employers'
    const terms = formData.get("terms") as string; // Checkbox

    if (!fullName || !username || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (!terms) {
      setErrorMsg("You must agree to the Terms of Service and Privacy Policy.");
      setIsSubmitting(false);
      return;
    }

    const mappedRole = accountType === "employers" ? "employer" : "candidate";

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            username,
            role: mappedRole,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        // Check if session is active (implies auto-confirm is on)
        if (data.session) {
          setSuccessMsg("Account created successfully! Redirecting...");
          // Let the useEffect redirect the user
        } else {
          setSuccessMsg("Account created! Please check your email to verify your account.");
          setIsSubmitting(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white font-sans text-[#18191c]">
      <HeroPanel />

      <header className="absolute left-0 top-0 z-20 h-20 w-full lg:h-[100px]">
        <CareerLinkLogo className="absolute left-5 top-1/2 -translate-y-1/2 lg:left-12 xl:left-16 2xl:left-[120px] min-[1800px]:left-[300px]" />
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[536px] flex-col justify-center gap-4 px-5 pb-6 pt-24 lg:mx-0 lg:ml-12 lg:w-[360px] lg:max-w-none lg:px-0 xl:ml-16 xl:w-[440px] 2xl:ml-[120px] 2xl:w-[536px] 2xl:gap-8 2xl:pb-10 2xl:pt-[120px] min-[1800px]:ml-[300px]">
        <div className="flex flex-row items-center justify-between gap-3 2xl:gap-6">
          <div className="space-y-2 2xl:space-y-4">
            <h1 className="text-[26px] font-medium leading-8 text-[#18191c] 2xl:text-[32px] 2xl:leading-10">
              Create account.
            </h1>
            <p className="text-sm leading-5 text-[#5e6670] 2xl:text-base 2xl:leading-6">
              Already have account?
              <Link
                className="cursor-pointer font-medium text-[#0a65cc]"
                href="/auth/login"
              >
                {" "}
                Log In
              </Link>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 2xl:gap-5">
          <div className="flex justify-between items-center gap-3 bg-gray-50 p-2.5 rounded border border-gray-100">
            <span className="text-sm font-medium text-[#464d61]">I want to register as:</span>
            <AccountTypeSelect />
          </div>

          {errorMsg && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded bg-green-50 p-3 text-sm text-green-600 border border-green-200">
              {successMsg}
            </div>
          )}

          <div className="grid gap-3 xl:grid-cols-2 2xl:gap-5">
            <TextField label="Full Name" name="fullName" />
            <TextField label="Username" name="username" />
          </div>
          <TextField label="Email address" name="email" type="email" />
          <TextField label="Password" name="password" type="password" />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          />
          <TermsCheckbox />

          <button
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded bg-[#0a65cc] px-8 py-3 text-sm font-semibold capitalize leading-6 text-white transition-colors hover:bg-[#095bb8] 2xl:h-[56px] 2xl:py-4 2xl:text-base disabled:bg-[#0a65cc]/50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && <ArrowRightIcon />}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center gap-3 2xl:gap-4">
          <span className="text-center text-sm leading-5 text-[#767f8c]">
            or
          </span>
          <div className="grid w-full gap-3 xl:grid-cols-2 2xl:gap-5">
            <SocialMediaLogin action="sign up" provider="facebook" />
            <SocialMediaLogin action="sign up" provider="google" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CareerLinkLogo } from "@/components/common/career-link-logo";
import { Container } from "./container";
import { PhoneIcon, SearchIcon } from "./home-icons";
import { useDialog } from "@/components/dialog/dialog-provider";
import { navLinks } from "./landing-data";

export const TopNavigation = () => {
  const { user, profile, signOut } = useAuth();
  const { alert } = useDialog();
  const router = useRouter();

  const handlePostJobClick = async () => {
    if (!user) {
      router.push("/auth/login");
    } else if (profile?.role === "employer") {
      router.push("/employer");
    } else if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      await alert({
        title: "Employer account required",
        message:
          "Only employers can post job listings. Please log out and sign up as an employer.",
        variant: "warning",
      });
    }
  };

  const getDashboardLink = () => {
    if (profile?.role === "admin") return "/admin";
    if (profile?.role === "employer") return "/employer";
    return "/candidate";
  };

  return (
    <header>
      <div className="hidden border-b border-[#e4e5e8] bg-[#f1f2f4] lg:block">
        <Container>
          <div className="flex h-12 items-center justify-between">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  className={`cursor-pointer text-sm leading-5 ${
                    link.href === "/"
                      ? "border-b-2 border-[#0a65cc] py-3.5 font-medium text-[#0a65cc]"
                      : "text-[#5e6670] hover:text-[#0a65cc]"
                  }`}
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-6 text-sm text-[#18191c]">
              <span className="flex items-center gap-2 font-medium">
                <PhoneIcon className="size-5 text-[#0a65cc]" />
                +1-202-555-0178
              </span>
              <button
                className="flex cursor-pointer items-center gap-2 text-[#5e6670]"
                type="button"
              >
                <Image
                  alt=""
                  className="h-4 w-5 object-cover"
                  height={16}
                  src="/home-assets/flag-us.png"
                  width={20}
                />
                English
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-b border-[#e4e5e8] bg-white">
        <Container>
          <div className="flex min-h-[90px] flex-wrap items-center justify-between gap-4 py-5">
            <div className="flex flex-wrap items-center gap-8">
              <Link href="/">
                <CareerLinkLogo />
              </Link>
              <form
                action="/jobs"
                method="GET"
                className="hidden h-[50px] w-[420px] items-center gap-4 rounded-[5px] border border-[#e4e5e8] px-5 xl:flex"
                role="search"
              >
                <SearchIcon className="size-5 text-[#0a65cc]" />
                <input
                  aria-label="Search jobs by title, keyword, or company"
                  className="min-w-0 flex-1 bg-transparent text-[#18191c] outline-none placeholder:text-[#9199a3]"
                  name="keyword"
                  placeholder="Job title, keyword, company"
                  type="search"
                />
              </form>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    className="cursor-pointer rounded-[3px] border border-[#cee0f5] px-6 py-3 font-semibold capitalize leading-6 text-[#0a65cc]"
                    href={getDashboardLink()}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      router.push("/");
                    }}
                    className="cursor-pointer rounded-[3px] border border-red-200 px-6 py-3 font-semibold capitalize leading-6 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="cursor-pointer rounded-[3px] border border-[#cee0f5] px-6 py-3 font-semibold capitalize leading-6 text-[#0a65cc]"
                    href="/auth/login"
                  >
                    Sign in
                  </Link>
                  <button
                    onClick={handlePostJobClick}
                    className="hidden cursor-pointer rounded-[3px] bg-[#0a65cc] px-6 py-3 font-semibold capitalize leading-6 text-white sm:block"
                    type="button"
                  >
                    Post a Jobs
                  </button>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

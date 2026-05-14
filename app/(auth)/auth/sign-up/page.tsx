import { SocialMediaLogin } from "@/components/common/social-media-login";
import Link from "next/link";
import { AccountTypeSelect } from "./components/account-type-select";
import { HeroPanel } from "./components/hero-panel";
import { ArrowRightIcon } from "./components/icons";
import { LogoMark } from "./components/logo-mark";
import { TermsCheckbox } from "./components/terms-checkbox";
import { TextField } from "./components/text-field";

const SignUpPage = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white font-sans text-[#18191c]">
      <HeroPanel />

      <header className="absolute left-0 top-0 z-20 h-20 w-full lg:h-[100px]">
        <Link
          className="absolute left-5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-2 lg:left-12 xl:left-16 2xl:left-[120px] min-[1800px]:left-[300px]"
          href="/"
        >
          <LogoMark />
          <span className="text-2xl font-semibold leading-10 text-[#18191c]">
            CareerLink
          </span>
        </Link>
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
          <AccountTypeSelect />
        </div>

        <form className="flex flex-col gap-3 2xl:gap-5">
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
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded bg-[#0a65cc] px-8 py-3 text-sm font-semibold capitalize leading-6 text-white transition-colors hover:bg-[#095bb8] 2xl:h-[56px] 2xl:py-4 2xl:text-base"
            type="submit"
          >
            Create account
            <ArrowRightIcon />
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
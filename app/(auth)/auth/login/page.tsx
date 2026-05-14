import { CareerLinkLogo } from "@/components/common/career-link-logo";
import { SocialMediaLogin } from "@/components/common/social-media-login";
import Link from "next/link";
import { HeroPanel } from "./components/hero-panel";
import { ArrowRightIcon } from "./components/icons";
import { RememberRow } from "./components/remember-row";
import { TextField } from "./components/text-field";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white font-sans text-[#18191c]">
      <HeroPanel />

      <header className="absolute left-0 top-0 z-20 h-20 w-full lg:h-[100px]">
        <CareerLinkLogo className="absolute left-5 top-1/2 -translate-y-1/2 lg:left-12 xl:left-16 2xl:left-[120px] min-[1800px]:left-[300px]" />
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[536px] flex-col justify-center gap-7 px-5 pb-10 pt-28 md:gap-8 lg:mx-0 lg:ml-12 lg:w-[360px] lg:max-w-none lg:px-0 lg:pt-[120px] xl:ml-16 xl:w-[440px] 2xl:ml-[120px] 2xl:w-[536px] min-[1800px]:ml-[300px]">
        <div className="space-y-4">
          <h1 className="text-[30px] font-medium leading-9 text-[#18191c] md:text-[32px] md:leading-10">
            Sign in
          </h1>
          <p className="text-base leading-6 text-[#5e6670]">
            Don&apos;t have account
            <Link
              className="cursor-pointer font-medium text-[#0a65cc]"
              href="/auth/sign-up"
            >
              {" "}
              Create Account
            </Link>
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <TextField label="Email address" name="email" type="email" />
          <TextField label="Password" name="password" type="password" />
          <RememberRow />

          <button
            className="flex h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded bg-[#0a65cc] px-8 py-4 text-base font-semibold capitalize leading-6 text-white transition-colors hover:bg-[#095bb8]"
            type="submit"
          >
            Sign in
            <ArrowRightIcon />
          </button>
        </form>

        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-center text-sm leading-5 text-[#767f8c]">
            or
          </span>
          <div className="grid w-full gap-5 xl:grid-cols-2">
            <SocialMediaLogin action="sign in" provider="facebook" />
            <SocialMediaLogin action="sign in" provider="google" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
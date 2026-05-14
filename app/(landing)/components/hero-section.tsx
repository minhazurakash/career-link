import type { ReactNode } from "react";

import Image from "next/image";

import { Container } from "./container";
import { MapPinIcon, SearchIcon } from "./home-icons";
import { stats } from "./landing-data";

export const HeroSection = () => {
  return (
    <section className="bg-[#f1f2f4]/60 py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="max-w-[652px] text-4xl font-medium leading-tight text-[#18191c] md:text-5xl xl:text-[56px] xl:leading-[64px]">
              Find a job that suits your interest & skills.
            </h1>
            <p className="mt-6 max-w-[536px] text-lg leading-7 text-[#5e6670]">
              Aliquam vitae turpis in diam convallis finibus in at risus.
              Nullam in scelerisque leo, eget sollicitudin velit bestibulum.
            </p>

            <form
              className="mt-8 max-w-[780px] rounded-lg border border-[#e4e5e8] bg-white p-3 shadow-[0_12px_40px_rgba(0,44,109,0.04)]"
              role="search"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <SearchInput
                  icon={<SearchIcon />}
                  label="Search jobs by title or keyword"
                  name="keyword"
                  placeholder="Job title, Keyword..."
                  type="search"
                />
                <SearchInput
                  icon={<MapPinIcon />}
                  label="Search by location"
                  name="location"
                  placeholder="Your Location"
                />
                <button
                  className="cursor-pointer w-full rounded bg-[#0a65cc] px-8 py-4 font-semibold capitalize leading-6 text-white"
                  type="submit"
                >
                  Find Job
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm leading-5 text-[#9199a3]">
              Suggestion:{" "}
              <span className="text-[#474c54]">
                Designer, Programing,{" "}
              </span>
              <span className="font-medium text-[#0a65cc]">
                Digital Marketing,
              </span>{" "}
              <span className="text-[#474c54]">Video, Animation.</span>
            </p>
          </div>

          <HeroIllustration />
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              className="flex items-center gap-5 rounded-lg bg-white p-5 shadow-sm"
              key={label}
            >
              <span className="flex size-[72px] items-center justify-center rounded bg-[#e7f0fa] text-[#0a65cc]">
                <Icon className="size-8" />
              </span>
              <span>
                <strong className="block text-2xl font-medium leading-8">
                  {value}
                </strong>
                <span className="text-sm leading-5 text-[#767f8c]">
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

const SearchInput = ({
  icon,
  label,
  name,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  label: string;
  name: string;
  placeholder: string;
  type?: "search" | "text";
}) => (
  <div className="flex h-14 items-center gap-3 rounded bg-white px-4 text-[#9199a3]">
    <span className="text-[#0a65cc]">{icon}</span>
    <input
      aria-label={label}
      className="min-w-0 flex-1 bg-transparent text-[#18191c] outline-none placeholder:text-[#9199a3]"
      name={name}
      placeholder={placeholder}
      type={type}
    />
  </div>
);

const HeroIllustration = () => (
  <div className="relative mx-auto hidden h-[382px] w-full max-w-[492px] lg:block">
    <Image
      alt="Job search illustration"
      className="size-full object-contain"
      height={382}
      priority
      src="/home-assets/banner-hero.png"
      width={492}
    />
  </div>
);

import Image from "next/image";

import { Container } from "./container";
import { ArrowRightIcon } from "./home-icons";
import { jobs } from "./landing-data";
import { SectionHeading } from "./section-heading";

export const FeaturedJobs = () => (
  <section className="py-12 md:py-16 lg:py-[100px]">
    <Container>
      <SectionHeading action title="Featured job" />
      <div className="space-y-4 md:space-y-6">
        {jobs.map(([title, type, location, salary, logo, logoBg]) => (
          <div
            className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:flex-row md:items-center md:justify-between md:gap-5 md:p-6 lg:p-8"
            key={title}
          >
            <div className="flex gap-4 md:gap-5">
              <span
                className="flex size-16 shrink-0 items-center justify-center rounded-md md:size-[68px]"
                style={{ backgroundColor: logoBg }}
              >
                <Image
                  alt=""
                  className="size-7 object-contain"
                  height={28}
                  src={logo}
                  unoptimized
                  width={28}
                />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-medium leading-7 text-[#191f33] md:text-xl md:leading-8">
                    {title}
                  </h3>
                  <span className="rounded-full bg-[#e8f1ff] px-3 py-1 text-sm text-[#0a65cc]">
                    {type}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#636a80]">
                  <span>{location}</span>
                  <span>{salary}</span>
                  <span>4 Days Remaining</span>
                </div>
              </div>
            </div>
            <button
              className="flex cursor-pointer items-center justify-center gap-3 rounded-[3px] bg-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] transition-colors hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white"
              type="button"
            >
              Apply Now
              <ArrowRightIcon />
            </button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

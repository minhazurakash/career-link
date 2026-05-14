import Image from "next/image";

import { Container } from "./container";
import { companies } from "./landing-data";
import { SectionHeading } from "./section-heading";

export const TopCompanies = () => (
  <section className="lg:pb-20">
    <Container>
      <SectionHeading title="Top companies" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map(([name, location, logo, logoBg]) => (
          <div
            className="group cursor-pointer rounded-xl border border-[#edeff5] bg-white p-6 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)]"
            key={name}
          >
            <div className="flex items-start gap-4">
              <span
                className="flex size-14 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: logoBg }}
              >
                <Image
                  alt=""
                  className="size-6 object-contain"
                  height={24}
                  src={logo}
                  unoptimized
                  width={24}
                />
              </span>
              <div>
                <h3 className="text-lg font-medium leading-7 text-[#191f33]">
                  {name}
                </h3>
                <p className="text-sm leading-5 text-[#939aad]">{location}</p>
              </div>
            </div>
            <button
              className="mt-8 w-full cursor-pointer rounded-[3px] bg-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] transition-colors hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white"
              type="button"
            >
              Open Position
            </button>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

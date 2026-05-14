import Link from "next/link";

import { CareerLinkLogo } from "@/components/common/career-link-logo";

import { Container } from "./container";
import { footerGroups } from "./landing-data";

export const Footer = () => {
  return (
    <footer className="bg-[#18191c] text-white">
      <Container>
        <div className="grid gap-8 py-12 md:gap-10 md:py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:py-[100px]">
          <div>
            <CareerLinkLogo dark />
            <p className="mt-6 text-lg leading-7">
              <span className="text-[#5e6670]">Call now:</span> (319) 555-0115
            </p>
            <p className="mt-3 max-w-[312px] text-sm leading-5 text-[#767f8c]">
              6391 Elgin St. Celina, Delaware 10299, New York, United States of
              America
            </p>
          </div>
          {footerGroups.map(([title, ...links]) => (
            <div key={title}>
              <h3 className="text-xl font-medium leading-8">{title}</h3>
              <div className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    className="cursor-pointer text-[#9199a3] hover:text-white"
                    href="#"
                    key={link}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-[#2f3338] py-6">
        <Container>
          <p className="text-sm text-[#767f8c]">
            @ 2024 CareerLink - Job Portal. All rights Reserved
          </p>
        </Container>
      </div>
    </footer>
  );
};

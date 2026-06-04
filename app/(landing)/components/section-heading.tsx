import type { ReactNode } from "react";
import Link from "next/link";

import { ArrowRightIcon } from "./home-icons";

export const SectionHeading = ({
  title,
  action = false,
  actionHref,
}: {
  title: ReactNode;
  action?: boolean;
  actionHref?: string;
}) => (
  <div className="mb-7 flex items-center justify-between gap-4 md:mb-10">
    <h2 className="text-2xl font-medium leading-8 text-[#18191c] md:text-3xl md:leading-10 lg:text-[40px] lg:leading-[48px]">
      {title}
    </h2>
    {action && actionHref ? (
      <Link
        className="hidden cursor-pointer items-center gap-3 rounded-[3px] border border-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] hover:bg-[#e7f0fa] sm:flex"
        href={actionHref}
      >
        View All
        <ArrowRightIcon />
      </Link>
    ) : null}
  </div>
);

import type { ReactNode } from "react";

import { ArrowRightIcon } from "./home-icons";

export const SectionHeading = ({
  title,
  action = false,
}: {
  title: ReactNode;
  action?: boolean;
}) => (
  <div className="mb-10 flex items-center justify-between gap-4">
    <h2 className="text-3xl font-medium leading-10 text-[#18191c] lg:text-[40px] lg:leading-[48px]">
      {title}
    </h2>
    {action ? (
      <button
        className="hidden cursor-pointer items-center gap-3 rounded-[3px] border border-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] sm:flex"
        type="button"
      >
        View All
        <ArrowRightIcon />
      </button>
    ) : null}
  </div>
);

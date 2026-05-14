import type { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-[1320px] px-5 lg:px-8 2xl:px-0">
    {children}
  </div>
);

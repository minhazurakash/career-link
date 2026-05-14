import { Container } from "./container";
import { BriefcaseIcon } from "./home-icons";
import { categories } from "./landing-data";
import { SectionHeading } from "./section-heading";

export const CategorySection = () => (
  <section className="border-b border-[#e4e5e8] py-20 lg:py-[100px]">
    <Container>
      <SectionHeading action title="Popular category" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map(([title, count]) => (
          <div
            className="group flex cursor-pointer items-center gap-4 rounded-xl bg-white p-6 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)]"
            key={title}
          >
            <span className="flex size-[68px] shrink-0 items-center justify-center rounded-lg bg-[#e7f0fa] text-[#0a65cc] transition-colors group-hover:bg-[#0a65cc] group-hover:text-white">
              <BriefcaseIcon className="size-8" />
            </span>
            <span>
              <strong className="block text-lg font-medium leading-7 text-[#18191c] transition-colors group-hover:text-[#0a65cc]">
                {title}
              </strong>
              <span className="text-sm leading-5 text-[#5e6670]">{count}</span>
            </span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

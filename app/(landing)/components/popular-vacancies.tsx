import { Container } from "./container";
import { vacancies } from "./landing-data";
import { SectionHeading } from "./section-heading";

export const PopularVacancies = () => (
  <section className="border-b border-[#e4e5e8] py-20">
    <Container>
      <SectionHeading title="Most Popular Vacancies" />
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {vacancies.map(([title, count]) => (
          <div key={title}>
            <h3 className="cursor-pointer text-lg font-medium leading-7 text-[#18191c] transition-colors hover:text-[#0a65cc] hover:underline">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-5 text-[#767f8c]">{count}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

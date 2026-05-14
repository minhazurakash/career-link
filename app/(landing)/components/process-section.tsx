import { Container } from "./container";
import { processSteps } from "./landing-data";

export const ProcessSection = () => (
  <section className="bg-[#f1f2f4] py-12 md:py-16 lg:py-[100px]">
    <Container>
      <h2 className="mb-8 text-center text-2xl font-medium leading-8 text-[#18191c] md:mb-12 md:text-3xl md:leading-10 lg:text-[40px] lg:leading-[48px]">
        How <strong>CareerLink</strong> work
      </h2>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {processSteps.map(({ icon: Icon, text, title }) => (
          <div
            className="group cursor-pointer rounded-xl p-5 text-center transition-all hover:bg-white hover:shadow-sm md:p-6"
            key={title}
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-[#0a65cc] transition-colors group-hover:bg-[#0a65cc] group-hover:text-white md:size-[72px]">
              <Icon className="size-7 md:size-8" />
            </span>
            <h3 className="mt-4 text-lg font-medium leading-7 md:mt-6">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-5 text-[#767f8c]">{text}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

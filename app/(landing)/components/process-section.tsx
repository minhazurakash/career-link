import { Container } from "./container";
import { processSteps } from "./landing-data";

export const ProcessSection = () => (
  <section className="bg-[#f1f2f4] py-20 lg:py-[100px]">
    <Container>
      <h2 className="mb-12 text-center text-3xl font-medium text-[#18191c] lg:text-[40px] lg:leading-[48px]">
        How <strong>CareerLink</strong> work
      </h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map(({ icon: Icon, text, title }) => (
          <div
            className="group cursor-pointer rounded-xl p-6 text-center transition-all hover:bg-white hover:shadow-sm"
            key={title}
          >
            <span className="mx-auto flex size-[72px] items-center justify-center rounded-full bg-white text-[#0a65cc] transition-colors group-hover:bg-[#0a65cc] group-hover:text-white">
              <Icon className="size-8" />
            </span>
            <h3 className="mt-6 text-lg font-medium leading-7">{title}</h3>
            <p className="mt-3 text-sm leading-5 text-[#767f8c]">{text}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

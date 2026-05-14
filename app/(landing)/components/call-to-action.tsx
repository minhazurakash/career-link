import { Container } from "./container";
import { ArrowRightIcon } from "./home-icons";

export const CallToAction = () => (
  <section className="py-20">
    <Container>
      <div className="grid gap-6 lg:grid-cols-2">
        <CtaCard
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus a dolor convallis efficitur."
          title="Become a Candidate"
        />
        <CtaCard
          dark
          text="Cras in massa pellentesque, mollis ligula non, luctus dui. Morbi sed efficitur dolor."
          title="Become a Employers"
        />
      </div>
    </Container>
  </section>
);

const CtaCard = ({
  dark = false,
  text,
  title,
}: {
  dark?: boolean;
  text: string;
  title: string;
}) => (
  <div
    className={`rounded-xl p-8 lg:p-[50px] ${
      dark ? "bg-[#0851a3] text-white" : "bg-[#e4e5e8] text-[#191f33]"
    }`}
  >
    <h2 className="text-3xl font-medium leading-10">{title}</h2>
    <p
      className={`mt-4 max-w-[312px] text-sm leading-5 ${
        dark ? "text-white/80" : "text-[#636a80]"
      }`}
    >
      {text}
    </p>
    <button
      className="mt-6 flex cursor-pointer items-center gap-3 rounded-[3px] bg-white px-6 py-3 font-semibold capitalize text-[#0a65cc]"
      type="button"
    >
      Register now
      <ArrowRightIcon />
    </button>
  </div>
);

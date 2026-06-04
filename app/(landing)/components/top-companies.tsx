import Image from "next/image";
import { Container } from "./container";
import { SectionHeading } from "./section-heading";

export interface DbCompany {
  id: string;
  name: string;
  location: string;
  logo_url: string | null;
  logo_bg: string;
}

export const TopCompanies = ({ companies }: { companies: DbCompany[] }) => (
  <section className="pb-12 md:pb-16 lg:pb-20">
    <Container>
      <SectionHeading title="Top companies" />
      {companies.length === 0 ? (
        <p className="text-center text-sm text-[#767f8c] py-8 border border-dashed border-[#e4e5e8] rounded-lg">
          No registered companies found.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {companies.map((company) => (
            <div
              className="group cursor-pointer rounded-xl border border-[#edeff5] bg-white p-5 transition-all hover:shadow-[0_12px_48px_rgba(0,44,109,0.1)] md:p-6"
              key={company.id}
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded"
                  style={{ backgroundColor: company.logo_bg || "#f1f2f4" }}
                >
                  <Image
                    alt=""
                    className="size-6 object-contain"
                    height={24}
                    src={company.logo_url || "/home-assets/company-logo-dribbble.svg"}
                    unoptimized
                    width={24}
                  />
                </span>
                <div>
                  <h3 className="text-lg font-medium leading-7 text-[#191f33]">
                    {company.name}
                  </h3>
                  <p className="text-sm leading-5 text-[#939aad]">{company.location}</p>
                </div>
              </div>
              <button
                className="mt-6 w-full cursor-pointer rounded-[3px] bg-[#e7f0fa] px-6 py-3 font-semibold text-[#0a65cc] transition-colors hover:bg-[#0a65cc] hover:text-white group-hover:bg-[#0a65cc] group-hover:text-white md:mt-8"
                type="button"
              >
                Open Position
              </button>
            </div>
          ))}
        </div>
      )}
    </Container>
  </section>
);

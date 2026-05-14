import { BriefcaseDuotoneIcon, BuildingIcon } from "./icons";

const stats = [
  {
    label: "Live Job",
    value: "1,75,324",
    icon: "briefcase",
  },
  {
    label: "Companies",
    value: "97,354",
    icon: "building",
  },
  {
    label: "New Jobs",
    value: "7,532",
    icon: "briefcase",
  },
] as const;

export const HeroPanel = () => {
  return (
    <aside
      className="absolute inset-y-0 right-0 hidden w-[52%] overflow-hidden lg:block"
      style={{
        clipPath: "polygon(6.2% 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#001226",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,18,38,0.16)), conic-gradient(from 90deg, #001226 0deg 90deg, #758293 90deg 180deg, #001226 180deg 270deg, #758293 270deg 360deg)",
          backgroundSize: "100% 100%, 576px 540px",
        }}
      />
      <div className="absolute inset-0 bg-[#001226]/20" />
      <div className="absolute bottom-10 left-[13.8%] w-[78%] 2xl:bottom-20 2xl:w-[560px]">
        <h2 className="mb-6 max-w-full text-2xl font-medium leading-8 text-white xl:text-[32px] xl:leading-10 2xl:mb-[50px] 2xl:text-[40px] 2xl:leading-[48px]">
          Over 1,75,324 candidates waiting for good employees.
        </h2>
        <div className="flex w-full items-start justify-between gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </aside>
  );
};

type StatCardProps = (typeof stats)[number];

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <div className="flex w-[31%] flex-col items-start justify-center gap-3 text-white 2xl:w-[180px] 2xl:gap-6">
      <div className="rounded-lg bg-white/10 p-3 2xl:p-4">
        {icon === "building" ? <BuildingIcon /> : <BriefcaseDuotoneIcon />}
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium leading-6 xl:text-lg xl:leading-7 2xl:text-xl 2xl:leading-8">
          {value}
        </p>
        <p className="text-xs leading-4 opacity-70 2xl:text-sm 2xl:leading-5">
          {label}
        </p>
      </div>
    </div>
  );
};

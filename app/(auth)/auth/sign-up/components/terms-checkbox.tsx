import Link from "next/link";

export const TermsCheckbox = () => {
  return (
    <label className="flex items-center gap-2 2xl:gap-2.5">
      <input
        className="size-4 shrink-0 appearance-none rounded-[3px] border border-[#9dc1eb] bg-white checked:bg-[#0a65cc] 2xl:size-5"
        name="terms"
        type="checkbox"
      />
      <span className="text-xs leading-4 text-[#767f8c] 2xl:text-sm 2xl:leading-5">
        I&apos;ve read and agree with your{" "}
        <Link className="cursor-pointer font-medium text-[#0a65cc]" href="#">
          Terms of Services
        </Link>
      </span>
    </label>
  );
};

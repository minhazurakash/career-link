import { ChevronDownIcon } from "./icons";

export const AccountTypeSelect = () => {
  return (
    <label className="relative h-10 w-[132px] shrink-0 xl:w-[150px] 2xl:h-12">
      <span className="sr-only">Account type</span>
      <select
        className="h-full w-full cursor-pointer appearance-none rounded-md border border-[#e4e5e8] bg-white px-3 pr-8 text-xs leading-5 text-[#464d61] outline-none focus:border-[#9dc1eb] 2xl:px-4 2xl:pr-10 2xl:text-sm"
        defaultValue="employers"
        name="accountType"
      >
        <option value="employers">Employers</option>
        <option value="candidate">Candidate</option>
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#464d61] 2xl:right-[15px]">
        <ChevronDownIcon />
      </span>
    </label>
  );
};

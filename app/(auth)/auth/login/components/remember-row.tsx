export const RememberRow = () => {
  return (
    <div className="flex w-full flex-col gap-3 text-sm leading-5 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2.5 text-[#767f8c]">
        <input
          className="size-5 shrink-0 appearance-none rounded-[3px] border border-[#9dc1eb] bg-white checked:bg-[#0a65cc]"
          name="remember"
          type="checkbox"
        />
        Remember Me
      </label>
      {/* <Link className="cursor-pointer font-medium text-[#0a65cc]" href="#">
        Forgot password
      </Link> */}
    </div>
  );
};

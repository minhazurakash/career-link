import Link from "next/link";

type CareerLinkLogoProps = {
  className?: string;
  dark?: boolean;
  href?: string;
};

export const CareerLinkLogo = ({
  className = "",
  dark = false,
  href = "/",
}: CareerLinkLogoProps) => {
  return (
    <Link
      className={`flex cursor-pointer items-center gap-2 ${className}`}
      href={href}
    >
      <span className="flex size-10 items-center justify-center text-[#0a65cc]">
        <BriefcaseIcon />
      </span>
      <span
        className={`text-2xl font-semibold leading-10 ${
          dark ? "text-white" : "text-[#18191c]"
        }`}
      >
        CareerLink
      </span>
    </Link>
  );
};

const BriefcaseIcon = () => (
  <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
    <path
      d="M8.5 7V5.75C8.5 4.78 9.28 4 10.25 4h3.5c.97 0 1.75.78 1.75 1.75V7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
    />
    <path
      d="M4.75 7h14.5c.97 0 1.75.78 1.75 1.75v8.5c0 .97-.78 1.75-1.75 1.75H4.75C3.78 19 3 18.22 3 17.25v-8.5C3 7.78 3.78 7 4.75 7Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M3 11.25h18M10 11.25v1.25h4v-1.25"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
);

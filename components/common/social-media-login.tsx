type SocialMediaLoginProps = {
  action: "sign in" | "sign up";
  provider: "facebook" | "google";
};

export const SocialMediaLogin = ({
  action,
  provider,
}: SocialMediaLoginProps) => {
  const isGoogle = provider === "google";
  const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
  const providerName = isGoogle ? "Google" : "Facebook";

  return (
    <button
      className="flex h-12 cursor-pointer items-center justify-center gap-3 rounded border border-[#e4e5e8] bg-white px-6 py-3 text-sm leading-5 text-[#474c54] transition-colors hover:border-[#9dc1eb] lg:h-10 lg:px-4 lg:py-2 lg:text-xs 2xl:h-12 2xl:px-6 2xl:py-3 2xl:text-sm"
      type="button"
    >
      {isGoogle ? <GoogleIcon /> : <FacebookIcon />}
      {actionLabel} with {providerName}
    </button>
  );
};

const FacebookIcon = () => (
  <svg
    aria-hidden="true"
    className="size-5"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      d="M11.25 18v-7h2.35l.35-2.75h-2.7V6.5c0-.8.22-1.34 1.36-1.34H14V2.7c-.25-.04-1.11-.11-2.11-.11-2.09 0-3.52 1.27-3.52 3.62v2.04H6V11h2.37v7h2.88Z"
      fill="#1877f2"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    className="size-5"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      d="M18.2 10.2c0-.64-.06-1.26-.17-1.85H10v3.5h4.59a3.92 3.92 0 0 1-1.7 2.57v2.14h2.76c1.62-1.49 2.55-3.69 2.55-6.36Z"
      fill="#4285f4"
    />
    <path
      d="M10 18.5c2.31 0 4.25-.77 5.66-2.08l-2.76-2.14c-.77.52-1.75.82-2.9.82-2.23 0-4.12-1.5-4.79-3.53H2.36v2.21A8.5 8.5 0 0 0 10 18.5Z"
      fill="#34a853"
    />
    <path
      d="M5.21 11.57A5.1 5.1 0 0 1 4.95 10c0-.54.09-1.07.26-1.57V6.22H2.36A8.5 8.5 0 0 0 1.5 10c0 1.37.33 2.67.86 3.78l2.85-2.21Z"
      fill="#fbbc05"
    />
    <path
      d="M10 4.9c1.26 0 2.39.43 3.28 1.28l2.44-2.44C14.25 2.37 12.31 1.5 10 1.5a8.5 8.5 0 0 0-7.64 4.72l2.85 2.21C5.88 6.4 7.77 4.9 10 4.9Z"
      fill="#ea4335"
    />
  </svg>
);

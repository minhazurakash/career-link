export const JOB_TYPES = ["Full Time", "Contract Base", "Internship", "Freelance"] as const;

export const LOGO_PRESETS = [
  { url: "/home-assets/job-logo-red.svg", label: "Red Icon" },
  { url: "/home-assets/job-logo-blue.svg", label: "Blue Icon" },
  { url: "/home-assets/job-logo-green.svg", label: "Green Icon" },
  { url: "/home-assets/job-logo-black.svg", label: "Dark Icon" },
] as const;

export const COMPANY_LOGO_PRESETS = [
  { url: "/home-assets/company-logo-dribbble.svg", label: "Pink" },
  { url: "/home-assets/company-logo-upwork.svg", label: "Green" },
  { url: "/home-assets/company-logo-slack.svg", label: "Slack" },
  { url: "/home-assets/job-logo-blue.svg", label: "Blue" },
] as const;

export const inputClassName =
  "h-11 w-full rounded border border-[#e4e5e8] bg-white px-3 text-sm text-[#18191c] outline-none focus:border-[#9dc1eb]";

export const labelClassName =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-[#767f8c]";

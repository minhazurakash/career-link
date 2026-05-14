import type { ComponentType } from "react";

import {
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "./home-icons";

type LandingIcon = ComponentType<{ className?: string }>;

export const navLinks = [
  "Home",
  "Find Job",
  "Employers",
  "Candidates",
  "Customer Supports",
];

export const stats: Array<{
  label: string;
  value: string;
  icon: LandingIcon;
}> = [
  { label: "Live Job", value: "1,75,324", icon: BriefcaseIcon },
  { label: "Companies", value: "97,354", icon: BuildingIcon },
  { label: "Candidates", value: "38,47,154", icon: UsersIcon },
  { label: "New Jobs", value: "7,532", icon: BriefcaseIcon },
];

export const vacancies = [
  ["Anesthesiologists", "45,904 Open Positions"],
  ["Surgeons", "50,364 Open Positions"],
  ["Obstetricians-Gynecologists", "4,339 Open Positions"],
  ["Orthodontists", "20,079 Open Positions"],
  ["Maxillofacial Surgeons", "74,875 Open Positions"],
  ["Software Developer", "43,359 Open Positions"],
  ["Psychiatrists", "18,599 Open Positions"],
  ["Data Scientist", "28,200 Open Positions"],
  ["Financial Manager", "61,391 Open Positions"],
  ["Management Analysis", "93,046 Open Positions"],
  ["IT Manager", "50,963 Open Positions"],
  ["Operations Research Analysis", "16,627 Open Positions"],
];

export const processSteps: Array<{
  title: string;
  text: string;
  icon: LandingIcon;
}> = [
  {
    title: "Create account",
    text: "Aliquam facilisis egestas sapien, nec tempor leo tristique at.",
    icon: UserPlusIcon,
  },
  {
    title: "Upload CV/Resume",
    text: "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.",
    icon: BriefcaseIcon,
  },
  {
    title: "Find suitable job",
    text: "Phasellus quis eleifend ex. Morbi nec fringilla nibh.",
    icon: SearchIcon,
  },
  {
    title: "Apply job",
    text: "Curabitur sit amet maximus ligula. Nam a nulla ante, nam sodales purus.",
    icon: ArrowRightIcon,
  },
];

export const categories = [
  ["Graphics & Design", "357 Open position"],
  ["Code & Programing", "312 Open position"],
  ["Digital Marketing", "297 Open position"],
  ["Video & Animation", "247 Open position"],
  ["Music & Audio", "204 Open position"],
  ["Account & Finance", "167 Open position"],
  ["Health & Care", "125 Open position"],
  ["Data & Science", "57 Open position"],
];

export const jobs = [
  [
    "Senior UX Designer",
    "Contract Base",
    "Australia",
    "$30K-$35K",
    "/home-assets/job-logo-green.svg",
    "#6fda44",
  ],
  [
    "Software Engineer",
    "Full Time",
    "China",
    "$50K-$70K",
    "/home-assets/job-logo-black.svg",
    "#191f33",
  ],
  [
    "Junior Graphic Designer",
    "Full Time",
    "Canada",
    "$50K-$70K",
    "/home-assets/job-logo-red.svg",
    "#eb524f",
  ],
  [
    "Product Designer",
    "Full Time",
    "United States",
    "$35K-$40K",
    "/home-assets/job-logo-blue.svg",
    "#1877f2",
  ],
  [
    "Marketing Officer",
    "Internship",
    "Germany",
    "$20K-$25K",
    "/home-assets/job-logo-facebook.svg",
    "#1877f2",
  ],
  [
    "Interaction Designer",
    "Freelance",
    "France",
    "$40K-$45K",
    "/home-assets/job-logo-google.svg",
    "#edeff5",
  ],
];

export const companies = [
  [
    "Dribbble",
    "United States",
    "/home-assets/company-logo-dribbble.svg",
    "#ea4c89",
  ],
  ["Upwork", "United States", "/home-assets/company-logo-upwork.svg", "#6fda44"],
  ["Slack", "China", "/home-assets/company-logo-slack.svg", "#edeff5"],
  ["Freepik", "China", "/home-assets/job-logo-blue.svg", "#1e60c6"],
  [
    "Behance",
    "Australia",
    "/home-assets/company-logo-dribbble.svg",
    "#1769ff",
  ],
  ["Google", "Germany", "/home-assets/job-logo-google.svg", "#191f33"],
  ["Twitter", "United States", "/home-assets/job-logo-blue.svg", "#1da1f2"],
  ["Facebook", "United States", "/home-assets/job-logo-facebook.svg", "#1877f2"],
];

export const footerGroups = [
  ["Quick Link", "About", "Contact", "Pricing", "Blog"],
  ["Candidate", "Browse Jobs", "Browse Employers", "Dashboard", "Saved Jobs"],
  ["Employers", "Post a Job", "Browse Candidates", "Dashboard", "Applications"],
  ["Support", "Faqs", "Privacy Policy", "Terms & Conditions"],
];

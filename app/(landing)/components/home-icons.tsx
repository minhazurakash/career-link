type IconProps = {
  className?: string;
};

export const BriefcaseIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
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

export const SearchIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="m20 20-4.4-4.4M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
);

export const MapPinIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M19 10.25c0 5.25-7 9.75-7 9.75s-7-4.5-7-9.75a7 7 0 0 1 14 0Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <path
      d="M12 12.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
);

export const ArrowRightIcon = ({ className = "size-5" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
);

export const PhoneIcon = ({ className = "size-5" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
    <path
      d="M7.15 3.83 8.4 6.67c.17.38.07.82-.24 1.09l-1.17 1c.72 1.48 1.88 2.64 3.36 3.36l1-1.17c.27-.31.71-.41 1.09-.24l2.84 1.25c.43.19.66.67.54 1.13l-.58 2.17c-.11.43-.5.74-.95.74C8.83 16 4 11.17 4 5.81c0-.45.31-.84.74-.95l2.17-.58c.46-.12.94.11 1.13.55Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const UsersIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M16 19c0-2.21-1.8-4-4-4s-4 1.79-4 4M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 11a3 3 0 1 0 0-6M20.5 19c0-1.62-.97-3.02-2.36-3.65"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const BuildingIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M4 20h16M6 20V5.75C6 4.78 6.78 4 7.75 4h5.5c.97 0 1.75.78 1.75 1.75V20M15 9h2.25c.97 0 1.75.78 1.75 1.75V20M9 8h3M9 12h3M9 16h3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const UserPlusIcon = ({ className = "size-6" }: IconProps) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
    <path
      d="M15 19c0-2.21-1.8-4-4-4s-4 1.79-4 4M11 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 8v6M21 11h-6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

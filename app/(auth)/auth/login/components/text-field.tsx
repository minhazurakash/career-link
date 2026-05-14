"use client";

import { useState } from "react";

import { EyeIcon } from "./icons";

type TextFieldProps = {
  label: string;
  name: string;
  type?: "email" | "password" | "text";
};

export const TextField = ({ label, name, type = "text" }: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative block">
      <span className="sr-only">{label}</span>
      <input
        className="h-12 w-full rounded-[5px] border border-[#e4e5e8] bg-white px-4 pr-12 text-base leading-6 text-[#18191c] outline-none transition-colors placeholder:text-[#767f8c] focus:border-[#9dc1eb]"
        name={name}
        placeholder={label}
        type={inputType}
      />
      {isPassword ? (
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-[17px] top-1/2 -translate-y-1/2 cursor-pointer text-[#18191c]"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          <EyeIcon />
        </button>
      ) : null}
    </div>
  );
};

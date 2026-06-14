import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        bg-[#FBEACE]
        border-[#B8926B]
        border-2
        rounded-lg
        px-2
        py-1
        outline-none
        focus:ring-2
        focus:ring-[#5A2E1F]
        ${className}
      `}
      {...props}
    />
  );
}

import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function Select({ children, className = "", ...props }: Props) {
  return (
    <select
      className={`
        bg-[#FBEACE]
        border-[#B8926B]
        border-2
        rounded-lg
        px-4
        py-2.5
        w-full
        text-[#472D20]
        outline-none
        transition-all
        focus:ring-2
        focus:ring-[#472D20]
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

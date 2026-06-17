import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "link";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-[#472D20] text-white hover:bg-[#6B3118]",
    secondary: "bg-[#EAD9B6] text-[#5A2E1F] hover:bg-[#d4c29d]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    link: "font-bold text-[#472D20] hover:text-[#EAD9B6] transition-colors",
  };

  return (
    <button
      className={`
        px-12 py-4 rounded-lg
        transition-all
        text-lg font-semibold
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

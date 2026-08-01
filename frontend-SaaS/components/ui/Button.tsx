import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "link";
  children: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-[#472D20] text-white hover:bg-[#5A2E1F] shadow-sm",
    secondary:
      "bg-[#FBEACE] text-[#472D20] border-2 border-[#B8926B] hover:bg-[#f2dfbc]",
    danger: "bg-[#A83232] text-white hover:bg-[#8F2929] shadow-sm",
    link: "font-bold text-[#472D20] hover:text-[#B8926B] transition-colors bg-transparent px-0 py-0 shadow-none",
  };

  return (
    <button
      disabled={disabled}
      className={`
        rounded-lg
        transition-all
        text-base font-semibold
        flex items-center justify-center
        ${variant !== "link" ? "px-6 py-3" : ""}
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

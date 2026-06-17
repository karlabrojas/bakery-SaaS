import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "link";

  children: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#472D20] text-white hover:bg-[#6B3118]",

    secondary: "bg-[#EAD9B6] text-[#5A2E1F] hover:bg-[#d4c29d]",

    danger: "bg-red-600 text-white hover:bg-red-700",

    link: "font-bold text-[#472D20] hover:text-[#EAD9B6] transition-colors bg-transparent px-0 py-0",
  };

  return (
    <button
      disabled={disabled}
      className={`
        rounded-lg
        transition-all
        text-lg
        font-semibold

        ${variant !== "link" ? "px-12 py-4" : ""}

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

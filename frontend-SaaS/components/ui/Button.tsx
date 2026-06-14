import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#472D20] text-white hover:bg-[#6B3118]",
    secondary: "bg-[#EAD9B6] text-[#5A2E1F]",
    danger: "bg-red-600 text-white hover:bg-red-700",
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

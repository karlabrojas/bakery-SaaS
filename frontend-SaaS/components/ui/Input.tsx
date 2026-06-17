import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
        bg-[#FBEACE]
        border-[#B8926B]
        border-2
        rounded-lg
        px-2
        py-2
        outline-none
        focus:ring-2
        focus:ring-[#5A2E1F]
        ${className}
      `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;

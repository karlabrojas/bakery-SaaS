import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          bg-[#FBEACE]
          border-[#B8926B]
          border-2
          rounded-lg
          px-4
          py-2.5
          text-[#472D20]
          placeholder-[#8C6D53]
          outline-none
          transition-all
          focus:ring-2
          focus:ring-[#472D20]
          focus:border-[#472D20]
          ${className}
        `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;

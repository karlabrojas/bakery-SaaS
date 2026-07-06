import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select({ children, ...props }: Props) {
  return (
    <select
      className="
        border-[#B8926B]
        border-4
        rounded-lg
        px-4
        py-2
        w-full
      "
      {...props}
    >
      {children}
    </select>
  );
}

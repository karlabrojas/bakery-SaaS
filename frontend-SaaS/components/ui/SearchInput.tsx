import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6D53]"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          bg-[#FBEACE]
          border-[#B8926B]
          border-2
          rounded-lg
          text-[#472D20]
          placeholder-[#8C6D53]
          pl-10
          pr-4
          py-2.5
          outline-none
          transition-all
          focus:ring-2
          focus:ring-[#472D20]
        "
      />
    </div>
  );
}

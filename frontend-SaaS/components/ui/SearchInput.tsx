import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-3" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar..."
        className="
          w-full
          bg-[#B8926B]
          border-[#B8926B]
          border-4
          rounded-lg
          text-white
          pl-10
          py-2
          mb-4
        "
      />
    </div>
  );
}

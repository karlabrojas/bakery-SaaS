import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative pt-4">
      <Search size={18} className="absolute left-3 top-8" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar..."
        className="
          w-full
          bg-[#f1e1d1]
          border-[#f2c79d]
          border-4
          rounded-lg
          text-black
          pl-10
          py-2
          mb-4
        "
      />
    </div>
  );
}

"use client";

import { Minus, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange: (quantity: number) => void;
}

export default function ProductCard({
  title,
  description,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onQuantityChange,
}: ProductCardProps) {
  return (
    <Card className="flex flex-row justify-between items-center p-4 bg-white hover:shadow-md transition-shadow border border-stone-100 rounded-xl gap-4">
      <div className="space-y-1 flex-1">
        <h3 className="font-bold text-base text-stone-800 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 max-w-md">
          {description}
        </p>
        <div className="pt-0.5">
          <span className="font-bold text-sm text-[#5A2E1F] bg-[#FAF3E8] px-2 py-0.5 rounded-md font-mono">
            ${price}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 select-none">
        <button
          type="button"
          onClick={onDecrease}
          className="bg-[#B8926B] hover:bg-[#a37f5a] text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm active:scale-90"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>

        <Input
          type="number"
          min={0}
          value={quantity}
          onChange={(e: any) => onQuantityChange(Number(e.target.value))}
          className="w-14 h-8 p-0 text-center font-mono font-bold border-stone-200 text-stone-800 rounded-md focus:border-[#B8926B]"
        />

        <button
          type="button"
          onClick={onIncrease}
          className="bg-[#B8926B] hover:bg-[#a37f5a] text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm active:scale-90"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </Card>
  );
}

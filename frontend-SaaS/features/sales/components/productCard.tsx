"use client";

import { Minus, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange: (quantity: number) => void;
}

export default function ProductCard({
  title,
  description,
  price,
  quantity,
  imageUrl,
  onIncrease,
  onDecrease,
  onQuantityChange,
}: ProductCardProps) {
  return (
    <Card className="w-full flex items-center gap-4 rounded-2xl border border-[#D9C3A9] bg-white p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF4ED] border border-[#D9C3A9] flex items-center justify-center shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-[#8C6D53]">Sin foto</span>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-base font-bold text-[#472D20]">{title}</h3>
          <p className="mt-0.5 text-xs text-[#7C5A42] line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-extrabold text-[#472D20] font-mono">
            ${price.toFixed(2)}
          </span>

          <div className="flex items-center gap-1.5 rounded-xl bg-[#FAF4ED] p-1.5 border border-[#D9C3A9] shadow-xs">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#472D20] text-white transition hover:bg-[#3B281A] active:scale-95"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>

            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/^0+(?=\d)/, "");
                onQuantityChange(value === "" ? 0 : Number(value));
              }}
              className="w-12 border-none bg-transparent p-0 text-center text-sm font-bold text-[#472D20] focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              type="button"
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#472D20] text-white transition hover:bg-[#3B281A] active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

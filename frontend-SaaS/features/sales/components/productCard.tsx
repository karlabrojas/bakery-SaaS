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
    <Card className="w-full flex items-center gap-5 rounded-2xl border border-stone-200 bg-[#FFFCF5] p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm text-stone-400">Sin foto</span>
        )}
      </div>

      <div className="flex flex-col flex-1 h-32 justify-between">
        <div>
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>

          <p className="mt-1 text-sm text-stone-500 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-extrabold text-[#472D20]">
            ${price.toFixed(2)}
          </span>

          <div className="flex items-center gap-2 rounded-full bg-stone-100 px-2 py-2 border border-stone-200 shadow-sm">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B8926B] text-white transition hover:bg-[#a37f5a] active:scale-95"
            >
              <Minus size={22} strokeWidth={3} />
            </button>

            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={quantity}
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key.toLowerCase() === "e"
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/^0+(?=\d)/, "");

                onQuantityChange(value === "" ? 0 : Number(value));
              }}
              className="w-16 border-none bg-transparent p-0 text-center text-xl font-bold text-stone-900 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              type="button"
              onClick={onIncrease}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B8926B] text-white transition hover:bg-[#a37f5a] active:scale-95"
            >
              <Plus size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

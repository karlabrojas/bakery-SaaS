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
    <Card className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>

        <p className="text-gray-600">{description}</p>

        <span className="font-bold text-[#5A2E1F]">${price}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          className="
            bg-[#B8926B]
            rounded-full
            w-10
            h-10
            flex
            items-center
            justify-center
            text-white
          "
        >
          <Minus size={18} />
        </button>

        <Input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
        />

        <button
          onClick={onIncrease}
          className="
            bg-[#B8926B]
            rounded-full
            w-10
            h-10
            flex
            items-center
            justify-center
            text-white
          "
        >
          <Plus size={18} />
        </button>
      </div>
    </Card>
  );
}

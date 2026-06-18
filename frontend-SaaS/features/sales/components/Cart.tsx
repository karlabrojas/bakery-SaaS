"use client";
import Button from "@/components/ui/Button";
import { CartItem } from "../types/cart.type";
import { useRouter } from "next/navigation";
interface Props {
  items: CartItem[];
  total: number;
}

export default function Cart({ items, total }: Props) {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 bg-[#472D20] text-white p-4">
        Carrito
      </h2>
      {items.map((item) => (
        <div
          className="flex justify-between items-center bg-[#FBEACE] p-4 rounded-lg mb-2 border-[#B8926B] border-4"
          key={item.id}
        >
          {item.name} x {item.quantity}
        </div>
      ))}

      <hr />

      <h3>Total: ${total}</h3>

      <div className="mt-6">
        <Button
          className="w-full"
          onClick={() => router.push("/sales/payment")}
        >
          Pagar
        </Button>
      </div>
    </div>
  );
}

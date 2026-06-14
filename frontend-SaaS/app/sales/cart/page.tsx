import Cart from "@/features/sales/components/Cart";

export default function CartPage() {
  return (
    <div className="p-6">
      <Cart items={[]} total={0} />
    </div>
  );
}

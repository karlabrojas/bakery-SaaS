"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import ProductCard from "./productCard";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../store/useCartStore";

export default function NewSaleForm() {
  const router = useRouter();

  const {
    products: productos,
    setProducts: setProductos,
    loading: cargando,
    error,
  } = useProducts();

  const aumentarCantidad = (idProducto: string) => {
    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.id === idProducto
          ? {
              ...producto,
              quantity: producto.quantity + 1,
            }
          : producto,
      ),
    );
  };

  const disminuirCantidad = (idProducto: string) => {
    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.id === idProducto
          ? {
              ...producto,
              quantity: Math.max(0, producto.quantity - 1),
            }
          : producto,
      ),
    );
  };

  const cambiarCantidad = (idProducto: string, cantidad: number) => {
    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.id === idProducto
          ? {
              ...producto,
              quantity: cantidad > 0 ? cantidad : 0,
            }
          : producto,
      ),
    );
  };

  const addItem = useCartStore((state) => state.addItem);

  const clearCart = useCartStore((state) => state.clearCart);

  const continuarVenta = () => {
    clearCart();

    productos
      .filter((producto) => producto.quantity > 0)
      .forEach((producto) => {
        addItem({
          ...producto,
        });
      });

    router.push("/sales/cart");
  };

  const hayProductosSeleccionados = productos.some(
    (producto) => producto.quantity > 0,
  );
  console.log(productos);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 bg-[#472D20] text-white p-4">
        Nueva Venta
      </h2>

      <SearchInput />

      {cargando && (
        <p className="mt-4 text-center text-gray-500">Cargando productos...</p>
      )}

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      {!cargando && !error && (
        <div className="space-y-4 mt-4">
          {productos.map((producto, index) => (
            <ProductCard
              key={producto.id || index}
              title={producto.name}
              description={producto.description}
              price={producto.price}
              quantity={producto.quantity}
              onIncrease={() => aumentarCantidad(producto.id)}
              onDecrease={() => disminuirCantidad(producto.id)}
              onQuantityChange={(cantidad) =>
                cambiarCantidad(producto.id, cantidad)
              }
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button
          className={`w-full ${!hayProductosSeleccionados ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={continuarVenta}
          disabled={!hayProductosSeleccionados}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

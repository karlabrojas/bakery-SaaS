"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import ProductCard from "./productCard";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../store/useCartStore";
import { useState } from "react";

export default function NewSaleForm() {
  const router = useRouter();

  const {
    products: productos = [],
    setProducts: setProductos,
    loading: cargando,
    error,
  } = useProducts();

  const [busqueda, setBusqueda] = useState("");

  const aumentarCantidad = (idProducto: string) => {
    setProductos((productosAnteriores) =>
      (productosAnteriores ?? []).map((producto) =>
        producto.id === idProducto
          ? { ...producto, quantity: (producto.quantity ?? 0) + 1 }
          : producto,
      ),
    );
  };

  const disminuirCantidad = (idProducto: string) => {
    setProductos((productosAnteriores) =>
      (productosAnteriores ?? []).map((producto) =>
        producto.id === idProducto
          ? { ...producto, quantity: Math.max(0, (producto.quantity ?? 0) - 1) }
          : producto,
      ),
    );
  };

  const cambiarCantidad = (idProducto: string, cantidad: number) => {
    setProductos((productosAnteriores) =>
      (productosAnteriores ?? []).map((producto) =>
        producto.id === idProducto
          ? { ...producto, quantity: cantidad > 0 ? cantidad : 0 }
          : producto,
      ),
    );
  };

  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const continuarVenta = () => {
    clearCart();
    (productos ?? [])
      .filter((producto) => (producto.quantity ?? 0) > 0)
      .forEach((producto) => {
        addItem({ ...producto });
      });
    router.push("/sales/cart");
  };

  const hayProductosSeleccionados =
    productos?.some((p) => (p.quantity ?? 0) > 0) ?? false;

  const productosFiltrados = (productos ?? []).filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#FFFCF5] rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
      <div className="bg-[#472D20] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Nueva Venta
        </h2>
        <div className="w-full sm:w-72">
          <SearchInput value={busqueda} onChange={setBusqueda} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {cargando && (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#472D20] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-stone-500">
              Cargando catálogo de productos...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="divide-y divide-stone-100 max-h-[50vh] overflow-y-auto pr-2 space-y-2">
            {(productosFiltrados.length ?? 0) === 0 ? (
              <p className="text-center py-12 text-stone-400 text-sm">
                No se encontraron productos disponibles.
              </p>
            ) : (
              productosFiltrados.map((producto, index) => (
                <div
                  key={producto.id || `prod-${index}`}
                  className="pt-2 first:pt-0"
                >
                  <ProductCard
                    title={producto.name}
                    description={producto.description}
                    price={producto.price}
                    quantity={producto.quantity ?? 0}
                    imageUrl={producto.imageUrl}
                    onIncrease={() => aumentarCantidad(producto.id)}
                    onDecrease={() => disminuirCantidad(producto.id)}
                    onQuantityChange={(cantidad) =>
                      cambiarCantidad(producto.id, cantidad)
                    }
                  />
                </div>
              ))
            )}
          </div>
        )}

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <Button
            className={`w-full sm:w-48 h-16 text-base font-bold shadow-md transition-all ${
              !hayProductosSeleccionados
                ? "opacity-40 cursor-not-allowed"
                : "active:scale-[0.98]"
            }`}
            onClick={continuarVenta}
            disabled={!hayProductosSeleccionados}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

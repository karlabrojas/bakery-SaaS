"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import ProductCard from "./productCard";
import { useProducts } from "../hooks/useProducts";

export default function NewSaleForm() {
  const router = useRouter();

  const {
    products: productos,
    setProducts: setProductos,
    loading: cargando,
    error,
  } = useProducts();

  const aumentarCantidad = (idProducto: number) => {
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

  const disminuirCantidad = (idProducto: number) => {
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

  const cambiarCantidad = (idProducto: number, cantidad: number) => {
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

  const continuarVenta = () => {
    const productosSeleccionados = productos
      .filter((producto) => producto.quantity > 0)
      .map((producto) => ({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        quantity: producto.quantity,
      }));

    if (productosSeleccionados.length === 0) {
      return;
    }

    const datos = encodeURIComponent(
      JSON.stringify(productosSeleccionados),
    );

    router.push(`/sales/cart?items=${datos}`);
  };

  const hayProductosSeleccionados = productos.some(
    (producto) => producto.quantity > 0,
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 bg-[#472D20] text-white p-4">
        Nueva Venta
      </h2>

      <SearchInput />

      {cargando && (
        <p className="mt-4 text-center text-gray-500">
          Cargando productos...
        </p>
      )}

      {error && (
        <p className="mt-4 text-center text-red-500">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <div className="space-y-4 mt-4">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
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
        <Button className={`w-full ${!hayProductosSeleccionados ? "opacity-50 cursor-not-allowed": ""}`} onClick={continuarVenta} disabled={!hayProductosSeleccionados}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
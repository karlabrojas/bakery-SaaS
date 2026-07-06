"use client";

import { useState, useEffect, useRef } from "react";
import { createProduct, updateProduct } from "../services/products.service";
import { Product } from "../types/product.type";
import imageCompression from "browser-image-compression";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: AddProductModalProps) {
  const modoEditar = !!product;

  const inputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");

  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito] = useState(false);

  const [errores, setErrores] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
  });

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("");

    setImagen(null);
    setPreview("");
    setErrorServidor("");
    setExito(false);

    setErrores({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (product) {
      setNombre(product.name);
      setDescripcion(product.description);
      setPrecio(product.price.toString());
      setCategoria(product.category);

      setPreview(product.imageUrl ?? "");

      setImagen(null);
    } else {
      limpiarFormulario();
    }

    setErrorServidor("");
    setExito(false);
  }, [product]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrorServidor("Solo se permiten imágenes JPG, PNG o WEBP.");

      setImagen(null);

      if (modoEditar && product?.imageUrl) {
        setPreview(product.imageUrl);
      } else {
        setPreview("");
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorServidor("La imagen no puede superar los 5 MB.");

      setImagen(null);

      if (modoEditar && product?.imageUrl) {
        setPreview(product.imageUrl);
      } else {
        setPreview("");
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    try {
      setErrorServidor("");

      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
      });

      setImagen(compressedFile as File);

      setPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error(error);

      setErrorServidor("Ocurrió un error al procesar la imagen.");
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
    };

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    }

    if (!precio) {
      nuevosErrores.precio = "El precio es obligatorio";
    } else if (Number(precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor a 0";
    }

    if (!categoria) {
      nuevosErrores.categoria = "La categoría es obligatoria";
    }

    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      return false;
    }

    if (!modoEditar && !imagen) {
      setErrorServidor("Debes seleccionar una imagen.");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    setLoading(true);

    setErrorServidor("");

    try {
      const formData = new FormData();

      formData.append("name", nombre.trim());
      formData.append("description", descripcion.trim());
      formData.append("price", Number(precio).toString());
      formData.append("category", categoria);

      if (imagen) {
        formData.append("image", imagen);
      }

      if (modoEditar && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }

      setExito(true);

      setImagen(null);

      setTimeout(() => {
        limpiarFormulario();

        onSuccess();

        onClose();
      }, 1200);
    } catch (error: any) {
      setErrorServidor(error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        if (!loading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#FFFCF5] rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#472D20] px-8 py-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {modoEditar ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <p className="text-[#FBEACE] mt-2">
              {modoEditar
                ? "Actualiza la información del producto."
                : "Completa la información para registrar un nuevo producto."}
            </p>
          </div>

          <button
            disabled={loading}
            onClick={() => {
              if (!loading) onClose();
            }}
            className="text-white text-2xl hover:opacity-70 transition disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-8">
            {/* Imagen */}
            <div>
              <label className="text-sm font-bold uppercase text-[#472D20]">
                Imagen del producto
              </label>

              <div className="mt-3">
                <label
                  htmlFor="image"
                  className="
                  relative
                  h-72
                  border-2
                  border-dashed
                  border-[#B8926B]
                  rounded-2xl
                  bg-[#FFF8EA]
                  flex
                  flex-col
                  justify-center
                  items-center
                  cursor-pointer
                  hover:bg-[#FBEACE]
                  transition
                  overflow-hidden
                "
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-white rounded-lg px-4 py-2 font-semibold text-sm">
                          Cambiar imagen
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-3">📷</div>

                      <p className="font-semibold text-[#472D20]">
                        Seleccionar imagen
                      </p>

                      <span className="text-sm text-stone-500 mt-2">
                        PNG, JPG o WEBP
                      </span>

                      <span className="text-xs text-stone-400 mt-1">
                        Máximo 5 MB
                      </span>
                    </>
                  )}
                </label>

                <input
                  ref={inputRef}
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImagen}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-[#472D20]">
                  Nombre *
                </label>

                <input
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);

                    setErrores((prev) => ({
                      ...prev,
                      nombre: "",
                    }));
                  }}
                  className="w-full rounded-xl border-2 border-[#EAD9B6] bg-white px-4 py-3 focus:border-[#472D20] outline-none"
                />

                {errores.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#472D20]">
                  Descripción *
                </label>

                <textarea
                  rows={4}
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);

                    setErrores((prev) => ({
                      ...prev,
                      descripcion: "",
                    }));
                  }}
                  className="w-full rounded-xl border-2 border-[#EAD9B6] bg-white px-4 py-3 resize-none focus:border-[#472D20] outline-none"
                />

                {errores.descripcion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errores.descripcion}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-semibold text-[#472D20]">
                    Precio *
                  </label>

                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={precio}
                    onChange={(e) => {
                      setPrecio(e.target.value);

                      setErrores((prev) => ({
                        ...prev,
                        precio: "",
                      }));
                    }}
                    className="w-full rounded-xl border-2 border-[#EAD9B6] bg-white px-4 py-3 focus:border-[#472D20] outline-none"
                  />

                  {errores.precio && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.precio}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#472D20]">
                    Categoría *
                  </label>

                  <select
                    value={categoria}
                    onChange={(e) => {
                      setCategoria(e.target.value);

                      setErrores((prev) => ({
                        ...prev,
                        categoria: "",
                      }));
                    }}
                    className="w-full rounded-xl border-2 border-[#EAD9B6] bg-white px-4 py-3 focus:border-[#472D20] outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="pan_dulce">Pan dulce</option>
                    <option value="pan_salado">Pan salado</option>
                    <option value="pastel">Pastel</option>
                    <option value="galleta">Galleta</option>
                  </select>

                  {errores.categoria && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.categoria}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {(errorServidor || exito) && (
            <div className="mt-6">
              {errorServidor && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                  {errorServidor}
                </div>
              )}

              {exito && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                  {modoEditar
                    ? "Producto actualizado correctamente."
                    : "Producto registrado correctamente."}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            <button
              disabled={loading}
              onClick={() => {
                if (!loading) onClose();
              }}
              className="px-8 py-3 rounded-xl border-2 border-[#B8926B] font-semibold text-[#472D20] hover:bg-[#FBEACE] transition disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleGuardar}
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-[#472D20] text-white font-bold hover:bg-[#5A2E1F] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Guardando..."
                : modoEditar
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

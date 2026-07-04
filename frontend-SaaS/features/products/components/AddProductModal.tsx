"use client";

import { useState } from "react";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoria, setCategoria] = useState("");

    const [errores, setErrores] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
    });

    if (!isOpen) return null;

    const validarFormulario = () => {
        const nuevosErrores = {
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoria: "",
        };

        if (!nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = "La descripcion es obligatoria"
        }

        if (!precio) {
            nuevosErrores.precio = "El precio es obligatorio";
        } else if (Number(precio) <= 0) {
            nuevosErrores.precio = "El precio debe ser mayor a 0";
        }

        if (!stock) {
            nuevosErrores.stock = "El stock es obligatorio";
        } else if (Number(stock) < 0) {
            nuevosErrores.stock = "El stock no puede ser negativo";
        }

        if (!categoria) {
            nuevosErrores.categoria = "La categoría es obligatoria";
        }

        setErrores(nuevosErrores);

        return !Object.values(nuevosErrores).some((error) => error !== "");
    };

    const handleGuardar = () => {
        const formularioValido = validarFormulario();

        if (!formularioValido) return;

        console.log({
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
        });

        onClose();
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold z-10"
                >
                    ✕
                </button>

                <div className="w-full space-y-6 p-6">
                    <div className="relative -mx-6 -mt-6 bg-[#472D20] pl-6 pr-14 py-5 rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-white">Agregar Producto</h2>
                        <p className="text-sm text-[#FBEACE] mt-1 leading-normal">
                            Completa la información para registrar un nuevo producto.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Concha"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                            {errores.nombre && (
                                <p className="text-sm text-red-600">{errores.nombre}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                Descripción
                            </label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej. Pan dulce tradicional"
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                            />
                            {errores.descripcion && (
                                <p className="text-sm text-red-600">{errores.descripcion}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                    Precio *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                                />
                                {errores.precio && (
                                    <p className="text-sm text-red-600">{errores.precio}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                    Stock inicial *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition"
                                />
                                {errores.stock && (
                                    <p className="text-sm text-red-600">{errores.stock}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                Categoría *
                            </label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white"
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="pan_dulce">Pan dulce</option>
                                <option value="pan_salado">Pan salado</option>
                                <option value="pastel">Pastel</option>
                                <option value="galleta">Galleta</option>
                            </select>
                            {errores.categoria && (
                                <p className="text-sm text-red-600">{errores.categoria}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase text-stone-600 tracking-wider">
                                imagen *
                            </label>
                            <input type="file" accept="image/*" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#472D20] transition bg-white" />
                        </div>
                    </div>

                    <div className="border-t border-stone-200/80 pt-5">
                        <button
                            onClick={handleGuardar}
                            className="w-full h-14 text-lg font-bold bg-[#472D20] text-white rounded-xl hover:bg-[#5c3a2a] transition"
                        >
                            Guardar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
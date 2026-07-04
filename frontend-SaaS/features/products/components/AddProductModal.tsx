"use client";

import { useState } from "react";
import { createProduct } from "../services/products.service";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorServidor, setErrorServidor] = useState("");
    const [exito, setExito] = useState(false);

    const [errores, setErrores] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
    });

    if (!isOpen) return null;

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
            nuevosErrores.descripcion = "La descripcion es obligatoria"
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

        return !Object.values(nuevosErrores).some((error) => error !== "");
    };

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setCategoria("");

        setErrores({
            nombre: "",
            precio: "",
            descripcion: "",
            categoria: "",
        });
    };

    const handleGuardar = async () => {
        const formularioValido = validarFormulario();
        if (!formularioValido) return;

        setLoading(true);
        setErrorServidor("");

        try {
            await createProduct({
                name: nombre,
                description: descripcion,
                price: Number(precio),
                category: categoria,
            });

            setExito(true);

            setTimeout(() => {
                setExito(false);
                limpiarFormulario()
                onClose();
            }, 1500);

        } catch (error: any) {
            setErrorServidor(error.message);
        } finally {
            setLoading(false);
        }
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
                        {exito && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl text-center font-medium mb-4">
                                Producto guardado correctamente
                            </div>
                        )}
                        {errorServidor && (
                            <p className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl text-center font-medium mb-4">{errorServidor}</p>
                        )}
                        <button
                            onClick={handleGuardar}
                            disabled={loading}
                            className={`w-full h-14 text-lg font-bold bg-[#472D20] text-white rounded-xl transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#5c3a2a]"
                                }`}
                        >
                            {loading ? "Guardando..." : "Guardar Producto"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
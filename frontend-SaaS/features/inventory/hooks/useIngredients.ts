"use client";

import { useEffect, useState } from "react";
import { obtenerIngredientes, crearIngrediente, actualizarIngrediente, eliminarIngrediente } from "../services/inventory.service";
import { Ingredient } from "../types/inventory.type";

export function useIngredientes() {
    const [ingredientes, setIngredientes] = useState<Ingredient[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarIngredientes = async () => {
        setCargando(true);
        try {
            const datos = await obtenerIngredientes();
            setIngredientes(datos);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarIngredientes();
    }, []);

    const handleCrear = async (datos: { name: string; quantity: number; unit: string; minimum_stock?: number }) => {
        try {
            await crearIngrediente(datos);
            await cargarIngredientes();
        } catch (err: any) {
            throw err;
        }
    };

    const handleActualizar = async (id: string, datos: { name?: string; quantity?: number; unit?: string; minimum_stock?: number }) => {
        try {
            await actualizarIngrediente(id, datos);
            await cargarIngredientes();
        } catch (err: any) {
            throw err;
        }
    };

    const handleEliminar = async (id: string) => {
        try {
            await eliminarIngrediente(id);
            await cargarIngredientes();
        } catch (err: any) {
            throw err;
        }
    };
    return { ingredientes, cargando, error, cargarIngredientes, handleCrear, handleActualizar, handleEliminar };
}
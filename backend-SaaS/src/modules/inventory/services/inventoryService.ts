import { supabase } from "../../../config/supabase";

export class InventoryService {
    static async getAll(bakeryId: string) {
        const { data, error } = await supabase
            .from("inventory")
            .select("*")
            .eq("bakery_id", bakeryId)
            .order("name");

        if (error) throw error;
        return data;
    }

    static async create(bakeryId: string, data: {
        name: string;
        quantity: number;
        unit: string;
        minimum_stock?: number;
    }) {
        const { data: ingredient, error } = await supabase
            .from("inventory")
            .insert({
                bakery_id: bakeryId,
                name: data.name,
                quantity: data.quantity,
                unit: data.unit,
                minimum_stock: data.minimum_stock ?? 0,
            })
            .select()
            .single();

        if (error) throw error;
        return ingredient;
    }

    static async update(id: string, bakeryId: string, data: {
        name?: string;
        quantity?: number;
        unit?: string;
        minimum_stock?: number;
    }) {
        const { data: ingredient, error } = await supabase
            .from("inventory")
            .update(data)
            .eq("id", id)
            .eq("bakery_id", bakeryId)
            .select()
            .single();

        if (error) throw error;
        return ingredient;
    }

    static async delete(id: string, bakeryId: string) {
        const { error } = await supabase
            .from("inventory")
            .delete()
            .eq("id", id)
            .eq("bakery_id", bakeryId);

        if (error) throw error;
        return { message: "Ingrediente eliminado correctamente" };
    }
}
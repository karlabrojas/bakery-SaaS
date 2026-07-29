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
    }) {
        const { data: ingredient, error } = await supabase
            .from("inventory")
            .insert({
                bakery_id: bakeryId,
                name: data.name,
                quantity: data.quantity,
                unit: data.unit,
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
}
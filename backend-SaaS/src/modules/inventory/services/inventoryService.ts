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

    static async createMovement(bakeryId: string, data: {
        inventory_id: number;
        quantity: number;
        reason?: string;
        movement_date: string;
    }) {
        
        const { data: movement, error } = await supabase
            .from("inventory_movements")
            .insert({
                inventory_id: data.inventory_id,
                bakery_id: bakeryId,
                quantity: data.quantity,
                movement_type: "ENTRADA",
                reason: data.reason ?? null,
                movement_date: data.movement_date,
            })
            .select()
            .single();

        if (error) throw error;

        const { data: ingrediente, error: errGet } = await supabase
            .from("inventory")
            .select("quantity")
            .eq("id", data.inventory_id)
            .single();

        if (errGet) throw errGet;

        const nuevaCantidad = Number(ingrediente.quantity) + Number(data.quantity);

        const { error: errUpdate } = await supabase
            .from("inventory")
            .update({ quantity: nuevaCantidad })
            .eq("id", data.inventory_id);

        if (errUpdate) throw errUpdate;

        return movement;
    }

    static async getMovements(bakeryId: string, inventoryId?: number) {
        let query = supabase
            .from("inventory_movements")
            .select("*")
            .eq("bakery_id", bakeryId)
            .order("movement_date", { ascending: false });

        if (inventoryId) {
            query = query.eq("inventory_id", inventoryId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
}
import { supabase } from "../../../config/supabase";

export class CustomerService {
    static async getAll(bakeryId: string) {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("bakery_id", bakeryId)
            .order("name");

        if (error) throw error;
        return data;
    }

    static async create(bakeryId: string, data: {
        name: string;
        phone: string;
    }) {
        const { data: customer, error } = await supabase
            .from("customers")
            .insert({
                bakery_id: bakeryId,
                name: data.name,
                phone: data.phone ?? null,
            })
            .select()
            .single();

        if (error) throw error;
        return customer;
    }
}
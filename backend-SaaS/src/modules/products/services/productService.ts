import { supabase } from "../../../config/supabase";

export class ProductService {
  static async getAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      throw error;
    }

    return data;
  }
}

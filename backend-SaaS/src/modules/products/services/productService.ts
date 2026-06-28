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

    const products = data.map((product) => {
      let imageUrl = null;

      if (product.imagen_path) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(product.imagen_path);

        imageUrl = data.publicUrl;
      }

      return {
        ...product,
        imageUrl,
      };
    });

    return products;
  }
}

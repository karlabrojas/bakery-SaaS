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

  static async create(data: {
    name: string;
    description: string;
    price: number;
    category: string;
  }) {
    const { data: existing, error: searchError } = await supabase
      .from("products")
      .select("id")
      .ilike("name", data.name)
      .eq("is_active", true)
      .single();

    if (existing) {
      throw new Error("Ya existe un producto con ese nombre");
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return product;
  }

  static async update(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
  }) {
    if (data.name) {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .ilike("name", data.name)
        .eq("is_active", true)
        .neq("id", id) 
        .maybeSingle();

      if (existing) {
        throw new Error("Ya existe un producto con ese nombre");
      }
    }

    const { data: product, error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return product;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false }) 
      .eq("id", id);

    if (error) throw error;

    return { message: "Producto eliminado correctamente" };
  }


}

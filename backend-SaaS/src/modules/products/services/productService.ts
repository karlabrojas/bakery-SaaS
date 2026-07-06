import { supabase } from "../../../config/supabase";
import { StorageService } from "../../storage/Storage.service";

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
}

interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}

export class ProductService {
  static async getAll(bakeryId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("bakery_id", bakeryId)
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    return data.map((product: { imagen_path: string | null; }) => ({
      ...product,
      imageUrl: StorageService.getPublicUrl(product.imagen_path),
    }));
  }
  static async getById(id: string, bakeryId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .eq("is_active", true)
      .single();
    if (error) {
      throw new Error("Producto no encontrado");
    }
    return {
      ...data,
      imageUrl: StorageService.getPublicUrl(data.imagen_path),
    };
  }
  static async create(
    bakeryId: string,
    body: CreateProductDto,
    file?: Express.Multer.File,
  ) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("bakery_id", bakeryId)
      .ilike("name", body.name)
      .eq("is_active", true)
      .maybeSingle();
    if (existing) {
      throw new Error("Ya existe un producto con ese nombre.");
    }
    let imagePath: string | null = null;
    if (file) {
      imagePath = await StorageService.uploadProductImage(file);
    }
    const { data, error } = await supabase
      .from("products")
      .insert({
        bakery_id: bakeryId,
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        imagen_path: imagePath,
        is_active: true,
      })
      .select()
      .single();
    if (error) {
      if (imagePath) {
        await StorageService.deleteImage(imagePath);
      }
      throw error;
    }
    return {
      ...data,
      imageUrl: StorageService.getPublicUrl(data.imagen_path),
    };
  }

  //****   */
  static async update(
    id: string,
    bakeryId: string,
    body: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .eq("is_active", true)
      .single();
    if (error || !product) {
      throw new Error("Producto no encontrado.");
    }
    if (body.name) {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("bakery_id", bakeryId)
        .ilike("name", body.name)
        .neq("id", id)
        .eq("is_active", true)
        .maybeSingle();
      if (existing) {
        throw new Error("Ya existe un producto con ese nombre.");
      }
    }
    let imagePath = product.imagen_path;
    if (file) {
      imagePath = await StorageService.replaceImage(product.imagen_path, file);
    }
    const { data, error: updateError } = await supabase
      .from("products")
      .update({
        ...body,
        imagen_path: imagePath,
      })
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .select()
      .single();
    if (updateError) {
      throw updateError;
    }
    return {
      ...data,
      imageUrl: StorageService.getPublicUrl(data.imagen_path),
    };
  }
  static async delete(id: string, bakeryId: string) {
    const { data: product, error } = await supabase
      .from("products")
      .select("imagen_path")
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .single();
    if (error || !product) {
      throw new Error("Producto no encontrado.");
    }
    if (product.imagen_path) {
      await StorageService.deleteImage(product.imagen_path);
    }
    const { error: deleteError } = await supabase
      .from("products")
      .update({
        is_active: false,
        imagen_path: null,
      })
      .eq("id", id)
      .eq("bakery_id", bakeryId);
    if (deleteError) {
      throw deleteError;
    }
    return {
      message: "Producto eliminado correctamente.",
    };
  }
}

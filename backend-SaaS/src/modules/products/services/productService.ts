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
    return data.map((product: { imagen_path: string | null }) => ({
      ...product,
      imageUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PRODUCTS,
        product.imagen_path,
      ),
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
      imageUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PRODUCTS,
        data.imagen_path,
      ),
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
      imagePath = await StorageService.uploadImage(
        file,
        StorageService.BUCKETS.PRODUCTS,
        StorageService.FOLDERS.PRODUCTS,
      );
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
        await StorageService.deleteImage(
          StorageService.BUCKETS.PRODUCTS,
          imagePath,
        );
      }
      throw error;
    }
    return {
      ...data,
      imageUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PRODUCTS,
        data.imagen_path,
      ),
    };
  }

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
      imagePath = await StorageService.replaceImage(
        StorageService.BUCKETS.PRODUCTS,
        StorageService.FOLDERS.PRODUCTS,
        product.imagen_path,
        file,
      );
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
      imageUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PRODUCTS,
        data.imagen_path,
      ),
    };
  }
  static async delete(id: string, bakeryId: string) {
    const { data: saleItems, error: saleError } = await supabase
      .from("sale_items")
      .select("id")
      .eq("product_id", id)
      .limit(1);

    if (saleError) throw saleError;

    if (saleItems && saleItems.length > 0) {
      throw new Error("TIENE_VENTAS");
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("imagen_path")
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .single();

    if (error || !product) throw new Error("Producto no encontrado.");

    if (product.imagen_path) {
      await StorageService.deleteImage(
        StorageService.BUCKETS.PRODUCTS,
        product.imagen_path,
      );
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("bakery_id", bakeryId);

    if (deleteError) throw deleteError;

    return { message: "Producto eliminado correctamente." };
  }

  static async getAllIncluyendoInactivos(bakery_id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("bakery_id", bakery_id)
      .order("is_active", { ascending: false })
      .order("name");

    if (error) throw error;

    return data.map((product: { imagen_path: string | null }) => ({
      ...product,
      imageUrl: StorageService.getPublicUrl(
        StorageService.BUCKETS.PRODUCTS,
        product.imagen_path,
      ),
    }));
  }

  static async desactivarProducto(id: string, bakeryId: string) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id)
      .eq("bakery_id", bakeryId);

    if (error) throw error;

    return { message: "Producto desactivado correctamente." };
  }

  static async activarProducto(id: string) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: true })
      .eq("id", id);

    if (error) throw error;

    return { message: "Producto activado correctamente" };
  }

  static async countProducts(bakeryId: string) {
    const { count, error } = await supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("bakery_id", bakeryId)
      .eq("is_active", true);

    if (error) throw error;

    return count ?? 0;
  }
}

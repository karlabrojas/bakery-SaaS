import { supabase } from "../../../config/supabase";
import { CreateSaleDTO } from "../entities/saleItem";

export class SaleService {
  static async getAllByBakery(bakeryId: string) {
    const { data, error } = await supabase
      .from("sales")
      .select(
        `
        *,
        sale_items (*)
      `,
      )
      .eq("bakery_id", bakeryId) // filtro por panadería
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CreateSaleDTO[];
  }

  static async getAllByUser(userId: string) {
    const { data, error } = await supabase
      .from("sales")
      .select(
        `
        *,
        sale_items (*)
      `,
      )
      .eq("customer_id", userId) // filtro por cliente/usuario
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CreateSaleDTO[];
  }

  static async getAll() {
    const { data, error } = await supabase
      .from("sales")
      .select(
        `
        *,
        sale_items (*)
      `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data;
  }

  static async create(data: CreateSaleDTO) {
    const productIds = data.items.map((item) => item.productId);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (error) {
      throw error;
    }

    let totalAmount = 0;

    const saleItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }

      const subtotal = Number(product.price) * item.quantity;

      totalAmount += subtotal;

      return {
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      };
    });

    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert([
        {
          bakery_id: data.bakeryId ?? null,

          customer_id: data.customerId ?? null,

          total_amount: totalAmount,

          payment_method: data.paymentMethod,
        },
      ])
      .select()
      .single();

    if (saleError) {
      throw saleError;
    }

    const itemsToInsert = saleItems.map((item) => ({
      ...item,
      sale_id: sale.id,
    }));

    console.log("ITEMS A INSERTAR");
    console.log(JSON.stringify(itemsToInsert, null, 2));

    const { data: insertedItems, error: itemsError } = await supabase
      .from("sale_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      throw itemsError;
    }

    return {
      sale,
      items: insertedItems,
    };
  }

  static async update(saleId: string, data: CreateSaleDTO, bakery_id: string) {
    const productIds = data.items.map((item) => item.productId);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (error) {
      throw error;
    }

    let totalAmount = 0;

    const saleItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }

      const subtotal = Number(product.price) * item.quantity;

      totalAmount += subtotal;

      return {
        sale_id: saleId,
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      };
    });

    const { data: updatedSale, error: updateError } = await supabase
      .from("sales")
      .update({
        bakery_id: bakery_id,
        customer_id: data.customerId ?? null,
        payment_method: data.paymentMethod,
        total_amount: totalAmount,
      })
      .eq("id", saleId)
      .eq("bakery_id", bakery_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const { error: deleteItemsError } = await supabase
      .from("sale_items")
      .delete()
      .eq("sale_id", saleId);

    if (deleteItemsError) {
      throw deleteItemsError;
    }

    const { data: insertedItems, error: insertError } = await supabase
      .from("sale_items")
      .insert(saleItems)
      .select();

    if (insertError) {
      throw insertError;
    }

    return {
      sale: updatedSale,
      items: insertedItems,
    };
  }

  static async delete(saleId: string) {
    const { error: itemsError } = await supabase
      .from("sale_items")
      .delete()
      .eq("sale_id", saleId);

    if (itemsError) {
      throw itemsError;
    }

    const { error: saleError } = await supabase
      .from("sales")
      .delete()
      .eq("id", saleId);

    if (saleError) {
      throw saleError;
    }

    return true;
  }

  static async getTodaySales(bakeryId: string) {
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("sales")
      .select("total_amount")
      .eq("bakery_id", bakeryId)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());

    if (error) throw error;

    return (data ?? []).reduce(
      (sum, sale) => sum + Number(sale.total_amount),
      0,
    );
  }

  static async getMonthlySales(bakeryId: string) {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data, error } = await supabase
      .from("sales")
      .select("total_amount")
      .eq("bakery_id", bakeryId)
      .gte("created_at", firstDay.toISOString());

    if (error) throw error;

    return (data ?? []).reduce(
      (sum, sale) => sum + Number(sale.total_amount),
      0,
    );
  }

  static async getLast7DaysSales(bakeryId: string) {
    const start = new Date();

    start.setDate(start.getDate() - 6);

    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("sales")
      .select("created_at,total_amount")
      .eq("bakery_id", bakeryId)
      .gte("created_at", start.toISOString())
      .order("created_at");

    if (error) throw error;

    const grouped = new Map<string, number>();

    data?.forEach((sale) => {
      const day = sale.created_at.split("T")[0];

      grouped.set(day, (grouped.get(day) ?? 0) + Number(sale.total_amount));
    });

    const result = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);

      date.setDate(start.getDate() + i);

      const key = date.toISOString().split("T")[0];

      result.push({
        date: key,

        total: grouped.get(key) ?? 0,
      });
    }

    return result;
  }
}

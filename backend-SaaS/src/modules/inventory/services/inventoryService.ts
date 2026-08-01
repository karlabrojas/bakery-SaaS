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

  static async create(
    bakeryId: string,
    data: {
      name: string;
      quantity: number;
      unit: string;
      minimum_stock?: number;
    },
  ) {
    const { data: existing } = await supabase
      .from("inventory")
      .select("id")
      .ilike("name", data.name)
      .eq("bakery_id", bakeryId)
      .maybeSingle();

    if (existing) {
      throw new Error("Ya existe un ingrediente con ese nombre");
    }

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

  static async update(
    id: string,
    bakeryId: string,
    data: {
      name?: string;
      quantity?: number;
      unit?: string;
      minimum_stock?: number;
    },
  ) {
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
    const { error: errorMovimientos } = await supabase
      .from("inventory_movements")
      .delete()
      .eq("inventory_id", id);

    if (errorMovimientos) throw errorMovimientos;

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id)
      .eq("bakery_id", bakeryId);

    if (error) throw error;

    return { message: "Ingrediente eliminado correctamente" };
  }

  static async createMovement(
    bakeryId: string,
    data: {
      inventory_id: number;
      quantity: number;
      reason?: string;
      movement_date: string;
    },
  ) {
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

  static async createSalida(
    bakeryId: string,
    data: {
      inventory_id: number;
      quantity: number;
      reason?: string;
      movement_date: string;
    },
  ) {
    const { data: ingrediente, error: errGet } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("id", data.inventory_id)
      .single();

    if (errGet) throw errGet;

    if (Number(data.quantity) > Number(ingrediente.quantity)) {
      throw new Error("La cantidad de salida supera el stock disponible");
    }

    const { data: movement, error } = await supabase
      .from("inventory_movements")
      .insert({
        inventory_id: data.inventory_id,
        bakery_id: bakeryId,
        quantity: data.quantity,
        movement_type: "SALIDA",
        reason: data.reason ?? null,
        movement_date: data.movement_date,
      })
      .select()
      .single();

    if (error) throw error;

    const nuevaCantidad = Number(ingrediente.quantity) - Number(data.quantity);

    const { error: errUpdate } = await supabase
      .from("inventory")
      .update({ quantity: nuevaCantidad })
      .eq("id", data.inventory_id);

    if (errUpdate) throw errUpdate;

    return movement;
  }

  static async getById(id: number, bakeryId: string) {
    const { data: ingrediente, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", id)
      .eq("bakery_id", bakeryId)
      .single();

    if (error) throw error;

    const { data: movimientos, error: errMov } = await supabase
      .from("inventory_movements")
      .select("*")
      .eq("inventory_id", id)
      .eq("bakery_id", bakeryId)
      .order("movement_date", { ascending: false });

    if (errMov) throw errMov;

    return { ...ingrediente, movimientos: movimientos ?? [] };
  }

  static async createAjuste(
    bakeryId: string,
    data: {
      inventory_id: number;
      cantidad_ajustada: number;
      reason: string;
    },
  ) {
    const { data: ingrediente, error: errGet } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("id", data.inventory_id)
      .single();

    if (errGet) throw errGet;

    const stockAnterior = Number(ingrediente.quantity);
    const diferencia = data.cantidad_ajustada - stockAnterior;

    const { data: movement, error } = await supabase
      .from("inventory_movements")
      .insert({
        inventory_id: data.inventory_id,
        bakery_id: bakeryId,
        quantity: Math.abs(diferencia),
        movement_type: "AJUSTE",
        reason: `${data.reason} (Stock anterior: ${stockAnterior} → Nuevo: ${data.cantidad_ajustada})`,
        movement_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;

    const { error: errUpdate } = await supabase
      .from("inventory")
      .update({ quantity: data.cantidad_ajustada })
      .eq("id", data.inventory_id);

    if (errUpdate) throw errUpdate;

    return movement;
  }

  static async getLowStockProducts(bakeryId: string) {
    const { data, error } = await supabase

      .from("inventory")

      .select(
        `
            id,
            name,
            quantity,
            minimum_stock,
            unit
        `,
      )

      .eq("bakery_id", bakeryId)

      .order("quantity");

    if (error) throw error;

    return (data ?? [])

      .filter((item) => Number(item.quantity) <= Number(item.minimum_stock))

      .map((item) => ({
        id: item.id,

        name: item.name,

        quantity: Number(item.quantity),

        minimumStock: Number(item.minimum_stock),

        unit: item.unit,
      }));
  }
}

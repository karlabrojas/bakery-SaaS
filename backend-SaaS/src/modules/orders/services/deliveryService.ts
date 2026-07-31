import { supabase } from "../../../config/supabase";
import { TodayDelivery } from "../../dashboard/interfaces/today-delivery.interface";
import { CreateDeliveryDTO, UpdateDeliveryDTO } from "../dto/delivery.dto";
import {
  DeliveryStatus,
  DeliveryType,
  OrderStatus,
} from "../interfaces/delivery";
import { OrderService } from "./orderService";

export class DeliveryService {
  private static async findDelivery(idPedido: string) {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("order_id", idPedido)
      .single();
    if (error || !data) throw new Error("Entrega no encontrada");
    return data;
  }

  private static async validateDelivery(idPedido: string) {
    const delivery = await this.findDelivery(idPedido);
    if (delivery.status === DeliveryStatus.DELIVERED)
      throw new Error("La entrega ya fue completada");
    return delivery;
  }

  private static async updateOrderStatus(
    idPedido: string,
    status: OrderStatus,
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", idPedido);

    if (error) throw error;
  }

  static async createDelivery(
    idPedido: string,
    datos: CreateDeliveryDTO,
    idPanaderia: string,
  ) {
    await OrderService.getOrder(idPedido, idPanaderia);

    const { data: deliveryExists } = await supabase
      .from("deliveries")
      .select("id")
      .eq("order_id", idPedido)
      .maybeSingle();
    if (deliveryExists)
      throw new Error("El pedido ya tiene una entrega registrada");

    if (
      datos.deliveryType === DeliveryType.DELIVERY &&
      (!datos.address || datos.address.trim() === "")
    ) {
      throw new Error("La dirección es obligatoria");
    }

    const { data, error } = await supabase
      .from("deliveries")
      .insert({
        order_id: idPedido,
        bakery_id: idPanaderia,
        delivery_type: datos.deliveryType,
        address: datos.address ?? null,
        recipient_name: datos.recipientName ?? null,
        recipient_phone: datos.recipientPhone ?? null,
        estimated_delivery: datos.estimatedDelivery ?? null,
        status: DeliveryStatus.PENDING,
        notes: datos.notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getDelivery(idPedido: string, idPanaderia: string) {
    await OrderService.getOrder(idPedido, idPanaderia);

    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("order_id", idPedido)
      .maybeSingle();

    if (error) {
      console.error("Error al obtener la logística:", error);
      throw error;
    }

    return data;
  }

  static async updateDelivery(
    idPedido: string,
    datos: UpdateDeliveryDTO,
    idPanaderia: string,
  ) {
    await OrderService.getOrder(idPedido, idPanaderia);
    await this.validateDelivery(idPedido);

    if (
      datos.deliveryType === DeliveryType.DELIVERY &&
      (!datos.address || datos.address.trim() === "")
    ) {
      throw new Error("La dirección es obligatoria");
    }

    const { data, error } = await supabase
      .from("deliveries")
      .update({
        delivery_type: datos.deliveryType,
        address: datos.address ?? null,
        recipient_name: datos.recipientName ?? null,
        recipient_phone: datos.recipientPhone ?? null,
        estimated_delivery: datos.estimatedDelivery ?? null,
        notes: datos.notes ?? null,
        update_at: new Date().toISOString(),
      })
      .eq("order_id", idPedido)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async changeDeliveryStatus(
    idPedido: string,
    nuevoEstado: DeliveryStatus,
    idPanaderia: string,
  ) {
    await OrderService.getOrder(idPedido, idPanaderia);
    await this.validateDelivery(idPedido);

    const { data, error } = await supabase
      .from("deliveries")
      .update({ status: nuevoEstado, update_at: new Date().toISOString() })
      .eq("order_id", idPedido)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async completeDelivery(
    idPedido: string,
    idPanaderia: string,
    idUsuario: string,
  ) {
    const pedido = await OrderService.getOrder(idPedido, idPanaderia);
    if (pedido.status === OrderStatus.CANCELLED)
      throw new Error("El pedido está cancelado");

    await this.validateDelivery(idPedido);

    const { error } = await supabase
      .from("deliveries")
      .update({
        status: DeliveryStatus.DELIVERED,
        delivery_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      })
      .eq("order_id", idPedido);

    if (error) throw error;

    await this.updateOrderStatus(idPedido, OrderStatus.DELIVERED);

    return {
      message: "Entrega completada correctamente",
      deliveredBy: idUsuario,
      deliveredAt: new Date().toISOString(),
    };
  }

  static async deleteDelivery(idPedido: string, idPanaderia: string) {
    await OrderService.getOrder(idPedido, idPanaderia);
    await this.findDelivery(idPedido);

    const { error } = await supabase
      .from("deliveries")
      .delete()
      .eq("order_id", idPedido);
    if (error) throw error;

    await this.updateOrderStatus(idPedido, OrderStatus.PENDING);
    return { message: "Entrega eliminada correctamente" };
  }

  static async getTodayDeliveries(bakeryId: string): Promise<TodayDelivery[]> {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const { data, error } = await supabase
      .from("deliveries")
      .select(
        `
      id,
      order_id,
      recipient_name,
      address,
      estimated_delivery,
      status
    `,
      )
      .eq("bakery_id", bakeryId)
      .gte("estimated_delivery", today.toISOString())
      .lt("estimated_delivery", tomorrow.toISOString())
      .order("estimated_delivery");

    if (error) throw error;

    return (data ?? []).map((delivery) => ({
      id: delivery.id,
      orderId: delivery.order_id,
      recipientName: delivery.recipient_name,
      address: delivery.address,
      estimatedDelivery: delivery.estimated_delivery,
      status: delivery.status,
    }));
  }
}

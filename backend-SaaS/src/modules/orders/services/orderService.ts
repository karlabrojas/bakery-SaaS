import { supabase } from "../../../config/supabase";
import { OrderStatus } from "../interfaces/delivery";
import { PaymentStatus } from "../interfaces/paymentSummary";
import {
  ChangeStatusDTO,
  CreateOrderDTO,
  UpdateOrderDTO,
} from "../dto/order.dto";

export class OrderService {
  private static async generateFolio(idPanaderia: string): Promise<string> {
    const { data: ultimoPedido } = await supabase
      .from("orders")
      .select("folio")
      .eq("bakery_id", idPanaderia)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!ultimoPedido) return "PED-0001";

    const ultimoNumero = parseInt(ultimoPedido.folio.replace("PED-", ""), 10);
    const nuevoNumero = String(ultimoNumero + 1).padStart(4, "0");
    return `PED-${nuevoNumero}`;
  }

  public static async getOrder(idPedido: string, idPanaderia: string) {
    const { data: pedido, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", idPedido)
      .eq("bakery_id", idPanaderia)
      .single();

    if (error || !pedido) throw new Error("Pedido no encontrado");
    return pedido;
  }

  public static async calculatePaymentSummary(
    idPedido: string,
    idPanaderia: string,
  ) {
    const pedido = await this.getOrder(idPedido, idPanaderia);

    const { data: anticipos, error } = await supabase
      .from("advance_payments")
      .select("amount")
      .eq("order_id", idPedido);

    if (error) throw error;

    const totalPagado =
      anticipos?.reduce((total, pago) => total + Number(pago.amount), 0) ?? 0;
    const saldoPendiente = Number(pedido.total) - totalPagado;

    let estadoPago: PaymentStatus = PaymentStatus.PENDING;
    if (saldoPendiente <= 0) {
      estadoPago = PaymentStatus.PAID;
    } else if (totalPagado > 0) {
      estadoPago = PaymentStatus.PARTIAL;
    }

    return {
      total: Number(pedido.total),
      paid: totalPagado,
      remaining: saldoPendiente,
      status: estadoPago,
    };
  }

  public static async updatePaymentStatus(
    idPedido: string,
    idPanaderia: string,
  ) {
    const resumen = await this.calculatePaymentSummary(idPedido, idPanaderia);

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: resumen.status,
        remaining_balance: resumen.remaining,
        updated_at: new Date().toISOString(),
      })
      .eq("id", idPedido);

    if (error) throw error;
    return resumen;
  }

  static async getAll(idPanaderia: string) {
    const { data: datos, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("bakery_id", idPanaderia)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return datos;
  }

  static async getById(idPedido: string, idPanaderia: string) {
    const { data: datos, error } = await supabase
      .from("orders")
      .select(`*, order_items (*)`)
      .eq("id", idPedido)
      .eq("bakery_id", idPanaderia)
      .single();

    if (error) throw error;
    return datos;
  }

  static async create(
    datosDTO: CreateOrderDTO,
    idPanaderia: string,
    idUsuario: string,
  ) {
    const idsProductos = datosDTO.items.map((item) => item.productId);

    const { data: productos, error: errorProductos } = await supabase
      .from("products")
      .select("id, price")
      .in("id", idsProductos)
      .eq("bakery_id", idPanaderia);

    if (errorProductos) throw errorProductos;

    let subtotal = 0;
    const items = datosDTO.items.map((item) => {
      const producto = productos.find((p) => p.id === item.productId);
      if (!producto)
        throw new Error(`Producto ${item.productId} no encontrado`);

      const subtotalItem = Number(producto.price) * item.quantity;
      subtotal += subtotalItem;

      return {
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: producto.price,
        subtotal: subtotalItem,
        observations: item.observations ?? null,
      };
    });

    const descuento = datosDTO.discount ?? 0;
    const total = subtotal - descuento;
    const folio = await this.generateFolio(idPanaderia);

    const { data: pedido, error: errorPedido } = await supabase
      .from("orders")
      .insert({
        folio,
        bakery_id: idPanaderia,
        customer_id: datosDTO.customerId ?? null,
        status: OrderStatus.PENDING,
        delivery_type: datosDTO.deliveryType,
        delivery_date: datosDTO.deliveryDate,
        delivery_time: datosDTO.deliveryTime,
        subtotal,
        discount: descuento,
        total,
        notes: datosDTO.notes ?? null,
        created_by: idUsuario,
        payment_status: PaymentStatus.PENDING,
        remaining_balance: total,
      })
      .select()
      .single();

    if (errorPedido) throw errorPedido;

    const itemsPedido = items.map((item) => ({ ...item, order_id: pedido.id }));
    const { error: errorItems } = await supabase
      .from("order_items")
      .insert(itemsPedido);
    if (errorItems) throw errorItems;

    if (datosDTO.initialAdvance && datosDTO.initialAdvance.amount > 0) {
      if (datosDTO.initialAdvance.amount > total) {
        throw new Error(
          "El anticipo no puede ser mayor que el total del pedido",
        );
      }

      const { error: errorAnticipo } = await supabase
        .from("advance_payments")
        .insert({
          order_id: pedido.id,
          bakery_id: idPanaderia,
          amount: datosDTO.initialAdvance.amount,
          payment_method: datosDTO.initialAdvance.paymentMethod,
          reference: datosDTO.initialAdvance.reference ?? null,
          created_by: idUsuario,
        });

      if (errorAnticipo) throw errorAnticipo;

      await this.updatePaymentStatus(pedido.id, idPanaderia);
    }

    await supabase.from("order_status_history").insert({
      order_id: pedido.id,
      previous_status: null,
      current_status: OrderStatus.PENDING,
      changed_by: idUsuario,
      comments: "Pedido creado correctamente",
    });

    return await this.getById(pedido.id, idPanaderia);
  }

  static async update(
    idPedido: string,
    datosDTO: UpdateOrderDTO,
    idPanaderia: string,
  ) {
    const pedidoExistente = await this.getOrder(idPedido, idPanaderia);

    if (
      [OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(
        pedidoExistente.status,
      )
    ) {
      throw new Error("No se puede editar un pedido cancelado o entregado");
    }

    let subtotal = pedidoExistente.subtotal;

    if (datosDTO.items && datosDTO.items.length > 0) {
      const idsProductos = datosDTO.items.map((item) => item.productId);
      const { data: productos } = await supabase
        .from("products")
        .select("id, price")
        .in("id", idsProductos)
        .eq("bakery_id", idPanaderia);

      subtotal = 0;
      const nuevosItems = datosDTO.items.map((item) => {
        const producto = productos?.find((p) => p.id === item.productId);
        if (!producto)
          throw new Error(`Producto ${item.productId} no encontrado`);

        const subtotalItem = Number(producto.price) * item.quantity;
        subtotal += subtotalItem;

        return {
          order_id: idPedido,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: producto.price,
          subtotal: subtotalItem,
          observations: item.observations ?? null,
        };
      });

      await supabase.from("order_items").delete().eq("order_id", idPedido);
      await supabase.from("order_items").insert(nuevosItems);
    }

    const descuento = datosDTO.discount ?? pedidoExistente.discount;
    const total = subtotal - descuento;

    const { data: pedidoActualizado, error } = await supabase
      .from("orders")
      .update({
        customer_id: datosDTO.customerId ?? pedidoExistente.customer_id,
        delivery_type: datosDTO.deliveryType ?? pedidoExistente.delivery_type,
        delivery_date: datosDTO.deliveryDate ?? pedidoExistente.delivery_date,
        delivery_time: datosDTO.deliveryTime ?? pedidoExistente.delivery_time,
        discount: descuento,
        notes: datosDTO.notes ?? pedidoExistente.notes,
        subtotal,
        total,
        updated_at: new Date().toISOString(),
      })
      .eq("id", idPedido)
      .select()
      .single();

    if (error) throw error;

    await this.updatePaymentStatus(idPedido, idPanaderia);

    return pedidoActualizado;
  }

  static async delete(idPedido: string, idPanaderia: string) {
    await this.getOrder(idPedido, idPanaderia);

    await supabase.from("order_items").delete().eq("order_id", idPedido);
    const { error } = await supabase.from("orders").delete().eq("id", idPedido);

    if (error) throw error;
    return { message: "Pedido eliminado correctamente" };
  }

  static async changeStatus(
    idPedido: string,
    datosDTO: ChangeStatusDTO,
    idPanaderia: string,
    idUsuario: string,
  ) {
    const pedidoExistente = await this.getOrder(idPedido, idPanaderia);

    if (pedidoExistente.status === OrderStatus.CANCELLED) {
      throw new Error("No se puede cambiar el estado de un pedido cancelado");
    }

    const { data: pedidoActualizado, error } = await supabase
      .from("orders")
      .update({ status: datosDTO.status, updated_at: new Date().toISOString() })
      .eq("id", idPedido)
      .select()
      .single();

    if (error) throw error;

    await supabase.from("order_status_history").insert({
      order_id: idPedido,
      previous_status: pedidoExistente.status,
      current_status: datosDTO.status,
      changed_by: idUsuario,
      comments: datosDTO.comments ?? null,
    });

    return pedidoActualizado;
  }

  static async getHistory(idPedido: string, idPanaderia: string) {
    await this.getOrder(idPedido, idPanaderia);

    const { data: datos, error } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", idPedido)
      .order("changed_at", { ascending: false });

    if (error) throw error;
    return datos;
  }

  static async convertToSale(
    idPedido: string,
    idPanaderia: string,
    idUsuario: string,
  ) {
    const pedido = await this.getById(idPedido, idPanaderia);

    if (pedido.status !== OrderStatus.READY) {
      throw new Error("Solo se pueden convertir pedidos en estado READY");
    }

    const { data: venta, error: errorVenta } = await supabase
      .from("sales")
      .insert({
        bakery_id: idPanaderia,
        customer_id: pedido.customer_id ?? null,
        total_amount: Math.round(Number(pedido.total)), // Forzado a entero por tipo bigint en la BD
        payment_method: "cash",
      })
      .select()
      .single();

    if (errorVenta) throw errorVenta;

    const itemsVenta = pedido.order_items.map((item: any) => ({
      sale_id: venta.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.unit_price),
      subtotal: Number(item.subtotal),
    }));

    const { error: errorItems } = await supabase
      .from("sale_items")
      .insert(itemsVenta);

    if (errorItems) throw errorItems;

    await this.changeStatus(
      idPedido,
      {
        status: OrderStatus.DELIVERED,
        comments: "Convertido a venta automáticamente",
      },
      idPanaderia,
      idUsuario,
    );

    return venta;
  }
}

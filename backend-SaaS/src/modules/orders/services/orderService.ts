import { supabase } from "../../../config/supabase";
import { ChangeStatusDTO, CreateOrderDTO, UpdateOrderDTO } from "../dto/order.dto";

export class OrderService {

    private static async generateFolio(idPanaderia: string): Promise<string> {
        const { data: ultimoPedido } = await supabase
            .from("orders")
            .select("folio")
            .eq("bakery_id", idPanaderia)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (!ultimoPedido) {
            return "PED-0001";
        }

        const ultimoNumero = parseInt(ultimoPedido.folio.replace("PED-", ""), 10);
        const nuevoNumero = String(ultimoNumero + 1).padStart(4, "0");
        return `PED-${nuevoNumero}`;
    }

    static async getAll(idPanaderia: string) {
        const { data: datos, error } = await supabase
            .from("orders")
            .select("*")
            .eq("bakery_id", idPanaderia)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const ordersWithItems = await Promise.all(
            datos.map(async (order) => {
                const { data: items } = await supabase
                    .from("order_items")
                    .select("*")
                    .eq("order_id", order.id);

                return { ...order, order_items: items ?? [] };
            })
        );

        return ordersWithItems;
    }

    static async getById(idPedido: string, idPanaderia: string) {
        const { data: datos, error } = await supabase
            .from("orders")
            .select(`*, order_items (*)`)
            .eq("id", idPedido)
            .eq("bakery_id", idPanaderia)
            .single();

        if (error) throw error;
        const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", idPedido);

        return { ...datos, order_items: items ?? [] };
    }

    static async create(datosDTO: CreateOrderDTO, idPanaderia: string, idUsuario: string) {
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
            if (!producto) throw new Error(`Producto ${item.productId} no encontrado`);

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
                status: "PENDING",
                delivery_type: datosDTO.deliveryType,
                delivery_date: datosDTO.deliveryDate,
                delivery_time: datosDTO.deliveryTime,
                subtotal,
                discount: descuento,
                total,
                notes: datosDTO.notes ?? null,
                created_by: idUsuario,
            })
            .select()
            .single();

        if (errorPedido) throw errorPedido;

        const itemsPedido = items.map((item) => ({ ...item, order_id: pedido.id }));

        const { error: errorItems } = await supabase
            .from("order_items")
            .insert(itemsPedido);

        if (errorItems) throw errorItems;

        return pedido;
    }

    static async update(idPedido: string, datosDTO: UpdateOrderDTO, idPanaderia: string) {
        const { data: pedidoExistente, error: errorBusqueda } = await supabase
            .from("orders")
            .select("*")
            .eq("id", idPedido)
            .eq("bakery_id", idPanaderia)
            .single();

        if (errorBusqueda || !pedidoExistente) throw new Error("Pedido no encontrado");

        if (["CANCELLED", "DELIVERED"].includes(pedidoExistente.status)) {
            throw new Error("No se puede editar un pedido cancelado o entregado");
        }

        let subtotal = pedidoExistente.subtotal;
        let total = pedidoExistente.total;

        if (datosDTO.items && datosDTO.items.length > 0) {
            const idsProductos = datosDTO.items.map((item) => item.productId);

            const { data: productos } = await supabase
                .from("products")
                .select("id, price")
                .in("id", idsProductos);

            subtotal = 0;

            const nuevosItems = datosDTO.items.map((item) => {
                const producto = productos?.find((p) => p.id === item.productId);
                if (!producto) throw new Error(`Producto ${item.productId} no encontrado`);

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

            const descuento = datosDTO.discount ?? pedidoExistente.discount;
            total = subtotal - descuento;

            await supabase.from("order_items").delete().eq("order_id", idPedido);
            await supabase.from("order_items").insert(nuevosItems);
        }

        const { data: pedidoActualizado, error } = await supabase
            .from("orders")
            .update({
                customer_id: datosDTO.customerId ?? pedidoExistente.customer_id,
                delivery_type: datosDTO.deliveryType ?? pedidoExistente.delivery_type,
                delivery_date: datosDTO.deliveryDate ?? pedidoExistente.delivery_date,
                delivery_time: datosDTO.deliveryTime ?? pedidoExistente.delivery_time,
                discount: datosDTO.discount ?? pedidoExistente.discount,
                notes: datosDTO.notes ?? pedidoExistente.notes,
                subtotal,
                total,
                updated_at: new Date().toISOString(),
            })
            .eq("id", idPedido)
            .select()
            .single();

        if (error) throw error;
        return pedidoActualizado;
    }

    static async delete(idPedido: string, idPanaderia: string) {
        const { data: pedidoExistente, error: errorBusqueda } = await supabase
            .from("orders")
            .select("id")
            .eq("id", idPedido)
            .eq("bakery_id", idPanaderia)
            .single();

        if (errorBusqueda || !pedidoExistente) throw new Error("Pedido no encontrado");

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
        const { data: pedidoExistente, error: errorBusqueda } = await supabase
            .from("orders")
            .select("status")
            .eq("id", idPedido)
            .eq("bakery_id", idPanaderia)
            .single();

        if (errorBusqueda || !pedidoExistente) throw new Error("Pedido no encontrado");

        if (pedidoExistente.status === "CANCELLED") {
            throw new Error("No se puede cambiar el estado de un pedido cancelado");
        }

        const { data: pedidoActualizado, error } = await supabase
            .from("orders")
            .update({ status: datosDTO.status, updated_at: new Date().toISOString() })
            .eq("id", idPedido)
            .select()
            .single();

        if (error) throw error;
        return pedidoActualizado;
    }
}
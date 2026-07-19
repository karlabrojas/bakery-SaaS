import { supabase } from "../../../config/supabase";
import { RegisterAdvancePaymentDTO, FinalPaymentDTO } from "../dto/payment.dto";
import { OrderService } from "./orderService";

export class PaymentService {
  static async registerAdvance(
    idPedido: string,
    datos: RegisterAdvancePaymentDTO,
    idPanaderia: string,
  ) {
    await OrderService.getOrder(idPedido, idPanaderia);
    const resumen = await OrderService.calculatePaymentSummary(
      idPedido,
      idPanaderia,
    );

    if (datos.amount <= 0) throw new Error("El monto debe ser mayor a cero");
    if (datos.amount > resumen.remaining)
      throw new Error("El anticipo excede el saldo pendiente");

    const { data, error } = await supabase
      .from("advance_payments")
      .insert({
        order_id: idPedido,
        amount: datos.amount,
        payment_method: datos.paymentMethod,
        reference: datos.reference ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    await OrderService.updatePaymentStatus(idPedido, idPanaderia);
    return data;
  }

  static async getAdvances(idPedido: string, idPanaderia: string) {
    await OrderService.getOrder(idPedido, idPanaderia);

    const { data, error } = await supabase
      .from("advance_payments")
      .select("*")
      .eq("order_id", idPedido)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getPaymentSummary(idPedido: string, idPanaderia: string) {
    await OrderService.getOrder(idPedido, idPanaderia);
    return await OrderService.calculatePaymentSummary(idPedido, idPanaderia);
  }

  static async payRemaining(
    idPedido: string,
    datos: FinalPaymentDTO,
    idPanaderia: string,
  ) {
    await OrderService.getOrder(idPedido, idPanaderia);
    const resumen = await OrderService.calculatePaymentSummary(
      idPedido,
      idPanaderia,
    );

    if (resumen.remaining <= 0) throw new Error("El pedido ya está liquidado");
    if (Number(datos.amount) !== Number(resumen.remaining)) {
      throw new Error(`El pago debe ser exactamente de ${resumen.remaining}`);
    }

    const { error } = await supabase.from("advance_payments").insert({
      order_id: idPedido,
      amount: datos.amount,
      payment_method: datos.paymentMethod,
      reference: datos.reference ?? null,
    });

    if (error) throw error;

    await OrderService.updatePaymentStatus(idPedido, idPanaderia);
    return { message: "Pedido liquidado correctamente" };
  }
}

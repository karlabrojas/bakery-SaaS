export interface SaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateSaleDTO {
  bakeryId?: string | null;

  customerId?: string;

  paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";

  items: SaleItemDTO[];
}

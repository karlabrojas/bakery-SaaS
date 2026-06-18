export interface SaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateSaleDTO {
  bakeryId: string;

  customerId?: string;

  paymentMethod: "cash" | "card" | "transfer";

  items: SaleItemDTO[];
}

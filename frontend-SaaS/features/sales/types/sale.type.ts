import { CartItem } from "./cart.type";

export interface Sale {
  items: CartItem[];
  total: number;
  paymentMethod: "cash" | "card" | "transfer";
}

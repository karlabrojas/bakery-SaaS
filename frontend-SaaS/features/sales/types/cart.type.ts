import { Product } from "./product.type";

export interface CartItem extends Product {
  quantity: number;
}

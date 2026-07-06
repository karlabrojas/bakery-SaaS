export interface Product {
  id: string;
  bakery_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imagen_path: string | null;
  imageUrl: string | null;
  is_active: boolean;
  created_at: string;
}

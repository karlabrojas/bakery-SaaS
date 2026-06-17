import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    realtime: {
      transport: WebSocket as any,
    },
  }
);

export class ProductService {
  static async getAll() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    return data;
  }
}
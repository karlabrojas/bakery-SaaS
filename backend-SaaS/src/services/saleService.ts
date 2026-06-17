import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

dotenv.config();

console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY =", process.env.SUPABASE_KEY);

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
  realtime: {
    transport: WebSocket as any,
  },
});

export class SaleService {
  static async getAll() {
    const { data, error } = await supabase
      .from("sales")
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  }

  static async create(data: any) {
    const { product, quantity, total } = data;

    const { data: sale, error } = await supabase
      .from("sales")
      .insert([
        {
          product,
          quantity,
          total,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return sale;
  }
}
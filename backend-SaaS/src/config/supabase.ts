import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

dotenv.config();
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    realtime: {
      transport: WebSocket as any,
    },
  },
);

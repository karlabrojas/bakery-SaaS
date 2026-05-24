import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(express.json());
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
app.post("/orders", async (req, res) => {
  try {
    const { nombre } = req.body;
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          nombre
        }
      ]);
    if (error) {
      return res.status(500).json(error);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error del servidor"
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo");
});
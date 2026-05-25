import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

app.post("/orders", async (req, res) => {
  try {
    const { name, email, problem } = req.body;

    const { data, error } = await supabase
      .from("landing_data")
      .insert([
        {
          name,
          email,
          problem,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    return res.status(201).json({
      ok: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Error del servidor",
    });
  }
});

app.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});

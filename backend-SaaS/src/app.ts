import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import saleRoutes from "./modules/sales/routes/saleRoutes";
import productRoutes from "./modules/products/routes/productRoutes";
import authRoutes from "./modules/auth/routes/auth.routes";

import { supabase } from "./config/supabase";
import orderRoutes from "./modules/orders/routes/orderRoutes";
import customerRoutes from "./modules/customers/routes/customerRoutes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Bakery SaaS API funcionando",
  });
});

app.post("/orders", async (req, res) => {
  try {
    const { name, email, problem } = req.body;

    const { data, error } = await supabase
      .from("landing_data")
      .insert([{ name, email, problem }])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Rutas de módulos
app.use("/api/products", productRoutes);
// app.use("/api/products", productRoutes)
app.use("/api/sales", saleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes)

export default app;

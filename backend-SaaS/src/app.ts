import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import saleRoutes from "./modules/sales/routes/saleRoutes";
import productRoutes from "./modules/products/routes/productRoutes";
import authRoutes from "./modules/auth/routes/auth.routes";
import customerRoutes from "./modules/customers/routes/customerRoutes";

// Módulo de Órdenes y sus Sub-recursos
import orderRoutes from "./modules/orders/routes/orderRoutes";
import paymentRoutes from "./modules/orders/routes/paymentRoutes";
import deliveryRoutes from "./modules/orders/routes/deliveryRoutes";

import { supabase } from "./config/supabase";

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

app.post("/landing", async (req, res) => {
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

// ==========================================
// RUTAS DE LOS MÓDULOS
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/customers", customerRoutes);

// 1. Módulo raíz de Pedidos
app.use("/api/orders", orderRoutes);

// 2. Sub-recursos Anidados (Gracias al mergeParams: true que pusimos en sus enrutadores)
app.use("/api/orders/:id/payments", paymentRoutes);
app.use("/api/orders/:id/delivery", deliveryRoutes);

export default app;

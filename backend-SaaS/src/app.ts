import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import saleRoutes from "./modules/sales/routes/saleRoutes";
import productRoutes from "./modules/products/routes/productRoutes";
import authRoutes from "./modules/auth/routes/auth.routes";
import customerRoutes from "./modules/customers/routes/customerRoutes";
import profileRoutes from "./modules/profile/routes/profileRoutes";
import { supabase } from "./config/supabase";
import orderRoutes from "./modules/orders/routes/orderRoutes";
import paymentRoutes from "./modules/orders/routes/paymentRoutes";
import deliveryRoutes from "./modules/orders/routes/deliveryRoutes";

const app = express();
const frontendURL = process.env.URL_FRONTEND;
if (!frontendURL) {
  console.warn(
    "URL_FRONTEND no está configurada. Revisa las variables de entorno.",
  );
}

app.use(express.json());
app.use(cors({ origin: frontendURL, credentials: true }));
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

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders/:id/payments", paymentRoutes);
app.use("/api/orders/:id/delivery", deliveryRoutes);

export default app;

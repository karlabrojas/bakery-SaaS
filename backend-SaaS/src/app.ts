import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/routes/auth.routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);

export default app;

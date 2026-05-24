import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.post("/orders", async (req, res) => {
  try {
    const { nombre } = req.body;
    const order = await prisma.order.create({
      data: {
        nombre,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({
      error: "Error al guardar"
    });
  }
});
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
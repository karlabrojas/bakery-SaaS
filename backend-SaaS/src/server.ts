import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

app.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});

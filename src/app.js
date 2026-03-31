import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
 import consultaRoutes from "./routes/consultaRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/users", userRoutes);
app.use("/api", consultaRoutes);

export default app;
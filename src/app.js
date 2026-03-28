import express from "express";
import cors from "cors";

import linkRoutes from "./routes/linkRoutes.js";
import printRoutes from "./routes/printRoutes.js"
import phoneRoutes from "./routes/phoneRoutes.js";
import userRoutes from "./routes/userRoutes.js";
 import consultaRoutes from "./routes/consultaRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(linkRoutes);
app.use(printRoutes);
app.use(phoneRoutes);
app.use(consultaRoutes);
app.use("/users", userRoutes);

export default app;
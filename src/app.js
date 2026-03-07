import express from "express";
import cors from "cors";


import apiRoutes from "./routes/apiRoutes.js";
import printRoutes from "./routes/printRoutes.js"
import phoneRoutes from "./routes/phoneRoutes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use(apiRoutes);
app.use(printRoutes);
app.use(phoneRoutes);

export default app;
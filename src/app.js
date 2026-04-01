import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
 import consultaRoutes from "./routes/consultaRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Diretório atual:", __dirname);
console.log("Tentando servir estáticos de:", path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, '../public')));


app.get('*', (req, res, next) => {
    // Ignora rotas que começam com /api
    if (req.path.startsWith('/api')) return next();
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            console.error("Erro ao enviar index.html:", err);
            res.status(404).send("Arquivo index.html não encontrado na pasta public.");
        }
    });
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/users", userRoutes);
app.use("/api", consultaRoutes);

export default app;
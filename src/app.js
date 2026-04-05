import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from "./routes/userRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '..', 'public');

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(express.static(publicPath));


console.log("[GUARDX DEPLOY LOG]");

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicPath, 'guardix.html'));
  
});

app.get('/inicio-guardix', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
  
})

app.use("/users", userRoutes);
app.use("/api", consultaRoutes);


app.use((req, res, next) => {
   
    if (req.path.startsWith('/api') || req.path.startsWith('/users')) {
        return res.status(404).json({ error: "Rota de API não encontrada." });
    }

   
   
   
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
           
            res.status(404).send("Front-end não encontrado. Verifique a pasta public.");
        }
    });
});

export default app;
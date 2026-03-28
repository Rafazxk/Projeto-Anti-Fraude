import { Router } from "express";
import LinkController from "../controllers/LinkController.js";


const router = Router();

// tentar reduzir o tamanho para /link/:id_link

router.post("/api/link", LinkController.analyze);

export default router;

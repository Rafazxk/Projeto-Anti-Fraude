import express from 'express';
const router = express.Router();
import denunciaController from '../controllers/denunciaController.js';
import authMiddleware from "../middleware/authMiddleware.js";

router.get('/feed', denunciaController.listarFeed);

router.get('/estatisticas', denunciaController.listarEstatisticas);

router.post('/reportar-direto', denunciaController.criarDenuncia);

export default router;
import { Router } from 'express';
import ConsultaController from '../controllers/ConsultaController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();


router.post('/link', authMiddleware, ConsultaController.analisarLink);
router.post('/phone', authMiddleware, ConsultaController.analisarTelefone);
router.get('/historico', authMiddleware, ConsultaController.obterHistorico);

router.post('/print', authMiddleware, upload.single('imagem'), ConsultaController.analisarPrint);

export default router;
import express from 'express';
import ConsultaController from '../controllers/consultaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Teste manual: Se o middleware passar, este log TEM que aparecer
router.post('/link', (req, res, next) => {
    console.log("3. foi acionada sem middleware!");
    next();
}, ConsultaController.analisarLink);


router.get('/historico', authMiddleware, ConsultaController.obterHistorico);

export default router;
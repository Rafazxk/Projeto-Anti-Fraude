import { Router } from 'express';
import ConsultaController from '../controllers/ConsultaController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../config/database.js';
import upload from '../middleware/upload.js';

const router = Router();


router.post('/link', authMiddleware, ConsultaController.analisarLink);
router.post('/phone', authMiddleware, ConsultaController.analisarTelefone);
router.get('/historico', authMiddleware, ConsultaController.obterHistorico);
router.get('/stats/live', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as total_denuncias 
      FROM telefones_reportados 
      WHERE data_criacao > CURRENT_DATE - INTERVAL '24 hours'
      GROUP BY status ORDER BY total_denuncias DESC LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar stats" });
  }
});
router.post('/print', authMiddleware, upload.single('imagem'), ConsultaController.analisarPrint);

export default router;
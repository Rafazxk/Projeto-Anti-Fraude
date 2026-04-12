import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import PagamentoController from "../controllers/PagamentoController.js";
import WebhookController from "../controllers/WebhookController.js";
import express from "express";

const router = Router();

router.get('/test-connection', (req, res) => {
  console.log("TESTE DE CONEXAO RECEBIDO NO BACKEND");
  res.json({ message: "Conexão estabelecida com sucesso!" });
});

router.post("/register", (req, res) => UserController.register(req, res));
router.post("/login", (req, res) => UserController.login(req, res));


router.post('/pagamento/checkout', authMiddleware, PagamentoController.checkout);

router.post('/pagamento/virar/pro', authMiddleware, UserController.virarPro);
router.post('/webhook', express.raw({type: 'application/json'}), WebhookController.handle);

export default router;
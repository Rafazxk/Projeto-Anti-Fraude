import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", (req, res) => UserController.register(req, res));
router.post("/login", (req, res) => UserController.login(req, res));

export default router;
import { Router } from "express";
import PhoneController from "../controllers/PhoneController.js";

const router = Router();

router.post("/api/phone", PhoneController.analyze);

export default router;
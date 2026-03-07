import { Router } from "express";
import LinkController from "../controllers/LinkController.js";
// import PhoneController from "../controllers/PhoneController.js";
// import PrintController from "../controllers/PrintController.js";

const router = Router();

router.post("/api/link", LinkController.analyze);
// router.post("/api/phone", PhoneController.analyze);
// router.post("/api/print", PrintController.analyze);

export default router;
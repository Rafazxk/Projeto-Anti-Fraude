import { Router } from "express";

import PrintController from "../controllers/PrintController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post(
  "/api/print",
  upload.single("imagem"),
  PrintController.analyze
  );

export default router;
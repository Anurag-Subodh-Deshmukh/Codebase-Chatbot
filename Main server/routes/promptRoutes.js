import { savePrompt } from "../controllers/promptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.post("/save-prompt", authMiddleware, savePrompt);
export default router;


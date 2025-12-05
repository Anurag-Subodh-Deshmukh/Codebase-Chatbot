import { savePrompt, getPrompts } from "../controllers/promptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.post("/save-prompt", authMiddleware, savePrompt);
router.get("/get-prompts/:chat_id", authMiddleware, getPrompts);
export default router;


import { getAllChats } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.get("/get-chat/:repo_id", authMiddleware, getAllChats);
export default router;


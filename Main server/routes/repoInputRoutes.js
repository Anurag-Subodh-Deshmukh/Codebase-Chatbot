import {
  saveRepoInput,
  getRepoInput,
} from "../controllers/repoInputController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.post("/save-repo", authMiddleware, saveRepoInput);
router.get("/get-repo/:repo_id", authMiddleware, getRepoInput);
export default router;

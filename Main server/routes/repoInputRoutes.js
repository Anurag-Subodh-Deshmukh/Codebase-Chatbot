import {
  saveRepoInput,
  getRepoInput,
} from "../controllers/repoInputController.js";
import { Router } from "express";

const router = Router();
router.post("/save-repo", saveRepoInput);
router.get("/get-repo/:email", getRepoInput);
export default router;

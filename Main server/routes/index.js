import { Router } from "express";
import repoRoutes from "./repoInputRoutes.js";
import authRoutes from "./authRoutes.js";
import promptRoutes from "./promptRoutes.js";

const router = Router();

router.use("/repo", repoRoutes);
router.use("/auth", authRoutes);
router.use("/prompt", promptRoutes);

export default router;

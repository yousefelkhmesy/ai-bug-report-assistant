import { Router } from "express";
import { generateBugReport } from "../controllers/bugController.js";

const router = Router();

router.post("/generate-bug", generateBugReport);

export default router;

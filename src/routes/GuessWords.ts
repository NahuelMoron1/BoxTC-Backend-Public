import { Router } from "express";

import { askQuestions } from "../controllers/GuessWords";

const router = Router();
router.post("/ask", askQuestions);
export default router;

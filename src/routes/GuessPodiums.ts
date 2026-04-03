import { Router } from "express";

import {
  getGameData,
  guessAll,
  guessOne,
  surrender,
} from "../controllers/GuessPodiums";

const router = Router();

router.get("/play", getGameData);
router.get("/surrender", surrender);
router.post("/guessOne", guessOne);
router.post("/guessAll", guessAll);

export default router;

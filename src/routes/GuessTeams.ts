import { Router } from "express";

import {
  getGameData,
  guessAll,
  guessByOne,
  surrender,
} from "../controllers/GuessTeams";

const router = Router();

router.get("/play", getGameData);
router.get("/surrender", surrender);
router.post("/guessOne", guessByOne);
router.post("/guessAll", guessAll);

export default router;

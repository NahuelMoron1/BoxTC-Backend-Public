import { Router } from "express";

import { getGameData, guessAll, guessByOne } from "../controllers/H2HGames";

const router = Router();

router.get("/play", getGameData);
router.post("/guessOne", guessByOne);
router.post("/guessAll", guessAll);

export default router;

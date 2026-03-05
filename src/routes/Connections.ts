import { Router } from "express";

import {
  getGameData,
  getResultsByGameID,
  guessGroup,
} from "../controllers/Connections";

const router = Router();

router.get("/gamedata", getGameData);
router.get("/gamedata/results/:gameID/:type", getResultsByGameID);
router.post("/guess", guessGroup);

export default router;

import { Router } from "express";

import {
  findCandidates,
  getGameData,
  playNormalGame,
  playOneByOneGame,
  surrenderImpostorGame,
} from "../controllers/Impostors";

const router = Router();
router.post("/candidates", findCandidates);
router.post("/play/normal", playNormalGame);
router.post("/play/oneByOne", playOneByOneGame);
router.get("/gamedata", getGameData);
router.post("/giveup", surrenderImpostorGame);
export default router;

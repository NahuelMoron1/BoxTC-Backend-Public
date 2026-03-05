import { Router } from "express";
import {
  getGameData,
  getSuggestions,
  playBest10Game,
  surrenderBest10Game,
  updateBest10GameResults,
} from "../controllers/Best_tens";

const router = Router();

router.get("/play/:input/:type/:gameID", playBest10Game);
router.get("/gamedata", getGameData);
router.get("/suggestions/:input/:type", getSuggestions);
router.get("/giveup/:gameID/:type", surrenderBest10Game);
router.get("/update", updateBest10GameResults);
export default router;

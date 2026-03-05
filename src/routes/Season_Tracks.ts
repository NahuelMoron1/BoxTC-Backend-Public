import { Router } from "express";
import { getAllSeason_tracks } from "../controllers/Season_Tracks";

const router = Router();

router.get("/season_tracks", getAllSeason_tracks);

export default router;

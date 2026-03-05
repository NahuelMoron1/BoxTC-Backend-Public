import { Router } from "express";
import { getAllSeason_teams } from "../controllers/Seasons.Teams";

const router = Router();

router.get("/season_teams", getAllSeason_teams);

export default router;

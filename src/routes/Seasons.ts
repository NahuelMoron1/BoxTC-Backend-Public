import { Router } from "express";
import { getAllSeasons } from "../controllers/Seasons";

const router = Router();

router.get("/seasons", getAllSeasons);

export default router;

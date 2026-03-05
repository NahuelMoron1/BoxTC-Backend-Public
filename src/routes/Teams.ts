import { Router } from "express";
import { getAllTeams } from "../controllers/Teams";

const router = Router();

router.get("/teams", getAllTeams);

export default router;

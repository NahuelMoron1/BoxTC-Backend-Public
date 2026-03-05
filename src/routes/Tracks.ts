import { Router } from "express";
import { getAllTracks } from "../controllers/Tracks";

const router = Router();

router.get("/tracks", getAllTracks);

export default router;

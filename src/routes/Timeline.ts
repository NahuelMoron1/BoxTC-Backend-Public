import { Router } from "express";
import { getTodayTimeline, verifyTimeline } from "../controllers/Timeline";

const router = Router();

router.get("/today", getTodayTimeline);
router.post("/verify/:timelineId", verifyTimeline);
export default router;

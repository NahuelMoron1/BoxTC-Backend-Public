import { Router } from "express";
import { postErrorNotification } from "../controllers/Slack";

const router = Router();

router.post("/postError", postErrorNotification);

export default router;

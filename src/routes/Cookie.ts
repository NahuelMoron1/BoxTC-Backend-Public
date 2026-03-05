import { Router } from "express";
import { getToken, tokenExist } from "../controllers/Cookie";

const router = Router();

router.get("/check/:cookieName", tokenExist);
router.get("/get/:cookieName", getToken);

export default router;

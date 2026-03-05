import { Router } from "express";
import { sendEmail } from "../controllers/Email";
const router = Router();
router.post('/', sendEmail);
export default router;
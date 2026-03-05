import { Router } from "express";
import {
  getUserByName,
  login,
  logout,
  validatePasswordModal,
  validateUserID,
} from "../controllers/Users";

const router = Router();

router.get("/name/:username", getUserByName);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validate/password", validatePasswordModal);
router.get("/validate/user/:userID", validateUserID);
export default router;

import { Router } from "express";
import upload from "../middlewares/multer";

import {
  createArticle,
  editArticle,
  getAllNews,
  getArticle,
  getMyNews,
} from "../controllers/News";

const router = Router();
router.get("/news", getAllNews);
router.get("/news/:userID", getMyNews);
router.get("/news/:id/:allowed", getArticle);
router.post("/create", upload.single("file"), createArticle);
router.post("/edit", upload.single("file"), editArticle);
export default router;

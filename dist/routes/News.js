"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../middlewares/multer"));
const News_1 = require("../controllers/News");
const router = (0, express_1.Router)();
router.get("/news", News_1.getAllNews);
router.get("/news/:userID", News_1.getMyNews);
router.get("/news/:id/:allowed", News_1.getArticle);
router.post("/create", multer_1.default.single("file"), News_1.createArticle);
router.post("/edit", multer_1.default.single("file"), News_1.editArticle);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GuessWords_1 = require("../controllers/GuessWords");
const router = (0, express_1.Router)();
router.post("/ask", GuessWords_1.askQuestions);
exports.default = router;

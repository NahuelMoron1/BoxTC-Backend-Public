"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const H2HGames_1 = require("../controllers/H2HGames");
const router = (0, express_1.Router)();
router.get("/play", H2HGames_1.getGameData);
router.post("/guessOne", H2HGames_1.guessByOne);
router.post("/guessAll", H2HGames_1.guessAll);
exports.default = router;

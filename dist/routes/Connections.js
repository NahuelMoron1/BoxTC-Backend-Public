"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Connections_1 = require("../controllers/Connections");
const router = (0, express_1.Router)();
router.get("/gamedata", Connections_1.getGameData);
router.get("/gamedata/results/:gameID/:type", Connections_1.getResultsByGameID);
router.post("/guess", Connections_1.guessGroup);
exports.default = router;

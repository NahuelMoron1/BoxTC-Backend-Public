"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Season_Tracks_1 = require("../controllers/Season_Tracks");
const router = (0, express_1.Router)();
router.get("/season_tracks", Season_Tracks_1.getAllSeason_tracks);
exports.default = router;

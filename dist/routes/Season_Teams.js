"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Seasons_Teams_1 = require("../controllers/Seasons.Teams");
const router = (0, express_1.Router)();
router.get("/season_teams", Seasons_Teams_1.getAllSeason_teams);
exports.default = router;

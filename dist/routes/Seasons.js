"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Seasons_1 = require("../controllers/Seasons");
const router = (0, express_1.Router)();
router.get("/seasons", Seasons_1.getAllSeasons);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tracks_1 = require("../controllers/Tracks");
const router = (0, express_1.Router)();
router.get("/tracks", Tracks_1.getAllTracks);
exports.default = router;

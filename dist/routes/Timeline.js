"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Timeline_1 = require("../controllers/Timeline");
const router = (0, express_1.Router)();
router.get("/today", Timeline_1.getTodayTimeline);
router.post("/verify/:timelineId", Timeline_1.verifyTimeline);
exports.default = router;

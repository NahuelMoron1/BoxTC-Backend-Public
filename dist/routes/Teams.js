"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Teams_1 = require("../controllers/Teams");
const router = (0, express_1.Router)();
router.get("/teams", Teams_1.getAllTeams);
exports.default = router;

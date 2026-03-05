"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Slack_1 = require("../controllers/Slack");
const router = (0, express_1.Router)();
router.post("/postError", Slack_1.postErrorNotification);
exports.default = router;

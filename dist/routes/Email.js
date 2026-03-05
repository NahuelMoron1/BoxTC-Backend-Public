"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Email_1 = require("../controllers/Email");
const router = (0, express_1.Router)();
router.post('/', Email_1.sendEmail);
exports.default = router;

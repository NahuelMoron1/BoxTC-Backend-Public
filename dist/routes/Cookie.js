"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Cookie_1 = require("../controllers/Cookie");
const router = (0, express_1.Router)();
router.get("/check/:cookieName", Cookie_1.tokenExist);
router.get("/get/:cookieName", Cookie_1.getToken);
exports.default = router;

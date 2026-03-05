"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postErrorNotification = void 0;
const config_1 = require("../models/config");
const postErrorNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { message, context } = req.body;
        const publicMessage = ((_a = context === null || context === void 0 ? void 0 : context.err) === null || _a === void 0 ? void 0 : _a.message) || (context === null || context === void 0 ? void 0 : context.message) || "Sin mensaje";
        const errorMessage = ((_b = context === null || context === void 0 ? void 0 : context.err) === null || _b === void 0 ? void 0 : _b.error.message) || "Sin mensaje";
        const statusCode = ((_c = context === null || context === void 0 ? void 0 : context.err) === null || _c === void 0 ? void 0 : _c.status) || (context === null || context === void 0 ? void 0 : context.statusCode) || "N/A";
        const url = (context === null || context === void 0 ? void 0 : context.url) || req.headers.referer || "N/A";
        const userAgent = req.headers["user-agent"] || "N/A";
        const authToken = req.cookies["access_token"];
        const payload = {
            text: message, // fallback
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `${statusCode} - ${message}`,
                        emoji: true,
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Public Message:*\n${publicMessage}`,
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Error Message:*\n${errorMessage}`,
                    },
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*Status:*\n${statusCode}` },
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*Url:*\n${url}` },
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*Auth Token:*\n${authToken}` },
                },
                {
                    type: "section",
                    text: { type: "mrkdwn", text: `*Browser:*\n${userAgent}` },
                },
            ],
        };
        const resp = yield fetch(config_1.SLACK_UI_DEV_OPS_ERRORS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.postErrorNotification = postErrorNotification;

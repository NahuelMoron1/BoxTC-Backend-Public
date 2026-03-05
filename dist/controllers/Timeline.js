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
exports.verifyTimeline = exports.getTodayTimeline = void 0;
const associations_1 = require("../models/mysql/associations");
const getTodayTimeline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const timeline = yield associations_1.Timeline.findOne({
            where: { date: today },
        });
        if (!timeline) {
            return res.status(404).json({ message: "No timeline found for today" });
        }
        const events = yield associations_1.TimelineEvent.findAll({
            where: { gameID: timeline.getDataValue("id") },
            attributes: ["id", "description", "image"], // 🔹 no exponemos eventDate
        });
        return res.status(200).json({
            timeline: {
                id: timeline.getDataValue("id"),
                date: timeline.getDataValue("date"),
            },
            events,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching today's timeline" });
    }
});
exports.getTodayTimeline = getTodayTimeline;
const verifyTimeline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { timelineId } = req.params;
        const { orderedIds } = req.body;
        if (!timelineId || !orderedIds || !Array.isArray(orderedIds)) {
            return res.status(400).json({ message: "Invalid request" });
        }
        // Traemos los eventos reales ordenados por fecha
        const events = yield associations_1.TimelineEvent.findAll({
            where: { gameID: timelineId },
            order: [["eventDate", "ASC"]],
        });
        const correctOrder = events.map((ev) => ({
            id: ev.getDataValue("id"),
            description: ev.getDataValue("description"),
            image: ev.getDataValue("image"),
        }));
        const gameWon = orderedIds.length === correctOrder.length &&
            orderedIds.every((id, idx) => id === correctOrder[idx].id);
        return res.status(200).json({ gameWon, correctOrder });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error verifying timeline" });
    }
});
exports.verifyTimeline = verifyTimeline;

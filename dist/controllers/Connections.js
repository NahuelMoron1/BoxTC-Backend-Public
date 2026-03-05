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
exports.getResultsByGameID = exports.guessGroup = exports.getGroupsByGameID = exports.getGameData = void 0;
const associations_1 = require("../models/mysql/associations");
const getGameData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const challenge = yield associations_1.Connections.findOne({ where: { date: today } });
        if (!challenge) {
            return res
                .status(404)
                .json({ message: "No connections challenge for today" });
        }
        return res.status(200).json(challenge);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getGameData = getGameData;
const getGroupsByGameID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameID } = req.params;
        if (!gameID) {
            return res.status(400).json({ message: "No ID Provided" });
        }
        const groups = yield associations_1.Connections_Groups.findAll({
            where: { gameID: gameID },
        });
        if (!groups) {
            return res.status(404).json({ message: "No group found" });
        }
        return res.status(200).json(groups);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getGroupsByGameID = getGroupsByGameID;
const guessGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gamedata = req.body;
        if (!gamedata || !gamedata.gameID || !gamedata.resultIDs) {
            return res.status(400).json({ message: "No gamedata Provided" });
        }
        const gameID = gamedata.gameID;
        const resultIDs = gamedata.resultIDs;
        if (typeof gameID !== "string" ||
            !Array.isArray(resultIDs) ||
            resultIDs.length !== 4) {
            return res
                .status(400)
                .json("Something went wrong while playing connections game");
        }
        const arrayResults = [];
        const groupCountMap = {};
        for (let id of resultIDs) {
            const result = yield associations_1.Connections_Groups_Results.scope("withAll").findOne({
                where: { resultID: id, gameID: gameID },
            });
            if (result) {
                arrayResults.push(result);
                const groupID = result.getDataValue("groupID");
                groupCountMap[groupID] = (groupCountMap[groupID] || 0) + 1;
            }
        }
        let maxGroupID = "";
        let maxCount = 0;
        for (let [groupID, count] of Object.entries(groupCountMap)) {
            if (count > maxCount) {
                maxCount = count;
                maxGroupID = groupID;
            }
        }
        if (maxCount === 4) {
            const matchedGroup = yield associations_1.Connections_Groups.findByPk(maxGroupID);
            if (!matchedGroup) {
                return res.status(404).json({ message: "We didn't find this group" });
            }
            return res.status(200).json({
                matchCount: maxCount,
                group: matchedGroup,
            });
        }
        return res.status(200).json({ matchCount: maxCount });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.guessGroup = guessGroup;
const getResultsByGameID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameID, type } = req.params;
        if (!gameID) {
            return res.status(400).json({ message: "No ID Provided" });
        }
        const gameResults = yield associations_1.Connections_Groups_Results.findAll({
            where: { gameID: gameID },
        });
        if (!gameResults) {
            return res.status(404).json({ message: "No results found" });
        }
        const resultIDs = gameResults.map((gr) => gr.getDataValue("resultID"));
        let results = [];
        if (type === "driver") {
            results = yield associations_1.Drivers.findAll({ where: { id: resultIDs } });
            return res.status(200).json({ driver: results });
        }
        else if (type === "team") {
            results = yield associations_1.Teams.findAll({ where: { id: resultIDs } });
            return res.status(200).json({ team: results });
        }
        else if (type === "track") {
            results = yield associations_1.Tracks.findAll({ where: { id: resultIDs } });
            return res.status(200).json({ track: results });
        }
        else {
            return res.status(400).json({ message: "Invalid type" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getResultsByGameID = getResultsByGameID;

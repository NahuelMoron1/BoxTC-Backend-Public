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
exports.surrender = exports.guessAll = exports.guessByOne = exports.getGameData = void 0;
const associations_1 = require("../models/mysql/associations");
const getGameData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const today = new Date().toISOString().split("T")[0];
        const challenge = yield associations_1.GuessTeams.findOne({
            where: { date: today },
            include: [
                { model: associations_1.Teams, attributes: ["flag"] },
                { model: associations_1.Drivers, as: "Driver1", attributes: ["flag"] },
                { model: associations_1.Drivers, as: "Driver2", attributes: ["flag"] },
                { model: associations_1.Seasons, attributes: ["year"] },
            ],
        });
        if (!challenge) {
            return res
                .status(404)
                .json({ message: "No guess team challenge for today" });
        }
        const plainChallenge = challenge.get({ plain: true });
        const response = {
            id: plainChallenge.id,
            date: plainChallenge.date,
            teamFlag: (_a = plainChallenge.Team) === null || _a === void 0 ? void 0 : _a.flag,
            tpFlag: plainChallenge.tp_flag,
            driver1Flag: (_b = plainChallenge.Driver1) === null || _b === void 0 ? void 0 : _b.flag,
            driver2Flag: (_c = plainChallenge.Driver2) === null || _c === void 0 ? void 0 : _c.flag,
            seasonYear: (_d = plainChallenge.Season) === null || _d === void 0 ? void 0 : _d.year,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getGameData = getGameData;
const guessByOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.body;
        if (!type || !id || typeof type !== "string" || typeof id !== "string") {
            return res.status(400).json("Bad request");
        }
        const today = new Date().toISOString().split("T")[0];
        const gamedata = yield associations_1.GuessTeams.findOne({
            where: { date: today },
            include: [
                { model: associations_1.Teams, attributes: ["name", "logo", "flag"] },
                {
                    model: associations_1.Drivers,
                    as: "Driver1",
                    attributes: ["firstname", "lastname", "image", "flag"],
                },
                {
                    model: associations_1.Drivers,
                    as: "Driver2",
                    attributes: ["firstname", "lastname", "image", "flag"],
                },
                { model: associations_1.Seasons, attributes: ["year"] },
            ],
        });
        if (!gamedata) {
            return res.status(404).json({ message: "No game found today" });
        }
        var guessed = false;
        var data;
        switch (type) {
            case "team":
                guessed = id === gamedata.getDataValue("team_id");
                data = {
                    name: gamedata.getDataValue("Team").name,
                    image: gamedata.getDataValue("Team").logo,
                };
                break;
            case "driver1":
                guessed = id === gamedata.getDataValue("driver1_id");
                data = {
                    name: gamedata.getDataValue("Driver1").firstname +
                        " " +
                        gamedata.getDataValue("Driver1").lastname,
                    image: gamedata.getDataValue("Driver1").image,
                };
                break;
            case "driver2":
                guessed = id === gamedata.getDataValue("driver2_id");
                data = {
                    name: gamedata.getDataValue("Driver2").firstname +
                        " " +
                        gamedata.getDataValue("Driver2").lastname,
                    image: gamedata.getDataValue("Driver2").image,
                };
                break;
            case "tp":
                guessed = validateTP(gamedata, id);
                data = {
                    name: gamedata.getDataValue("team_principal"),
                    image: gamedata.getDataValue("tp_flag"),
                };
                break;
            default:
                break;
        }
        if (!guessed) {
            return res.status(200).json({ message: "Incorrect Guess" });
        }
        return res.status(200).json({ data });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.guessByOne = guessByOne;
const guessAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamID, driver1ID, driver2ID, tpID } = req.body;
        if (!teamID || !driver1ID || !driver2ID || !tpID) {
            return res.status(400).json({ message: "Bad request" });
        }
        const today = new Date().toISOString().split("T")[0];
        const gamedata = yield associations_1.GuessTeams.findOne({
            where: { date: today },
            include: [
                { model: associations_1.Teams, attributes: ["name", "logo", "flag"] },
                {
                    model: associations_1.Drivers,
                    as: "Driver1",
                    attributes: ["firstname", "lastname", "image", "flag"],
                },
                {
                    model: associations_1.Drivers,
                    as: "Driver2",
                    attributes: ["firstname", "lastname", "image", "flag"],
                },
                { model: associations_1.Seasons, attributes: ["year"] },
            ],
        });
        if (!gamedata) {
            return res.status(404).json({ message: "No game found today" });
        }
        const team = teamID === gamedata.getDataValue("team_id");
        const driver1 = driver1ID === gamedata.getDataValue("driver1_id");
        const driver2 = driver2ID === gamedata.getDataValue("driver2_id");
        const tp = validateTP(gamedata, tpID);
        var gameWon = false;
        if (!team || !driver1 || !driver2 || !tp) {
            gameWon = false;
        }
        else {
            gameWon = true;
        }
        return res
            .status(200)
            .json({ gameWon, gamedata, team, driver1, driver2, tp });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.guessAll = guessAll;
const surrender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toISOString().split("T")[0];
    const gamedata = yield associations_1.GuessTeams.findOne({
        where: { date: today },
        include: [
            { model: associations_1.Teams, attributes: ["name", "logo", "flag"] },
            {
                model: associations_1.Drivers,
                as: "Driver1",
                attributes: ["firstname", "lastname", "image", "flag"],
            },
            {
                model: associations_1.Drivers,
                as: "Driver2",
                attributes: ["firstname", "lastname", "image", "flag"],
            },
            { model: associations_1.Seasons, attributes: ["year"] },
        ],
    });
    if (!gamedata) {
        return res.status(404).json({ message: "No game found today" });
    }
    return res.status(200).json({ gamedata });
});
exports.surrender = surrender;
function validateTP(gamedata, tpID) {
    const tpStored = gamedata.getDataValue("team_principal") || "";
    const tpInput = tpID || "";
    const normalize = (str) => str.toLowerCase().trim().replace(/\s+/g, " ");
    const storedNorm = normalize(tpStored);
    const inputNorm = normalize(tpInput);
    const storedWords = storedNorm.split(" ");
    const tp = inputNorm === storedNorm || storedWords.some((w) => inputNorm.includes(w));
    return tp;
}

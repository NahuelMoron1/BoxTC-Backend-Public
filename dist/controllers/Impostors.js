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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.surrenderImpostorGame = exports.findCandidates = exports.getGameData = exports.playOneByOneGame = exports.playNormalGame = void 0;
const sequelize_1 = require("sequelize");
const associations_1 = require("../models/mysql/associations");
const Drivers_1 = __importDefault(require("../models/mysql/Drivers"));
const Teams_1 = __importDefault(require("../models/mysql/Teams"));
const playNormalGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { IDs, gameID } = req.body;
        const challenge = yield associations_1.Impostors.findByPk(gameID);
        if (!challenge) {
            return res.status(404).json({ message: "No challenge found" });
        }
        if (!Array.isArray(IDs) ||
            !IDs.every((id) => typeof id === "string") ||
            !gameID ||
            typeof gameID !== "string") {
            return res
                .status(400)
                .json({ message: "An error happened on normal mode impostor game" });
        }
        let impostorIDsSelected = [];
        let innocentsIDsSelected = [];
        const allResults = yield associations_1.Impostors_Results.findAll({
            where: { gameID: gameID },
        });
        const allInnocents = allResults
            .filter((r) => r.getDataValue("isImpostor") !== true)
            .map((r) => r.getDataValue("resultID"));
        for (let id of IDs) {
            const result = yield associations_1.Impostors_Results.findOne({
                where: { gameID: gameID, resultID: id },
            });
            if (result && result.getDataValue("isImpostor") === true) {
                impostorIDsSelected.push(id);
            }
            else if (result && result.getDataValue("isImpostor") !== true) {
                innocentsIDsSelected.push(id);
            }
        }
        const gameWon = impostorIDsSelected.length === 0 &&
            innocentsIDsSelected.length ===
                challenge.getDataValue("amount_innocents");
        return res.status(200).json({
            game_won: gameWon,
            impostors_selected: impostorIDsSelected,
            innocents_selected: innocentsIDsSelected,
            all_innocents: allInnocents,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.playNormalGame = playNormalGame;
const playOneByOneGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resultID, gameID, tryNumber } = req.body;
        const challenge = yield associations_1.Impostors.findByPk(gameID);
        if (!challenge) {
            return res.status(404).json({ message: "No challenge found" });
        }
        if (!resultID ||
            typeof resultID !== "string" ||
            !tryNumber ||
            typeof tryNumber !== "number") {
            return res.status(400).json({ message: "No result found" });
        }
        const amount_innocents = challenge.getDataValue("amount_innocents");
        const candidate = yield associations_1.Impostors_Results.findOne({
            where: { gameID: gameID, resultID: resultID },
        });
        if (!candidate) {
            return res.status(404).json({ message: "No candidate found" });
        }
        const isImpostor = candidate.getDataValue("isImpostor");
        if (isImpostor) {
            const allInnocentsRaw = yield associations_1.Impostors_Results.findAll({
                where: { gameID: gameID, isImpostor: false },
            });
            const allInnocents = allInnocentsRaw.map((r) => r.getDataValue("resultID"));
            return res.status(200).json({
                victory: false,
                game_won: false,
                all_innocents: allInnocents,
            });
        }
        const game_won = amount_innocents === tryNumber;
        return res.status(200).json({
            victory: true,
            game_won: game_won,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.playOneByOneGame = playOneByOneGame;
const getGameData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-D
        const challenge = yield associations_1.Impostors.findOne({
            where: { date: today },
        });
        if (!challenge) {
            return res
                .status(404)
                .json({ message: "No impostor challenge found for today" });
        }
        const players = yield associations_1.Impostors_Results.findAll({
            where: { gameID: challenge.getDataValue("id") },
        });
        if (!players) {
            return res
                .status(404)
                .json({ message: "No results found for this impostor challenge" });
        }
        const id = challenge.getDataValue("id");
        const title = challenge.getDataValue("title");
        const type = challenge.getDataValue("type");
        const results = yield getResults(players, type);
        return res.status(200).json({
            id: id,
            title: title,
            type: type,
            results: results,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getGameData = getGameData;
function getResults(results, type) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(type);
        switch (type) {
            case "driver":
                const driverResults = [];
                for (let result of results) {
                    const driverAux = yield Drivers_1.default.findByPk(result.getDataValue("resultID"));
                    if (driverAux) {
                        driverResults.push(driverAux);
                    }
                }
                return driverResults;
            case "team":
                const teamResults = [];
                for (let result of results) {
                    const driverAux = yield Teams_1.default.findByPk(result.getDataValue("resultID"));
                    if (driverAux) {
                        teamResults.push(driverAux);
                    }
                }
                return teamResults;
            case "track":
                const trackResults = [];
                for (let result of results) {
                    const driverAux = yield associations_1.Tracks.findByPk(result.getDataValue("resultID"));
                    if (driverAux) {
                        trackResults.push(driverAux);
                    }
                }
                return trackResults;
        }
    });
}
function validateAddImpostor(type, year, fromYear, toYear, nationality, stat, condition, value, isImpostor) {
    if (!type ||
        typeof type !== "string" ||
        !stat ||
        typeof stat !== "string" ||
        !condition ||
        typeof condition !== "string" ||
        !value ||
        typeof value !== "number" ||
        typeof isImpostor !== "boolean") {
        return false;
    }
    if (!year && (!fromYear || !toYear)) {
        return false;
    }
    if (nationality && typeof nationality !== "string") {
        return false;
    }
    return true;
}
const findCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, year, fromYear, toYear, nationality, stat, condition, value, isImpostor, } = req.body;
        const validated = validateAddImpostor(type, year, fromYear, toYear, nationality, stat, condition, value, isImpostor);
        if (!validated) {
            return res.status(400).json({
                message: "Validation for parameters on adding impostor failed",
            });
        }
        const whereCondition = {};
        if (nationality) {
            whereCondition.nationality = nationality;
        }
        if (year) {
            whereCondition.year = year.toString();
        }
        else if (fromYear && toYear) {
            whereCondition.year = {
                [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
            };
        }
        let impostor = false;
        if (isImpostor && typeof isImpostor === "boolean") {
            impostor = isImpostor;
        }
        switch (type) {
            case "driver":
                const drivers = yield findByDrivers(year, nationality, fromYear, toYear, stat, condition, value, impostor);
                return res.status(200).json(drivers);
            case "team":
                const teams = yield findByTeams(year, fromYear, toYear, stat, condition, value, impostor);
                return res.status(200).json(teams);
            case "track":
                const tracks = yield findByTracks(year, fromYear, toYear, stat, condition, value, impostor, 1);
                return res.status(200).json(tracks);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.findCandidates = findCandidates;
function findByDrivers(year, nationality, fromYear, toYear, stat, condition, value, isImpostor) {
    return __awaiter(this, void 0, void 0, function* () {
        const operatorMap = {
            ">": "<=",
            "<": ">=",
            "=": "!=",
            ">=": "<",
            "<=": ">",
        };
        const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
        const havingClause = (0, sequelize_1.literal)(`SUM(${stat}) ${effectiveCondition} ${value}`);
        const results = yield associations_1.Season_Teams_Drivers.findAll({
            include: [
                Object.assign({ model: Drivers_1.default, attributes: ["id", "firstname", "lastname", "nationality", "image"] }, (nationality && { where: { nationality } })),
                {
                    model: associations_1.Seasons,
                    attributes: [],
                    where: year
                        ? { year: year.toString() }
                        : fromYear && toYear
                            ? {
                                year: {
                                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                                },
                            }
                            : undefined,
                },
            ],
            attributes: ["driverID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
            group: ["driverID", "Driver.id"],
            order: [[(0, sequelize_1.literal)("totalStat"), "DESC"]],
            having: havingClause,
        });
        return results
            .map((r) => ({
            driver: r.Driver,
            totalStat: r.getDataValue("totalStat"),
        }))
            .filter((d) => d);
    });
}
function findByTeams(year, fromYear, toYear, stat, condition, value, isImpostor) {
    return __awaiter(this, void 0, void 0, function* () {
        const operatorMap = {
            ">": "<=",
            "<": ">=",
            "=": "!=",
            ">=": "<",
            "<=": ">",
        };
        const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
        const havingClause = (0, sequelize_1.literal)(`SUM(${stat}) ${effectiveCondition} ${value}`);
        const results = yield associations_1.Season_Teams.findAll({
            include: [
                {
                    model: Teams_1.default,
                    attributes: [
                        "id",
                        "name",
                        "common_name",
                        "championships",
                        "base",
                        "logo",
                    ],
                },
                {
                    model: associations_1.Seasons,
                    attributes: [],
                    where: year
                        ? { year: year.toString() }
                        : fromYear && toYear
                            ? {
                                year: {
                                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                                },
                            }
                            : undefined,
                },
            ],
            attributes: ["teamID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
            group: ["teamID", "Team.id"],
            order: [[(0, sequelize_1.literal)("totalStat"), "DESC"]],
            having: havingClause,
        });
        return results
            .map((r) => ({
            team: r.Team,
            totalStat: r.getDataValue("totalStat"),
        }))
            .filter((d) => d);
    });
}
function findByTracks(year, fromYear, toYear, stat, condition, value, isImpostor, length) {
    return __awaiter(this, void 0, void 0, function* () {
        const operatorMap = {
            ">": "<=",
            "<": ">=",
            "=": "!=",
            ">=": "<",
            "<=": ">",
        };
        const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
        const havingClause = (0, sequelize_1.literal)(`SUM(${stat}) ${effectiveCondition} ${value}`);
        const results = yield associations_1.Season_Tracks.findAll({
            include: [
                {
                    model: associations_1.Tracks,
                    attributes: [
                        "id",
                        "location",
                        "track_name",
                        "length",
                        "country",
                        "image",
                    ],
                },
                {
                    model: associations_1.Seasons,
                    attributes: [],
                    where: year
                        ? { year: year.toString() }
                        : fromYear && toYear
                            ? {
                                year: {
                                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                                },
                            }
                            : undefined,
                },
            ],
            attributes: ["teamID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
            group: ["teamID", "Team.id"],
            order: [[(0, sequelize_1.literal)("totalStat"), "DESC"]],
            having: havingClause,
        });
        return results
            .map((r) => ({
            track: r.Track,
            totalStat: r.getDataValue("totalStat"),
        }))
            .filter((d) => d);
    });
}
const surrenderImpostorGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameID } = req.body;
        if (!gameID || typeof gameID !== "string") {
            return res.status(400).json({ message: "Bad request on surrender" });
        }
        const today = new Date().toISOString().split("T")[0];
        const challenge = yield associations_1.Impostors.findOne({
            where: { id: gameID, date: today },
        });
        if (!challenge) {
            return res.status(404).json({ message: "No challenge found for today" });
        }
        const results = yield associations_1.Impostors_Results.findAll({
            where: { gameID: gameID },
        });
        const impostors = results
            .filter((r) => r.getDataValue("isImpostor") === true)
            .map((r) => r.getDataValue("resultID"));
        const innocents = results
            .filter((r) => r.getDataValue("isImpostor") !== true)
            .map((r) => r.getDataValue("resultID"));
        return res.status(200).json({
            game_won: false,
            impostors: impostors,
            innocents: innocents,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.surrenderImpostorGame = surrenderImpostorGame;

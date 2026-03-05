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
exports.updateBest10GameResults = exports.surrenderBest10Game = exports.playBest10Game = exports.getGameData = exports.getSuggestions = void 0;
const sequelize_1 = require("sequelize");
const associations_1 = require("../models/mysql/associations");
const Best_tens_1 = __importDefault(require("../models/mysql/Best_tens"));
const Best_tens_results_1 = __importDefault(require("../models/mysql/Best_tens_results"));
const Drivers_1 = __importDefault(require("../models/mysql/Drivers"));
const Teams_1 = __importDefault(require("../models/mysql/Teams"));
const Manual_Best_Tens_Results_1 = __importDefault(require("../models/mysql/Manual-Best-Tens-Results"));
const Top10Creation_1 = require("../models/enums/Top10Creation");
const uuid_1 = require("uuid");
const getSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, input } = req.params;
    if (!input || !type) {
        return res.status(400).json({ message: "Missing input or type" });
    }
    const normalized = input.trim().toLowerCase();
    let results = [];
    try {
        switch (type) {
            case "driver":
                results = yield Drivers_1.default.findAll({
                    where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("lower", sequelize_1.Sequelize.fn("concat", sequelize_1.Sequelize.col("firstname"), " ", sequelize_1.Sequelize.col("lastname"))), {
                        [sequelize_1.Op.like]: `%${normalized}%`,
                    }),
                });
                break;
            case "team":
                results = yield Teams_1.default.findAll({
                    where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("lower", sequelize_1.Sequelize.col("name")), {
                        [sequelize_1.Op.like]: `%${normalized}%`,
                    }),
                });
                break;
            case "track":
                results = yield associations_1.Tracks.findAll({
                    where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("lower", sequelize_1.Sequelize.col("track_name")), {
                        [sequelize_1.Op.like]: `%${normalized}%`,
                    }),
                });
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        const suggestions = results.map((r) => ({
            id: r.id,
            name: type === "driver"
                ? `${r.firstname} ${r.lastname}`
                : type === "team"
                    ? r.name
                    : r.track_name,
        }));
        return res.status(200).json(suggestions);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching suggestions", error });
    }
});
exports.getSuggestions = getSuggestions;
const getGameData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const challenge = yield Best_tens_1.default.findOne({
        where: { date: today },
    });
    if (!challenge) {
        return res.status(404).json({ message: "No challenge found for today" });
    }
    return res.status(200).json({
        id: challenge.getDataValue("id"),
        title: challenge.getDataValue("title"),
        type: challenge.getDataValue("type"),
        table: challenge.getDataValue("table"),
    });
});
exports.getGameData = getGameData;
const playBest10Game = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input, type, gameID } = req.params; ///type means driver/team/track, input means the name the user types
        if (!input ||
            typeof input !== "string" ||
            !type ||
            typeof type !== "string" ||
            !gameID ||
            typeof gameID !== "string") {
            return res
                .status(400)
                .json({ message: "Bad request on typing the driver" });
        }
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const challenge = yield Best_tens_1.default.findOne({
            where: { id: gameID, date: today },
        });
        if (!challenge) {
            return res.status(404).json({ message: "No challenge found for today" });
        }
        const resultInGame = yield Best_tens_results_1.default.findOne({
            where: { gameID: gameID, resultID: input },
        });
        if (!resultInGame) {
            return res.status(404).json({ message: "Incorrect guess" });
        }
        switch (type) {
            case "driver":
                const driver = yield Drivers_1.default.findByPk(input);
                const driverResult = {
                    Driver: driver,
                    totalStat: resultInGame.getDataValue("totalStat"),
                    position: resultInGame.getDataValue("position"),
                };
                return res.status(200).json(driverResult);
            case "team":
                const team = yield Teams_1.default.findByPk(input);
                const totalStat = resultInGame.getDataValue("totalStat") || 0;
                const position = resultInGame.getDataValue("position") || 0;
                const teamResult = {
                    Team: team,
                    totalStat: totalStat,
                    position: position,
                };
                return res.status(200).json(teamResult);
            case "track":
                const track = yield associations_1.Tracks.findByPk(input);
                const trackResult = {
                    Track: track,
                    totalStat: resultInGame.getDataValue("totalStat"),
                    position: resultInGame.getDataValue("position"),
                };
                return res.status(200).json(trackResult);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.playBest10Game = playBest10Game;
const surrenderBest10Game = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameID, type } = req.params;
        if (!gameID ||
            typeof gameID !== "string" ||
            !type ||
            typeof type !== "string") {
            return res.status(400).json({ message: "Bad request on surrender" });
        }
        const today = new Date().toISOString().split("T")[0];
        const challenge = yield Best_tens_1.default.findOne({
            where: { id: gameID, date: today },
        });
        if (!challenge) {
            return res.status(404).json({ message: "No challenge found for today" });
        }
        const results = yield Best_tens_results_1.default.findAll({
            where: { gameID: gameID },
            order: [["position", "ASC"]],
        });
        let fullList = [];
        for (const result of results) {
            const resultID = result.getDataValue("resultID");
            const totalStat = result.getDataValue("totalStat") || 0;
            const position = result.getDataValue("position");
            switch (type) {
                case "driver":
                    const driver = yield Drivers_1.default.findByPk(resultID);
                    fullList.push({
                        Driver: driver,
                        totalStat,
                        position,
                    });
                    break;
                case "team":
                    const team = yield Teams_1.default.findByPk(resultID);
                    fullList.push({
                        Team: team,
                        totalStat,
                        position,
                    });
                    break;
                case "track":
                    const track = yield associations_1.Tracks.findByPk(resultID);
                    fullList.push({
                        Track: track,
                        totalStat,
                        position,
                    });
                    break;
            }
        }
        return res.status(200).json(fullList);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.surrenderBest10Game = surrenderBest10Game;
const updateBest10GameResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ///THIS IS TO UPDATE RESULTS EACH DAY
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const challenge = yield Best_tens_1.default.findOne({
            where: { date: today },
        });
        if (!challenge) {
            return res.status(404).json({ error: "No challenge found" });
        }
        const creation = challenge.getDataValue("creation");
        if (!creation) {
            return res.status(200).json({
                error: "Nothing to update because the method is not selected",
            });
        }
        yield Best_tens_results_1.default.truncate();
        const id = challenge.getDataValue("id");
        if (creation === Top10Creation_1.Top10Creation.MANUAL) {
            const updated = yield updateManualResults(id);
            if (!updated) {
                return res.status(500).json({
                    message: "Something happened while getting results, unexpected amount of results",
                });
            }
        }
        else if (creation === Top10Creation_1.Top10Creation.AUTOMATIC) {
            const updated = yield updateAutomaticResults(id, challenge);
            if (!updated) {
                return res
                    .status(404)
                    .json({ message: "No info found for that search" });
            }
        }
        return res.status(200).json({ message: "Game updated successfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: "Server error", details: err.message });
    }
});
exports.updateBest10GameResults = updateBest10GameResults;
function updateAutomaticResults(id, challenge, validation) {
    return __awaiter(this, void 0, void 0, function* () {
        const year = challenge.getDataValue("year");
        const fromYear = challenge.getDataValue("fromYear");
        const toYear = challenge.getDataValue("toYear");
        ///const type = gamedata.type; ///Type refers to: drivers/teams
        const nationality = challenge.getDataValue("nationality");
        const table = challenge.getDataValue("table"); ///Table refers to: points/podiums/wins/laps_led/race_Starts/standings
        const team = challenge.getDataValue("team");
        const sqlTable = challenge.getDataValue("sqlTable");
        let topStats;
        if (year && !nationality && !team) {
            topStats = yield getWithoutParams(year, sqlTable, table);
        }
        else {
            topStats = yield getWithParams(table, nationality, fromYear, toYear, year, team, sqlTable);
        }
        if (!topStats) {
            return false;
        }
        topStats.forEach((result, index) => __awaiter(this, void 0, void 0, function* () {
            const resultID = getID(sqlTable, result);
            const best10 = {
                id: (0, uuid_1.v4)(),
                gameID: id,
                resultID: resultID,
                totalStat: result.getDataValue("totalStat"),
                position: index + 1,
            };
            if (!validation) {
                yield Best_tens_results_1.default.create(best10);
            }
            else if (validation === true) {
                return topStats.length === 10;
            }
        }));
        return true;
    });
}
function updateManualResults(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield Manual_Best_Tens_Results_1.default.findAll({
            where: { gameid: id },
        });
        if (results.length !== 10) {
            return false;
        }
        for (let result of results) {
            yield Best_tens_results_1.default.create(result.toJSON());
        }
        return true;
    });
}
function getWithoutParams(year, sqlTable, table) {
    return __awaiter(this, void 0, void 0, function* () {
        let topStats;
        const seasonID = yield findSeason(year);
        switch (sqlTable) {
            case "Season_Teams_Drivers":
                topStats = yield findStdBySeason(seasonID, table, "DESC");
                break;
            case "Season_Teams":
                topStats = yield findSeasonTeamsBySeason(seasonID, table, "DESC");
                break;
            case "Season_Tracks":
                topStats = yield findSeasonTracksBySeason(seasonID, table, "DESC");
                break;
            default:
                topStats = undefined;
                break;
        }
        return topStats;
    });
}
function getWithParams(table, nationality, fromYear, toYear, year, team, sqlTable) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            stat: table,
            nationality,
            fromYear,
            toYear,
            seasonYear: year,
            team,
        };
        let topStats;
        switch (sqlTable) {
            case "Season_Teams_Drivers":
                topStats = yield getTopDriversByStat(options);
                break;
            case "Season_Teams":
                topStats = yield getTopTeamsByStat(options);
                break;
            case "Season_Tracks":
                topStats = yield getTopTracksByStat(options);
                break;
            default:
                topStats = undefined;
                break;
        }
        return topStats;
    });
}
function findSeason(year) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const season = yield associations_1.Seasons.findOne({ where: { year: year } });
            if (!season) {
                return undefined;
            }
            return season.getDataValue("id");
        }
        catch (error) {
            console.log("ERROR: ", error);
            return undefined;
        }
    });
}
function findStdBySeason(seasonID, table, type) {
    return __awaiter(this, void 0, void 0, function* () {
        ///Type means DESC or ASC
        try {
            const std = yield associations_1.Season_Teams_Drivers.findAll({
                where: { seasonID },
                include: [
                    {
                        model: Drivers_1.default,
                        attributes: ["firstname", "lastname", "nationality", "image"],
                    },
                ],
                attributes: ["driverID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(table)), "totalStat"]],
                group: ["Season_Teams_Drivers.driverID"], // ← agrupás por driver
                order: [[(0, sequelize_1.literal)("totalStat"), type]], // ← ordenás por el alias
                limit: 10,
            });
            if (!std) {
                return undefined;
            }
            return std;
        }
        catch (error) {
            console.log("ERROR: ", error);
            return undefined;
        }
    });
}
function findSeasonTeamsBySeason(seasonID, table, type) {
    return __awaiter(this, void 0, void 0, function* () {
        ///Type means DESC or ASC
        try {
            const std = yield associations_1.Season_Teams.findAll({
                where: { seasonID: seasonID },
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
                ],
                order: [[table, type]], // o 'ASC' si querés orden ascendente
                limit: 10,
            });
            if (!std) {
                return undefined;
            }
            return std;
        }
        catch (error) {
            console.log("ERROR: ", error);
            return undefined;
        }
    });
}
function findSeasonTracksBySeason(seasonID, table, type) {
    return __awaiter(this, void 0, void 0, function* () {
        ///Type means DESC or ASC
        try {
            const std = yield associations_1.Season_Tracks.findAll({
                where: { seasonID: seasonID },
                include: [
                    {
                        model: associations_1.Tracks,
                        attributes: [
                            "id",
                            "location",
                            "track_name",
                            "gmt_offset",
                            "length",
                            "country",
                            "image",
                        ],
                    },
                ],
                order: [[table, type]], // o 'ASC' si querés orden ascendente
                limit: 10,
            });
            if (!std) {
                return undefined;
            }
            return std;
        }
        catch (error) {
            console.log("ERROR: ", error);
            return undefined;
        }
    });
}
function getTopDriversByStat(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stat, nationality, fromYear, toYear, seasonYear, limit = 10, order = "DESC", } = options;
        try {
            const whereSeason = {};
            if (seasonYear) {
                whereSeason.year = seasonYear.toString();
            }
            else if (fromYear && toYear) {
                whereSeason.year = {
                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                };
            }
            const results = yield associations_1.Season_Teams_Drivers.findAll({
                include: [
                    Object.assign({ model: Drivers_1.default, attributes: ["id", "firstname", "lastname", "nationality", "image"] }, (nationality && { where: { nationality } })),
                    Object.assign({ model: associations_1.Seasons, attributes: [] }, (Object.keys(whereSeason).length && { where: whereSeason })),
                ],
                attributes: ["driverID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
                group: ["driverID", "Driver.id"],
                order: [[(0, sequelize_1.literal)("totalStat"), order]],
                limit,
            });
            console.log("RESULTS: ", results);
            return results;
        }
        catch (error) {
            console.error("Error in getTopDriversByStat:", error);
            return undefined;
        }
    });
}
function getTopTeamsByStat(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stat, fromYear, toYear, seasonYear, limit = 10, order = "DESC", } = options;
        try {
            const whereSeason = {};
            if (seasonYear) {
                whereSeason.year = seasonYear.toString();
            }
            else if (fromYear && toYear) {
                whereSeason.year = {
                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                };
            }
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
                    Object.assign({ model: associations_1.Seasons, attributes: [] }, (Object.keys(whereSeason).length && { where: whereSeason })),
                ],
                attributes: ["teamID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
                group: ["teamID", "Team.id"],
                order: [[(0, sequelize_1.literal)("totalStat"), order]],
                limit,
            });
            return results;
        }
        catch (error) {
            console.error("Error in getTopTeamsByStat:", error);
            return undefined;
        }
    });
}
function getTopTracksByStat(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stat, nationality, fromYear, toYear, seasonYear, limit = 10, order = "DESC", } = options;
        try {
            const whereSeason = {};
            if (seasonYear) {
                whereSeason.year = seasonYear.toString();
            }
            else if (fromYear && toYear) {
                whereSeason.year = {
                    [sequelize_1.Op.between]: [fromYear.toString(), toYear.toString()],
                };
            }
            const results = yield associations_1.Season_Teams_Drivers.findAll({
                include: [
                    Object.assign({ model: Drivers_1.default, attributes: [
                            "id",
                            "location",
                            "track_name",
                            "gmt_offset",
                            "length",
                            "country",
                            "image",
                        ] }, (nationality && { where: { nationality } })),
                    Object.assign({ model: associations_1.Seasons, attributes: [] }, (Object.keys(whereSeason).length && { where: whereSeason })),
                ],
                attributes: ["driverID", [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)(stat)), "totalStat"]],
                group: ["driverID", "Driver.id"],
                order: [[(0, sequelize_1.literal)("totalStat"), order]],
                limit,
            });
            return results;
        }
        catch (error) {
            console.error("Error in getTopDriversByStat:", error);
            return undefined;
        }
    });
}
function getID(sqlTable, result) {
    let resultID = "";
    switch (sqlTable) {
        case "Season_Teams_Drivers":
            resultID = result.getDataValue("driverID");
            break;
        case "Season_Teams":
            resultID = result.getDataValue("teamID");
            break;
        case "Season_Tracks":
            resultID = result.getDataValue("trackID");
            break;
    }
    return resultID;
}

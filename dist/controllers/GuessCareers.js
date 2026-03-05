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
exports.getDriverInfo = exports.getAllTeams = exports.getHint = exports.getNextTeam = exports.guessDriver = exports.getGameOfTheDay = void 0;
const associations_1 = require("../models/mysql/associations");
// Obtener el juego del día
const getGameOfTheDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0];
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                date: today,
            },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "flag"],
                },
                {
                    model: associations_1.GuessCareers_Teams,
                    attributes: ["id", "ordered", "start_year", "end_year"],
                    include: [
                        {
                            model: associations_1.Teams,
                            attributes: ["id", "name", "common_name", "logo"],
                        },
                    ],
                },
            ],
            order: [[associations_1.GuessCareers_Teams, "ordered", "ASC"]],
        });
        if (!game) {
            return res.status(404).json({
                msg: "No game found for today",
            });
        }
        // Solo enviar el primer equipo inicialmente
        const gameTeams = game.get("GuessCareers_Teams");
        const firstTeam = gameTeams[0];
        // Obtener el número total de equipos
        const totalTeams = gameTeams.length;
        return res.json({
            id: game.get("id"),
            date: game.get("date"),
            driver_id: game.get("driver_id"),
            Teams: [firstTeam],
            totalTeams: totalTeams, // Agregamos la cantidad total de equipos
            driver_flag: game.get("Driver") && typeof game.get("Driver") === "object"
                ? game.get("Driver").flag
                : undefined,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error getting game of the day",
        });
    }
});
exports.getGameOfTheDay = getGameOfTheDay;
// Verificar si el usuario adivinó correctamente el piloto
const guessDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId, driverGuess } = req.body;
        if (!gameId || !driverGuess) {
            return res.status(400).json({
                msg: "Game ID and driver guess are required",
            });
        }
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                id: gameId,
            },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "nationality", "image"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                msg: "Game not found",
            });
        }
        const driver = game.get("Driver");
        const isCorrect = driver.firstname.toLowerCase().includes(driverGuess.toLowerCase()) ||
            driver.lastname.toLowerCase().includes(driverGuess.toLowerCase());
        return res.json({
            correct: isCorrect,
            driver: isCorrect ? driver : null,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error checking driver guess",
        });
    }
});
exports.guessDriver = guessDriver;
// Obtener el siguiente equipo del piloto
const getNextTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId, currentTeamCount } = req.body;
        if (!gameId || currentTeamCount === undefined) {
            return res.status(400).json({
                msg: "Game ID and current team count are required",
            });
        }
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                id: gameId,
            },
            include: [
                {
                    model: associations_1.GuessCareers_Teams,
                    attributes: ["id", "ordered", "start_year", "end_year"],
                    include: [
                        {
                            model: associations_1.Teams,
                            attributes: ["id", "name", "common_name", "logo"],
                        },
                    ],
                },
            ],
            order: [[associations_1.GuessCareers_Teams, "ordered", "ASC"]],
        });
        if (!game) {
            return res.status(404).json({
                msg: "Game not found",
            });
        }
        const teams = game.get("GuessCareers_Teams");
        // Si ya se revelaron todos los equipos
        if (currentTeamCount >= teams.length) {
            return res.status(400).json({
                msg: "All teams have been revealed",
            });
        }
        // Obtener el siguiente equipo según el contador actual
        const nextTeam = teams[currentTeamCount];
        return res.json({
            team: nextTeam,
            isLastTeam: currentTeamCount + 1 >= teams.length,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error getting next team",
        });
    }
});
exports.getNextTeam = getNextTeam;
// Obtener pistas para el juego
const getHint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId, hintNumber } = req.body;
        if (!gameId || hintNumber === undefined) {
            return res.status(400).json({
                msg: "Game ID and hint number are required",
            });
        }
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                id: gameId,
            },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "nationality", "image"],
                },
                {
                    model: associations_1.GuessCareers_Teams,
                    attributes: ["id", "ordered", "start_year", "end_year"],
                    include: [
                        {
                            model: associations_1.Teams,
                            attributes: ["id", "name", "common_name", "logo"],
                        },
                    ],
                },
            ],
            order: [[associations_1.GuessCareers_Teams, "ordered", "ASC"]],
        });
        if (!game) {
            return res.status(404).json({
                msg: "Game not found",
            });
        }
        let hint = {};
        // Primera pista: nacionalidad del piloto
        if (hintNumber === 1) {
            const driver = game.get("Driver");
            hint = {
                type: "nationality",
                value: driver.nationality,
            };
        }
        // Segunda pista: años de inicio y fin en un equipo aleatorio
        else if (hintNumber === 2) {
            const teams = game.get("GuessCareers_Teams");
            // Seleccionar un equipo aleatorio que tenga años definidos
            const teamsWithYears = teams.filter((team) => team.start_year !== null && team.end_year !== null);
            if (teamsWithYears.length > 0) {
                const randomTeam = teamsWithYears[Math.floor(Math.random() * teamsWithYears.length)];
                hint = {
                    type: "team_years",
                    value: {
                        start_year: randomTeam.start_year,
                        end_year: randomTeam.end_year,
                    },
                };
            }
            else {
                // Si no hay equipos con años, usar el primer equipo
                hint = {
                    type: "team_years",
                    value: {
                        start_year: teams[0].start_year || "Unknown",
                        end_year: teams[0].end_year || "Unknown",
                    },
                };
            }
        }
        else {
            return res.status(400).json({
                msg: "Invalid hint number",
            });
        }
        return res.json({
            hint,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error getting hint",
        });
    }
});
exports.getHint = getHint;
// Controlador para obtener todos los equipos
const getAllTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({
                msg: "Game ID is required",
            });
        }
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                id: gameId,
            },
            include: [
                {
                    model: associations_1.GuessCareers_Teams,
                    attributes: ["id", "ordered", "start_year", "end_year"],
                    include: [
                        {
                            model: associations_1.Teams,
                            attributes: ["id", "name", "common_name", "logo"],
                        },
                    ],
                },
            ],
            order: [[associations_1.GuessCareers_Teams, "ordered", "ASC"]],
        });
        if (!game) {
            return res.status(404).json({
                msg: "Game not found",
            });
        }
        const teams = game.get("GuessCareers_Teams");
        return res.json({
            teams,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error getting all teams",
        });
    }
});
exports.getAllTeams = getAllTeams;
// Controlador para obtener información del piloto
const getDriverInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({
                msg: "Game ID is required",
            });
        }
        const game = yield associations_1.GuessCareers.findOne({
            where: {
                id: gameId,
            },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "nationality", "image"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                msg: "Game not found",
            });
        }
        const driver = game.get("Driver");
        return res.json({
            driver,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error getting driver information",
        });
    }
});
exports.getDriverInfo = getDriverInfo;

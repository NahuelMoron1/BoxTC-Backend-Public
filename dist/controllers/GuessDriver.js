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
exports.surrenderGame = exports.getNextHint = exports.guessDriver = exports.getGameOfTheDay = void 0;
const associations_1 = require("../models/mysql/associations");
/**
 * Obtener el juego del día
 * Retorna información limitada del piloto (solo la temporada inicialmente)
 */
const getGameOfTheDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const today = new Date().toISOString().split("T")[0];
        const game = yield associations_1.GuessDriver.findOne({
            where: { date: today },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Brands,
                    attributes: ["id", "name", "image"],
                },
                {
                    model: associations_1.Seasons,
                    attributes: ["id", "year"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                message: "No guess driver challenge for today",
            });
        }
        const plainGame = game.get({ plain: true });
        // Solo enviar información limitada en el primer paso
        return res.json({
            id: plainGame.id,
            date: plainGame.date,
            season: ((_a = plainGame.Season) === null || _a === void 0 ? void 0 : _a.year) || "",
            seasonID: plainGame.seasonID,
            // No enviar datos del piloto, marca, podios, victorias, etc. aún
        });
    }
    catch (error) {
        console.error("Error getting game of the day:", error);
        return res.status(500).json({
            message: "Error getting game of the day",
        });
    }
});
exports.getGameOfTheDay = getGameOfTheDay;
/**
 * Hacer un intento de adivinar el piloto
 */
const guessDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { gameId, guessedDriverId } = req.body;
        if (!gameId || !guessedDriverId) {
            return res.status(400).json({
                message: "Game ID and guessed driver ID are required",
            });
        }
        const game = yield associations_1.GuessDriver.findOne({
            where: { id: gameId },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "image", "nationality"],
                },
                {
                    model: associations_1.Brands,
                    attributes: ["id", "name", "image"],
                },
                {
                    model: associations_1.Seasons,
                    attributes: ["id", "year"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                message: "Game not found",
            });
        }
        const plainGame = game.get({ plain: true });
        const correctDriverId = plainGame.driverID;
        // Verificar si la suposición es correcta
        if (guessedDriverId === correctDriverId) {
            // ¡Ganó! Retornar todos los datos del piloto
            return res.json({
                isCorrect: true,
                message: "¡Correcto! ¡Adivinaste al piloto!",
                driver: plainGame.Driver,
                brand: plainGame.Brand,
                season: (_a = plainGame.Season) === null || _a === void 0 ? void 0 : _a.year,
                podiums: plainGame.podiums,
                wins: plainGame.wins,
                champPos: plainGame.champ_pos,
                team: plainGame.team,
            });
        }
        else {
            // Adivinanza incorrecta
            return res.json({
                isCorrect: false,
                message: "Incorrect guess. Try again!",
            });
        }
    }
    catch (error) {
        console.error("Error guessing driver:", error);
        return res.status(500).json({
            message: "Error processing guess",
        });
    }
});
exports.guessDriver = guessDriver;
/**
 * Obtener la siguiente pista basada en el número de intentos fallidos
 */
const getNextHint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { gameId, attemptNumber } = req.body;
        if (!gameId || attemptNumber === undefined) {
            return res.status(400).json({
                message: "Game ID and attempt number are required",
            });
        }
        const game = yield associations_1.GuessDriver.findOne({
            where: { id: gameId },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id"],
                },
                {
                    model: associations_1.Brands,
                    attributes: ["id", "name"],
                },
                {
                    model: associations_1.Seasons,
                    attributes: ["id", "year"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                message: "Game not found",
            });
        }
        const plainGame = game.get({ plain: true });
        let hint = "";
        let currentAttempt = attemptNumber;
        /**
         * Progresión de pistas:
         * Intento 0: Solo temporada (mostrada inicialmente)
         * Intento 1: Marca (fallido del primer intento)
         * Intento 2: Podios (si > 0)
         * Intento 3: Victorias (si > 0)
         * Intento 4: Equipo
         * Intento 5: Posición en campeonato
         * Intento 6+: Sin más pistas
         */
        switch (currentAttempt) {
            case 1:
                hint = `Durante la temporada ${(_a = plainGame.Season) === null || _a === void 0 ? void 0 : _a.year}, corrí para la marca ${(_b = plainGame.Brand) === null || _b === void 0 ? void 0 : _b.name}.`;
                break;
            case 2:
                // Mostrar podios solo si hay al menos 1
                if (plainGame.podiums > 0) {
                    hint = `En esa temporada ${(_c = plainGame.Season) === null || _c === void 0 ? void 0 : _c.year}, conseguí ${plainGame.podiums} podio${plainGame.podiums > 1 ? "s" : ""}.`;
                }
                else {
                    // Si no tiene podios, saltar a victorias
                    currentAttempt = 3;
                    if (plainGame.wins > 0) {
                        hint = `En esa temporada ${(_d = plainGame.Season) === null || _d === void 0 ? void 0 : _d.year}, conseguí ${plainGame.wins} victoria${plainGame.wins > 1 ? "s" : ""}.`;
                    }
                    else {
                        // Si no tiene victorias, saltar a equipo
                        currentAttempt = 4;
                        hint = `En esa temporada, corrí para el equipo ${plainGame.team}.`;
                    }
                }
                break;
            case 3:
                // Victorias
                if (plainGame.wins > 0) {
                    hint = `También conseguí ${plainGame.wins} victoria${plainGame.wins > 1 ? "s" : ""}.`;
                }
                else {
                    // Si no tiene victorias, pasar a equipo
                    currentAttempt = 4;
                    hint = `En esa temporada, corrí para el equipo ${plainGame.team}.`;
                }
                break;
            case 4:
                // Equipo
                hint = `En esa temporada, corrí para el equipo ${plainGame.team}.`;
                break;
            case 5:
                // Posición en campeonato
                hint = `Terminé en la posición ${plainGame.champ_pos} en el campeonato de esa temporada.`;
                break;
            default:
                hint = "No hay más pistas disponibles.";
        }
        return res.json({
            hint,
            attemptNumber,
        });
    }
    catch (error) {
        console.error("Error getting hint:", error);
        return res.status(500).json({
            message: "Error getting hint",
        });
    }
});
exports.getNextHint = getNextHint;
/**
 * Renderizar el juego completamente (surrender/ver respuesta)
 */
const surrenderGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required",
            });
        }
        const game = yield associations_1.GuessDriver.findOne({
            where: { id: gameId },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["id", "firstname", "lastname", "image", "nationality"],
                },
                {
                    model: associations_1.Brands,
                    attributes: ["id", "name", "image"],
                },
                {
                    model: associations_1.Seasons,
                    attributes: ["id", "year"],
                },
            ],
        });
        if (!game) {
            return res.status(404).json({
                message: "Game not found",
            });
        }
        const plainGame = game.get({ plain: true });
        return res.json({
            id: plainGame.id,
            driver: plainGame.Driver,
            brand: plainGame.Brand,
            season: (_a = plainGame.Season) === null || _a === void 0 ? void 0 : _a.year,
            podiums: plainGame.podiums,
            wins: plainGame.wins,
            champPos: plainGame.champ_pos,
            team: plainGame.team,
        });
    }
    catch (error) {
        console.error("Error surrendering game:", error);
        return res.status(500).json({
            message: "Error surrendering game",
        });
    }
});
exports.surrenderGame = surrenderGame;

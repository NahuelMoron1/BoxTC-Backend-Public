"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GuessDrivers_1 = require("../controllers/GuessDrivers");
const router = (0, express_1.Router)();
// Ruta para obtener el juego del día
router.get("/play", GuessDrivers_1.getGameOfTheDay);
// Ruta para verificar si el usuario adivinó correctamente el piloto
router.post("/guess", GuessDrivers_1.guessDriver);
// Ruta para obtener el siguiente equipo del piloto
router.post("/next-team", GuessDrivers_1.getNextTeam);
// Ruta para obtener pistas
router.post("/hint", GuessDrivers_1.getHint);
// Ruta para obtener todos los equipos
router.post("/all-teams", GuessDrivers_1.getAllTeams);
// Ruta para obtener información del piloto
router.post("/driver-info", GuessDrivers_1.getDriverInfo);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GuessCareers_1 = require("../controllers/GuessCareers");
const router = (0, express_1.Router)();
// Ruta para obtener el juego del día
router.get("/play", GuessCareers_1.getGameOfTheDay);
// Ruta para verificar si el usuario adivinó correctamente el piloto
router.post("/guess", GuessCareers_1.guessDriver);
// Ruta para obtener el siguiente equipo del piloto
router.post("/next-team", GuessCareers_1.getNextTeam);
// Ruta para obtener pistas
router.post("/hint", GuessCareers_1.getHint);
// Ruta para obtener todos los equipos
router.post("/all-teams", GuessCareers_1.getAllTeams);
// Ruta para obtener información del piloto
router.post("/driver-info", GuessCareers_1.getDriverInfo);
exports.default = router;

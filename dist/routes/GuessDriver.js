"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GuessDriver_1 = require("../controllers/GuessDriver");
const router = (0, express_1.Router)();
// Ruta para obtener el juego del día
router.get("/play", GuessDriver_1.getGameOfTheDay);
// Ruta para hacer un intento de adivinanza
router.post("/guess", GuessDriver_1.guessDriver);
// Ruta para obtener la siguiente pista
router.post("/hint", GuessDriver_1.getNextHint);
// Ruta para rendirse/ver la respuesta
router.post("/surrender", GuessDriver_1.surrenderGame);
exports.default = router;

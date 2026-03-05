import { Router } from "express";
import { getAllTeams, getDriverInfo, getGameOfTheDay, getHint, getNextTeam, guessDriver } from "../controllers/GuessCareers";

const router = Router();

// Ruta para obtener el juego del día
router.get("/play", getGameOfTheDay);

// Ruta para verificar si el usuario adivinó correctamente el piloto
router.post("/guess", guessDriver);

// Ruta para obtener el siguiente equipo del piloto
router.post("/next-team", getNextTeam);

// Ruta para obtener pistas
router.post("/hint", getHint);

// Ruta para obtener todos los equipos
router.post("/all-teams", getAllTeams);

// Ruta para obtener información del piloto
router.post("/driver-info", getDriverInfo);

export default router;
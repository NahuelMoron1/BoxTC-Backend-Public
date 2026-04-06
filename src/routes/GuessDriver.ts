import { Router } from "express";
import {
  getGameOfTheDay,
  getNextHint,
  guessDriver,
  surrenderGame,
} from "../controllers/GuessDriver";

const router = Router();

// Ruta para obtener el juego del día
router.get("/play", getGameOfTheDay);

// Ruta para hacer un intento de adivinanza
router.post("/guess", guessDriver);

// Ruta para obtener la siguiente pista
router.post("/hint", getNextHint);

// Ruta para rendirse/ver la respuesta
router.post("/surrender", surrenderGame);

export default router;

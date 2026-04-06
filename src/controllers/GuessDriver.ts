import { Request, Response } from "express";
import {
  Brands,
  Drivers,
  GuessDriver,
  Seasons,
} from "../models/mysql/associations";

/**
 * Obtener el juego del día
 * Retorna información limitada del piloto (solo la temporada inicialmente)
 */
export const getGameOfTheDay = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const game = await GuessDriver.findOne({
      where: { date: today },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "image"],
        },
        {
          model: Brands,
          attributes: ["id", "name", "image"],
        },
        {
          model: Seasons,
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
      season: plainGame.Season?.year || "",
      seasonID: plainGame.seasonID,
      // No enviar datos del piloto, marca, podios, victorias, etc. aún
    });
  } catch (error) {
    console.error("Error getting game of the day:", error);
    return res.status(500).json({
      message: "Error getting game of the day",
    });
  }
};

/**
 * Hacer un intento de adivinar el piloto
 */
export const guessDriver = async (req: Request, res: Response) => {
  try {
    const { gameId, guessedDriverId } = req.body;

    if (!gameId || !guessedDriverId) {
      return res.status(400).json({
        message: "Game ID and guessed driver ID are required",
      });
    }

    const game = await GuessDriver.findOne({
      where: { id: gameId },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "image", "nationality"],
        },
        {
          model: Brands,
          attributes: ["id", "name", "image"],
        },
        {
          model: Seasons,
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
        season: plainGame.Season?.year,
        podiums: plainGame.podiums,
        wins: plainGame.wins,
        champPos: plainGame.champ_pos,
        team: plainGame.team,
      });
    } else {
      // Adivinanza incorrecta
      return res.json({
        isCorrect: false,
        message: "Incorrect guess. Try again!",
      });
    }
  } catch (error) {
    console.error("Error guessing driver:", error);
    return res.status(500).json({
      message: "Error processing guess",
    });
  }
};

/**
 * Obtener la siguiente pista basada en el número de intentos fallidos
 */
export const getNextHint = async (req: Request, res: Response) => {
  try {
    const { gameId, attemptNumber } = req.body;

    if (!gameId || attemptNumber === undefined) {
      return res.status(400).json({
        message: "Game ID and attempt number are required",
      });
    }

    const game = await GuessDriver.findOne({
      where: { id: gameId },
      include: [
        {
          model: Drivers,
          attributes: ["id"],
        },
        {
          model: Brands,
          attributes: ["id", "name"],
        },
        {
          model: Seasons,
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
        hint = `Durante la temporada ${plainGame.Season?.year}, corrí para la marca ${plainGame.Brand?.name}.`;
        break;

      case 2:
        // Mostrar podios solo si hay al menos 1
        if (plainGame.podiums > 0) {
          hint = `En esa temporada ${plainGame.Season?.year}, conseguí ${plainGame.podiums} podio${plainGame.podiums > 1 ? "s" : ""}.`;
        } else {
          // Si no tiene podios, saltar a victorias
          currentAttempt = 3;
          if (plainGame.wins > 0) {
            hint = `En esa temporada ${plainGame.Season?.year}, conseguí ${plainGame.wins} victoria${plainGame.wins > 1 ? "s" : ""}.`;
          } else {
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
        } else {
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
  } catch (error) {
    console.error("Error getting hint:", error);
    return res.status(500).json({
      message: "Error getting hint",
    });
  }
};

/**
 * Renderizar el juego completamente (surrender/ver respuesta)
 */
export const surrenderGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        message: "Game ID is required",
      });
    }

    const game = await GuessDriver.findOne({
      where: { id: gameId },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "image", "nationality"],
        },
        {
          model: Brands,
          attributes: ["id", "name", "image"],
        },
        {
          model: Seasons,
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
      season: plainGame.Season?.year,
      podiums: plainGame.podiums,
      wins: plainGame.wins,
      champPos: plainGame.champ_pos,
      team: plainGame.team,
    });
  } catch (error) {
    console.error("Error surrendering game:", error);
    return res.status(500).json({
      message: "Error surrendering game",
    });
  }
};

import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  Drivers,
  GuessCareers,
  GuessCareers_Teams,
  Teams,
} from "../models/mysql/associations";

// Obtener el juego del día
export const getGameOfTheDay = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const game = await GuessCareers.findOne({
      where: {
        date: today,
      },
      include: [
        {
          model: Drivers,
          attributes: ["id", "flag"],
        },
        {
          model: GuessCareers_Teams,
          attributes: ["id", "ordered", "start_year", "end_year"],
          include: [
            {
              model: Teams,
              attributes: ["id", "name", "common_name", "logo"],
            },
          ],
        },
      ],
      order: [[GuessCareers_Teams, "ordered", "ASC"]],
    });

    if (!game) {
      return res.status(404).json({
        msg: "No game found for today",
      });
    }

    // Solo enviar el primer equipo inicialmente
    const gameTeams = game.get("GuessCareers_Teams") as any[];
    const firstTeam = gameTeams[0];

    // Obtener el número total de equipos
    const totalTeams = gameTeams.length;

    return res.json({
      id: game.get("id"),
      date: game.get("date"),
      driver_id: game.get("driver_id"),
      Teams: [firstTeam],
      totalTeams: totalTeams, // Agregamos la cantidad total de equipos
      driver_flag:
        game.get("Driver") && typeof game.get("Driver") === "object"
          ? (game.get("Driver") as any).flag
          : undefined,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error getting game of the day",
    });
  }
};

// Verificar si el usuario adivinó correctamente el piloto
export const guessDriver = async (req: Request, res: Response) => {
  try {
    const { gameId, driverGuess } = req.body;

    if (!gameId || !driverGuess) {
      return res.status(400).json({
        msg: "Game ID and driver guess are required",
      });
    }

    const game = await GuessCareers.findOne({
      where: {
        id: gameId,
      },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "nationality", "image"],
        },
      ],
    });

    if (!game) {
      return res.status(404).json({
        msg: "Game not found",
      });
    }

    const driver = game.get("Driver") as any;
    const isCorrect =
      driver.firstname.toLowerCase().includes(driverGuess.toLowerCase()) ||
      driver.lastname.toLowerCase().includes(driverGuess.toLowerCase());

    return res.json({
      correct: isCorrect,
      driver: isCorrect ? driver : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error checking driver guess",
    });
  }
};

// Obtener el siguiente equipo del piloto
export const getNextTeam = async (req: Request, res: Response) => {
  try {
    const { gameId, currentTeamCount } = req.body;

    if (!gameId || currentTeamCount === undefined) {
      return res.status(400).json({
        msg: "Game ID and current team count are required",
      });
    }

    const game = await GuessCareers.findOne({
      where: {
        id: gameId,
      },
      include: [
        {
          model: GuessCareers_Teams,
          attributes: ["id", "ordered", "start_year", "end_year"],
          include: [
            {
              model: Teams,
              attributes: ["id", "name", "common_name", "logo"],
            },
          ],
        },
      ],
      order: [[GuessCareers_Teams, "ordered", "ASC"]],
    });

    if (!game) {
      return res.status(404).json({
        msg: "Game not found",
      });
    }

    const teams = game.get("GuessCareers_Teams") as any[];

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error getting next team",
    });
  }
};

// Obtener pistas para el juego
export const getHint = async (req: Request, res: Response) => {
  try {
    const { gameId, hintNumber } = req.body;

    if (!gameId || hintNumber === undefined) {
      return res.status(400).json({
        msg: "Game ID and hint number are required",
      });
    }

    const game = await GuessCareers.findOne({
      where: {
        id: gameId,
      },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "nationality", "image"],
        },
        {
          model: GuessCareers_Teams,
          attributes: ["id", "ordered", "start_year", "end_year"],
          include: [
            {
              model: Teams,
              attributes: ["id", "name", "common_name", "logo"],
            },
          ],
        },
      ],
      order: [[GuessCareers_Teams, "ordered", "ASC"]],
    });

    if (!game) {
      return res.status(404).json({
        msg: "Game not found",
      });
    }

    let hint = {};

    // Primera pista: nacionalidad del piloto
    if (hintNumber === 1) {
      const driver = game.get("Driver") as any;
      hint = {
        type: "nationality",
        value: driver.nationality,
      };
    }
    // Segunda pista: años de inicio y fin en un equipo aleatorio
    else if (hintNumber === 2) {
      const teams = game.get("GuessCareers_Teams") as any[];
      // Seleccionar un equipo aleatorio que tenga años definidos
      const teamsWithYears = teams.filter(
        (team: any) => team.start_year !== null && team.end_year !== null,
      );

      if (teamsWithYears.length > 0) {
        const randomTeam =
          teamsWithYears[Math.floor(Math.random() * teamsWithYears.length)];
        hint = {
          type: "team_years",
          value: {
            start_year: randomTeam.start_year,
            end_year: randomTeam.end_year,
          },
        };
      } else {
        // Si no hay equipos con años, usar el primer equipo
        hint = {
          type: "team_years",
          value: {
            start_year: teams[0].start_year || "Unknown",
            end_year: teams[0].end_year || "Unknown",
          },
        };
      }
    } else {
      return res.status(400).json({
        msg: "Invalid hint number",
      });
    }

    return res.json({
      hint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error getting hint",
    });
  }
};

// Controlador para obtener todos los equipos
export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        msg: "Game ID is required",
      });
    }

    const game = await GuessCareers.findOne({
      where: {
        id: gameId,
      },
      include: [
        {
          model: GuessCareers_Teams,
          attributes: ["id", "ordered", "start_year", "end_year"],
          include: [
            {
              model: Teams,
              attributes: ["id", "name", "common_name", "logo"],
            },
          ],
        },
      ],
      order: [[GuessCareers_Teams, "ordered", "ASC"]],
    });

    if (!game) {
      return res.status(404).json({
        msg: "Game not found",
      });
    }

    const teams = game.get("GuessCareers_Teams") as any[];

    return res.json({
      teams,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error getting all teams",
    });
  }
};

// Controlador para obtener información del piloto
export const getDriverInfo = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        msg: "Game ID is required",
      });
    }

    const game = await GuessCareers.findOne({
      where: {
        id: gameId,
      },
      include: [
        {
          model: Drivers,
          attributes: ["id", "firstname", "lastname", "nationality", "image"],
        },
      ],
    });

    if (!game) {
      return res.status(404).json({
        msg: "Game not found",
      });
    }

    const driver = game.get("Driver") as any;

    return res.json({
      driver,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error getting driver information",
    });
  }
};

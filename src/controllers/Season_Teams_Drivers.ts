import { Request, Response } from "express";
import {
  Drivers,
  Season_Teams_Drivers,
  Seasons,
  Teams,
} from "../models/mysql/associations";

export const getAllSeason_Teams_Drivers = async (
  req: Request,
  res: Response
) => {
  try {
    const season_tracks = await Season_Teams_Drivers.findAll({
      include: [
        {
          model: Seasons, // Incluye el equipo también si lo necesitas
          attributes: ["year"],
        },
        {
          model: Drivers, // Especifica el modelo que quieres incluir
          attributes: ["firstname", "lastname"],
        }, // Trae solo el campo 'driverName' de la tabla Drivers
        {
          model: Teams, // Incluye el equipo también si lo necesitas
          attributes: ["name"],
        },
      ],
    });

    if (!season_tracks) {
      return res.status(404).json({ message: "No season_tracks found" });
    }

    return res.json(season_tracks);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getBySeason_Teams_Drivers = async (
  req: Request,
  res: Response
) => {
  const { year } = req.params;

  const yearNumber = parseInt(year as string, 10);
  if (isNaN(yearNumber)) {
    return res
      .status(400)
      .json({ message: "Bad request: 'year' must be a number." });
  }

  try {
    const season = await Seasons.findOne({
      where: {
        year: yearNumber,
      },
      attributes: ["id"], // Solo necesitamos el ID para la siguiente consulta
    });

    if (!season) {
      return res
        .status(404)
        .json({ message: `No season found for year: ${yearNumber}` });
    }

    const season_drivers_data = await Season_Teams_Drivers.findAll({
      where: {
        seasonID: season.getDataValue("id"), // Filtra por el ID de la temporada encontrada
      },
      include: [
        {
          model: Drivers,
          attributes: ["firstname", "lastname"],
        },
        {
          model: Teams, // Incluye el equipo también si lo necesitas
          attributes: ["name"],
        },
      ],
    });

    if (!season_drivers_data) {
      return res.status(404).json({ message: "No season_tracks found" });
    }

    /*for (let i = 0; i < season_drivers_data.length; i++) {
      season_drivers_data[i].destroy();
    }*/

    return res.json(season_drivers_data);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

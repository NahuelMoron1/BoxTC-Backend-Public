import { Request, Response } from "express";
import { Season_Teams } from "../models/mysql/associations";

export const getAllSeason_teams = async (req: Request, res: Response) => {
  try {
    const season_teams = await Season_Teams.findAll();

    if (!season_teams) {
      return res.status(404).json({ message: "No season_teams found" });
    }

    return res.json(season_teams);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

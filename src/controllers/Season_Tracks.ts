import { Request, Response } from "express";
import Season_Tracks from "../models/mysql/Seasons_Tracks";

export const getAllSeason_tracks = async (req: Request, res: Response) => {
  try {
    const season_tracks = await Season_Tracks.findAll();

    if (!season_tracks) {
      return res.status(404).json({ message: "No season_tracks found" });
    }

    return res.json(season_tracks);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

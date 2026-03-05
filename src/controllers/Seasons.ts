import { Request, Response } from "express";
import Seasons from "../models/mysql/Seasons";

export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await Seasons.findAll();

    if (!seasons) {
      return res.status(404).json({ message: "No seasons found" });
    }

    return res.json(seasons);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

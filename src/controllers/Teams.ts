import { Request, Response } from "express";
import Teams from "../models/mysql/Teams";

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Teams.findAll();

    if (!teams) {
      return res.status(404).json({ message: "No teams found" });
    }

    return res.json(teams);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

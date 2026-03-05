import { Request, Response } from "express";
import Tracks from "../models/mysql/Tracks";

export const getAllTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await Tracks.findAll();

    if (!tracks) {
      return res.status(404).json({ message: "No tracks found" });
    }

    return res.json(tracks);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

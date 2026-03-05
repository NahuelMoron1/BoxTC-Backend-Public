import { Request, Response } from "express";
import {
  Connections,
  Connections_Groups,
  Connections_Groups_Results,
  Drivers,
  Teams,
  Tracks,
} from "../models/mysql/associations";

export const getGameData = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const challenge = await Connections.findOne({ where: { date: today } });

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No connections challenge for today" });
    }

    return res.status(200).json(challenge);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getGroupsByGameID = async (req: Request, res: Response) => {
  try {
    const { gameID } = req.params;
    if (!gameID) {
      return res.status(400).json({ message: "No ID Provided" });
    }

    const groups = await Connections_Groups.findAll({
      where: { gameID: gameID },
    });

    if (!groups) {
      return res.status(404).json({ message: "No group found" });
    }

    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const guessGroup = async (req: Request, res: Response) => {
  try {
    const gamedata = req.body;
    if (!gamedata || !gamedata.gameID || !gamedata.resultIDs) {
      return res.status(400).json({ message: "No gamedata Provided" });
    }

    const gameID = gamedata.gameID;
    const resultIDs = gamedata.resultIDs;

    if (
      typeof gameID !== "string" ||
      !Array.isArray(resultIDs) ||
      resultIDs.length !== 4
    ) {
      return res
        .status(400)
        .json("Something went wrong while playing connections game");
    }

    const arrayResults: any[] = [];
    const groupCountMap: Record<string, number> = {};

    for (let id of resultIDs) {
      const result = await Connections_Groups_Results.scope("withAll").findOne({
        where: { resultID: id, gameID: gameID },
      });

      if (result) {
        arrayResults.push(result);
        const groupID = result.getDataValue("groupID");
        groupCountMap[groupID] = (groupCountMap[groupID] || 0) + 1;
      }
    }

    let maxGroupID = "";
    let maxCount = 0;

    for (let [groupID, count] of Object.entries(groupCountMap)) {
      if (count > maxCount) {
        maxCount = count;
        maxGroupID = groupID;
      }
    }

    if (maxCount === 4) {
      const matchedGroup = await Connections_Groups.findByPk(maxGroupID);

      if (!matchedGroup) {
        return res.status(404).json({ message: "We didn't find this group" });
      }
      return res.status(200).json({
        matchCount: maxCount,
        group: matchedGroup,
      });
    }

    return res.status(200).json({ matchCount: maxCount });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getResultsByGameID = async (req: Request, res: Response) => {
  try {
    const { gameID, type } = req.params;
    if (!gameID) {
      return res.status(400).json({ message: "No ID Provided" });
    }

    const gameResults = await Connections_Groups_Results.findAll({
      where: { gameID: gameID },
    });

    if (!gameResults) {
      return res.status(404).json({ message: "No results found" });
    }

    const resultIDs = gameResults.map((gr) => gr.getDataValue("resultID"));

    let results: any[] = [];

    if (type === "driver") {
      results = await Drivers.findAll({ where: { id: resultIDs } });
      return res.status(200).json({ driver: results });
    } else if (type === "team") {
      results = await Teams.findAll({ where: { id: resultIDs } });
      return res.status(200).json({ team: results });
    } else if (type === "track") {
      results = await Tracks.findAll({ where: { id: resultIDs } });
      return res.status(200).json({ track: results });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

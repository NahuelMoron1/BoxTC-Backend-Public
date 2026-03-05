import { Request, Response } from "express";
import H2HGames from "../models/mysql/H2HGames";
import { Teams, Drivers } from "../models/mysql/associations";

export const getGameData = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const challenge = await H2HGames.findOne({
      where: { date: today },
      include: [
        {
          model: Teams,
          attributes: ["id", "name", "logo"],
        },
        {
          model: Drivers,
          as: "Driver1",
          attributes: ["id", "firstname", "lastname", "image", "flag"],
        },
        {
          model: Drivers,
          as: "Driver2",
          attributes: ["id", "firstname", "lastname", "image", "flag"],
        },
      ],
      attributes: ["id", "title", "date", "year"],
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No H2H Games challenge for today" });
    }

    return res.status(200).json(challenge);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const guessByOne = async (req: Request, res: Response) => {
  try {
    const { type, id, gameID } = req.body;
    if (
      !type ||
      !id ||
      !gameID ||
      typeof type !== "string" ||
      typeof id !== "string" ||
      typeof gameID !== "string"
    ) {
      return res.status(400).json("Bad request");
    }

    const game = await H2HGames.findByPk(gameID);
    if (!game) {
      return res.status(404).json({ message: "No game found" });
    }

    // Get values for comparison based on the type
    let driver1Value: number;
    let driver2Value: number;
    let correctDriverId: string;

    switch (type) {
      case "qualifying":
        driver1Value = game.getDataValue("qualifying_driver1");
        driver2Value = game.getDataValue("qualifying_driver2");
        correctDriverId =
          driver1Value >= driver2Value
            ? game.getDataValue("driver1_id")
            : game.getDataValue("driver2_id");
        break;
      case "race":
        driver1Value = game.getDataValue("race_driver1");
        driver2Value = game.getDataValue("race_driver2");
        correctDriverId =
          driver1Value >= driver2Value
            ? game.getDataValue("driver1_id")
            : game.getDataValue("driver2_id");
        break;
      case "points":
        driver1Value = game.getDataValue("points_driver1");
        driver2Value = game.getDataValue("points_driver2");
        correctDriverId =
          driver1Value >= driver2Value
            ? game.getDataValue("driver1_id")
            : game.getDataValue("driver2_id");
        break;
      case "points_finishes":
        driver1Value = game.getDataValue("points_finishes_driver1");
        driver2Value = game.getDataValue("points_finishes_driver2");
        correctDriverId =
          driver1Value >= driver2Value
            ? game.getDataValue("driver1_id")
            : game.getDataValue("driver2_id");
        break;
      case "dnfs":
        driver1Value = game.getDataValue("dnf_driver1");
        driver2Value = game.getDataValue("dnf_driver2");
        correctDriverId =
          driver1Value >= driver2Value
            ? game.getDataValue("driver1_id")
            : game.getDataValue("driver2_id");
        break;
      default:
        return res.status(400).json("Bad request");
    }

    const isCorrect = id === correctDriverId;

    return res.status(200).json({
      correct: isCorrect,
      driver1: {
        id: game.getDataValue("driver1_id"),
        value: driver1Value,
      },
      driver2: {
        id: game.getDataValue("driver2_id"),
        value: driver2Value,
      },
      type,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const guessAll = async (req: Request, res: Response) => {
  try {
    const { data, gameID } = req.body;
    if (
      !data ||
      !Array.isArray(data) ||
      !gameID ||
      typeof gameID !== "string"
    ) {
      return res.status(400).json("Bad request");
    }

    const game = await H2HGames.findByPk(gameID);
    if (!game) {
      return res
        .status(404)
        .json({ message: "No H2H Games challenge for today" });
    }

    // Process each guess and collect results
    const results = [];

    for (const item of data) {
      const { type, driverID } = item;

      if (
        !type ||
        !driverID ||
        typeof type !== "string" ||
        typeof driverID !== "string"
      ) {
        return res
          .status(400)
          .json({ message: "Invalid data format in array" });
      }

      // Get values for comparison based on the type
      let driver1Value: number;
      let driver2Value: number;
      let correctDriverId: string;

      switch (type) {
        case "qualifying":
          driver1Value = game.getDataValue("qualifying_driver1");
          driver2Value = game.getDataValue("qualifying_driver2");
          correctDriverId =
            driver1Value >= driver2Value
              ? game.getDataValue("driver1_id")
              : game.getDataValue("driver2_id");
          break;
        case "race":
          driver1Value = game.getDataValue("race_driver1");
          driver2Value = game.getDataValue("race_driver2");
          correctDriverId =
            driver1Value >= driver2Value
              ? game.getDataValue("driver1_id")
              : game.getDataValue("driver2_id");
          break;
        case "points":
          driver1Value = game.getDataValue("points_driver1");
          driver2Value = game.getDataValue("points_driver2");
          correctDriverId =
            driver1Value >= driver2Value
              ? game.getDataValue("driver1_id")
              : game.getDataValue("driver2_id");
          break;
        case "points_finishes":
          driver1Value = game.getDataValue("points_finishes_driver1");
          driver2Value = game.getDataValue("points_finishes_driver2");
          correctDriverId =
            driver1Value >= driver2Value
              ? game.getDataValue("driver1_id")
              : game.getDataValue("driver2_id");
          break;
        case "dnfs":
          driver1Value = game.getDataValue("dnf_driver1");
          driver2Value = game.getDataValue("dnf_driver2");
          correctDriverId =
            driver1Value >= driver2Value
              ? game.getDataValue("driver1_id")
              : game.getDataValue("driver2_id");
          break;
        default:
          return res.status(400).json({ message: `Invalid type: ${type}` });
      }

      const isCorrect = driverID === correctDriverId;

      results.push({
        type,
        correct: isCorrect,
        driver1: {
          id: game.getDataValue("driver1_id"),
          value: driver1Value,
        },
        driver2: {
          id: game.getDataValue("driver2_id"),
          value: driver2Value,
        },
      });
    }

    return res.status(200).json({
      results,
      totalCorrect: results.filter((r) => r.correct).length,
      total: results.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

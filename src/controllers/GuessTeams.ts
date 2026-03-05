import { Request, Response } from "express";
import {
  Drivers,
  GuessTeams,
  Seasons,
  Teams,
} from "../models/mysql/associations";

export const getGameData = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const challenge = await GuessTeams.findOne({
      where: { date: today },
      include: [
        { model: Teams, attributes: ["flag"] },
        { model: Drivers, as: "Driver1", attributes: ["flag"] },
        { model: Drivers, as: "Driver2", attributes: ["flag"] },
        { model: Seasons, attributes: ["year"] },
      ],
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No guess team challenge for today" });
    }

    const plainChallenge = challenge.get({ plain: true });

    const response = {
      id: plainChallenge.id,
      date: plainChallenge.date,
      teamFlag: plainChallenge.Team?.flag,
      tpFlag: plainChallenge.tp_flag,
      driver1Flag: plainChallenge.Driver1?.flag,
      driver2Flag: plainChallenge.Driver2?.flag,
      seasonYear: plainChallenge.Season?.year,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const guessByOne = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.body;

    if (!type || !id || typeof type !== "string" || typeof id !== "string") {
      return res.status(400).json("Bad request");
    }

    const today = new Date().toISOString().split("T")[0];
    const gamedata = await GuessTeams.findOne({
      where: { date: today },
      include: [
        { model: Teams, attributes: ["name", "logo", "flag"] },
        {
          model: Drivers,
          as: "Driver1",
          attributes: ["firstname", "lastname", "image", "flag"],
        },
        {
          model: Drivers,
          as: "Driver2",
          attributes: ["firstname", "lastname", "image", "flag"],
        },
        { model: Seasons, attributes: ["year"] },
      ],
    });

    if (!gamedata) {
      return res.status(404).json({ message: "No game found today" });
    }

    var guessed = false;
    var data;

    switch (type) {
      case "team":
        guessed = id === gamedata.getDataValue("team_id");
        data = {
          name: gamedata.getDataValue("Team").name,
          image: gamedata.getDataValue("Team").logo,
        };
        break;
      case "driver1":
        guessed = id === gamedata.getDataValue("driver1_id");
        data = {
          name:
            gamedata.getDataValue("Driver1").firstname +
            " " +
            gamedata.getDataValue("Driver1").lastname,
          image: gamedata.getDataValue("Driver1").image,
        };
        break;
      case "driver2":
        guessed = id === gamedata.getDataValue("driver2_id");
        data = {
          name:
            gamedata.getDataValue("Driver2").firstname +
            " " +
            gamedata.getDataValue("Driver2").lastname,
          image: gamedata.getDataValue("Driver2").image,
        };
        break;
      case "tp":
        guessed = validateTP(gamedata, id);
        data = {
          name: gamedata.getDataValue("team_principal"),
          image: gamedata.getDataValue("tp_flag"),
        };
        break;
      default:
        break;
    }

    if (!guessed) {
      return res.status(200).json({ message: "Incorrect Guess" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const guessAll = async (req: Request, res: Response) => {
  try {
    const { teamID, driver1ID, driver2ID, tpID } = req.body;

    if (!teamID || !driver1ID || !driver2ID || !tpID) {
      return res.status(400).json({ message: "Bad request" });
    }

    const today = new Date().toISOString().split("T")[0];

    const gamedata = await GuessTeams.findOne({
      where: { date: today },
      include: [
        { model: Teams, attributes: ["name", "logo", "flag"] },
        {
          model: Drivers,
          as: "Driver1",
          attributes: ["firstname", "lastname", "image", "flag"],
        },
        {
          model: Drivers,
          as: "Driver2",
          attributes: ["firstname", "lastname", "image", "flag"],
        },
        { model: Seasons, attributes: ["year"] },
      ],
    });

    if (!gamedata) {
      return res.status(404).json({ message: "No game found today" });
    }

    const team: boolean = teamID === gamedata.getDataValue("team_id");
    const driver1: boolean = driver1ID === gamedata.getDataValue("driver1_id");
    const driver2: boolean = driver2ID === gamedata.getDataValue("driver2_id");
    const tp: boolean = validateTP(gamedata, tpID);

    var gameWon: boolean = false;

    if (!team || !driver1 || !driver2 || !tp) {
      gameWon = false;
    } else {
      gameWon = true;
    }

    return res
      .status(200)
      .json({ gameWon, gamedata, team, driver1, driver2, tp });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const surrender = async (req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0];

  const gamedata = await GuessTeams.findOne({
    where: { date: today },
    include: [
      { model: Teams, attributes: ["name", "logo", "flag"] },
      {
        model: Drivers,
        as: "Driver1",
        attributes: ["firstname", "lastname", "image", "flag"],
      },
      {
        model: Drivers,
        as: "Driver2",
        attributes: ["firstname", "lastname", "image", "flag"],
      },
      { model: Seasons, attributes: ["year"] },
    ],
  });

  if (!gamedata) {
    return res.status(404).json({ message: "No game found today" });
  }

  return res.status(200).json({ gamedata });
};

function validateTP(gamedata: any, tpID: string) {
  const tpStored = gamedata.getDataValue("team_principal") || "";
  const tpInput = tpID || "";

  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, " ");

  const storedNorm = normalize(tpStored);
  const inputNorm = normalize(tpInput);
  const storedWords = storedNorm.split(" ");

  const tp: boolean =
    inputNorm === storedNorm || storedWords.some((w) => inputNorm.includes(w));

  return tp;
}

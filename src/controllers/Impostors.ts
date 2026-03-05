import { Request, Response } from "express";
import { col, fn, literal, Model, Op } from "sequelize";
import {
  Impostors,
  Impostors_Results,
  Season_Teams,
  Season_Teams_Drivers,
  Season_Tracks,
  Seasons,
  Tracks,
} from "../models/mysql/associations";
import Drivers from "../models/mysql/Drivers";
import Teams from "../models/mysql/Teams";

export const playNormalGame = async (req: Request, res: Response) => {
  try {
    const { IDs, gameID } = req.body;

    const challenge = await Impostors.findByPk(gameID);
    if (!challenge) {
      return res.status(404).json({ message: "No challenge found" });
    }

    if (
      !Array.isArray(IDs) ||
      !IDs.every((id: any) => typeof id === "string") ||
      !gameID ||
      typeof gameID !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "An error happened on normal mode impostor game" });
    }

    let impostorIDsSelected: string[] = [];
    let innocentsIDsSelected: string[] = [];

    const allResults = await Impostors_Results.findAll({
      where: { gameID: gameID },
    });

    const allInnocents = allResults
      .filter((r) => r.getDataValue("isImpostor") !== true)
      .map((r) => r.getDataValue("resultID"));

    for (let id of IDs) {
      const result = await Impostors_Results.findOne({
        where: { gameID: gameID, resultID: id },
      });

      if (result && result.getDataValue("isImpostor") === true) {
        impostorIDsSelected.push(id);
      } else if (result && result.getDataValue("isImpostor") !== true) {
        innocentsIDsSelected.push(id);
      }
    }

    const gameWon =
      impostorIDsSelected.length === 0 &&
      innocentsIDsSelected.length ===
        challenge.getDataValue("amount_innocents");

    return res.status(200).json({
      game_won: gameWon,
      impostors_selected: impostorIDsSelected,
      innocents_selected: innocentsIDsSelected,
      all_innocents: allInnocents,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const playOneByOneGame = async (req: Request, res: Response) => {
  try {
    const { resultID, gameID, tryNumber } = req.body;

    const challenge = await Impostors.findByPk(gameID);
    if (!challenge) {
      return res.status(404).json({ message: "No challenge found" });
    }
    if (
      !resultID ||
      typeof resultID !== "string" ||
      !tryNumber ||
      typeof tryNumber !== "number"
    ) {
      return res.status(400).json({ message: "No result found" });
    }

    const amount_innocents = challenge.getDataValue("amount_innocents");

    const candidate = await Impostors_Results.findOne({
      where: { gameID: gameID, resultID: resultID },
    });

    if (!candidate) {
      return res.status(404).json({ message: "No candidate found" });
    }

    const isImpostor = candidate.getDataValue("isImpostor");

    if (isImpostor) {
      const allInnocentsRaw = await Impostors_Results.findAll({
        where: { gameID: gameID, isImpostor: false },
      });

      const allInnocents = allInnocentsRaw.map((r) =>
        r.getDataValue("resultID"),
      );

      return res.status(200).json({
        victory: false,
        game_won: false,
        all_innocents: allInnocents,
      });
    }

    const game_won = amount_innocents === tryNumber;

    return res.status(200).json({
      victory: true,
      game_won: game_won,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getGameData = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-D
    const challenge = await Impostors.findOne({
      where: { date: today },
    });

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No impostor challenge found for today" });
    }

    const players = await Impostors_Results.findAll({
      where: { gameID: challenge.getDataValue("id") },
    });

    if (!players) {
      return res
        .status(404)
        .json({ message: "No results found for this impostor challenge" });
    }

    const id = challenge.getDataValue("id");
    const title = challenge.getDataValue("title");
    const type = challenge.getDataValue("type");
    const results = await getResults(players, type);

    return res.status(200).json({
      id: id,
      title: title,
      type: type,
      results: results,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

async function getResults(results: Model<any, any>[], type: string) {
  console.log(type);

  switch (type) {
    case "driver":
      const driverResults: any[] = [];
      for (let result of results) {
        const driverAux = await Drivers.findByPk(
          result.getDataValue("resultID"),
        );

        if (driverAux) {
          driverResults.push(driverAux);
        }
      }
      return driverResults;
    case "team":
      const teamResults: any[] = [];
      for (let result of results) {
        const driverAux = await Teams.findByPk(result.getDataValue("resultID"));

        if (driverAux) {
          teamResults.push(driverAux);
        }
      }

      return teamResults;
    case "track":
      const trackResults: any[] = [];
      for (let result of results) {
        const driverAux = await Tracks.findByPk(
          result.getDataValue("resultID"),
        );

        if (driverAux) {
          trackResults.push(driverAux);
        }
      }

      return trackResults;
  }
}

function validateAddImpostor(
  type: any,
  year: any,
  fromYear: any,
  toYear: any,
  nationality: any,
  stat: any,
  condition: any,
  value: any,
  isImpostor: any,
) {
  if (
    !type ||
    typeof type !== "string" ||
    !stat ||
    typeof stat !== "string" ||
    !condition ||
    typeof condition !== "string" ||
    !value ||
    typeof value !== "number" ||
    typeof isImpostor !== "boolean"
  ) {
    return false;
  }

  if (!year && (!fromYear || !toYear)) {
    return false;
  }

  if (nationality && typeof nationality !== "string") {
    return false;
  }
  return true;
}

export const findCandidates = async (req: Request, res: Response) => {
  try {
    const {
      type,
      year,
      fromYear,
      toYear,
      nationality,
      stat,
      condition,
      value,
      isImpostor,
    } = req.body;

    const validated = validateAddImpostor(
      type,
      year,
      fromYear,
      toYear,
      nationality,
      stat,
      condition,
      value,
      isImpostor,
    );
    if (!validated) {
      return res.status(400).json({
        message: "Validation for parameters on adding impostor failed",
      });
    }

    const whereCondition: any = {};

    if (nationality) {
      whereCondition.nationality = nationality;
    }

    if (year) {
      whereCondition.year = year.toString();
    } else if (fromYear && toYear) {
      whereCondition.year = {
        [Op.between]: [fromYear.toString(), toYear.toString()],
      };
    }
    let impostor = false;
    if (isImpostor && typeof isImpostor === "boolean") {
      impostor = isImpostor;
    }
    switch (type) {
      case "driver":
        const drivers = await findByDrivers(
          year,
          nationality,
          fromYear,
          toYear,
          stat,
          condition,
          value,
          impostor,
        );
        return res.status(200).json(drivers);
      case "team":
        const teams = await findByTeams(
          year,
          fromYear,
          toYear,
          stat,
          condition,
          value,
          impostor,
        );
        return res.status(200).json(teams);
      case "track":
        const tracks = await findByTracks(
          year,
          fromYear,
          toYear,
          stat,
          condition,
          value,
          impostor,
          1,
        );
        return res.status(200).json(tracks);
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

async function findByDrivers(
  year: string,
  nationality: string,
  fromYear: string,
  toYear: string,
  stat: string,
  condition: string,
  value: string,
  isImpostor: boolean,
) {
  const operatorMap: Record<string, string> = {
    ">": "<=",
    "<": ">=",
    "=": "!=",
    ">=": "<",
    "<=": ">",
  };

  const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
  const havingClause = literal(`SUM(${stat}) ${effectiveCondition} ${value}`);

  const results = await Season_Teams_Drivers.findAll({
    include: [
      {
        model: Drivers,
        attributes: ["id", "firstname", "lastname", "nationality", "image"],
        ...(nationality && { where: { nationality } }),
      },
      {
        model: Seasons,
        attributes: [],
        where: year
          ? { year: year.toString() }
          : fromYear && toYear
            ? {
                year: {
                  [Op.between]: [fromYear.toString(), toYear.toString()],
                },
              }
            : undefined,
      },
    ],
    attributes: ["driverID", [fn("SUM", col(stat)), "totalStat"]],
    group: ["driverID", "Driver.id"],
    order: [[literal("totalStat"), "DESC"]],
    having: havingClause,
  });

  return results
    .map((r: any) => ({
      driver: r.Driver,
      totalStat: r.getDataValue("totalStat"),
    }))
    .filter((d: any) => d);
}

async function findByTeams(
  year: string,
  fromYear: string,
  toYear: string,
  stat: string,
  condition: string,
  value: string,
  isImpostor: boolean,
) {
  const operatorMap: Record<string, string> = {
    ">": "<=",
    "<": ">=",
    "=": "!=",
    ">=": "<",
    "<=": ">",
  };

  const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
  const havingClause = literal(`SUM(${stat}) ${effectiveCondition} ${value}`);

  const results = await Season_Teams.findAll({
    include: [
      {
        model: Teams,
        attributes: [
          "id",
          "name",
          "common_name",
          "championships",
          "base",
          "logo",
        ],
      },
      {
        model: Seasons,
        attributes: [],
        where: year
          ? { year: year.toString() }
          : fromYear && toYear
            ? {
                year: {
                  [Op.between]: [fromYear.toString(), toYear.toString()],
                },
              }
            : undefined,
      },
    ],
    attributes: ["teamID", [fn("SUM", col(stat)), "totalStat"]],
    group: ["teamID", "Team.id"],
    order: [[literal("totalStat"), "DESC"]],
    having: havingClause,
  });

  return results
    .map((r: any) => ({
      team: r.Team,
      totalStat: r.getDataValue("totalStat"),
    }))
    .filter((d: any) => d);
}

async function findByTracks(
  year: string,
  fromYear: string,
  toYear: string,
  stat: string,
  condition: string,
  value: string,
  isImpostor: boolean,
  length: number,
) {
  const operatorMap: Record<string, string> = {
    ">": "<=",
    "<": ">=",
    "=": "!=",
    ">=": "<",
    "<=": ">",
  };

  const effectiveCondition = isImpostor ? operatorMap[condition] : condition;
  const havingClause = literal(`SUM(${stat}) ${effectiveCondition} ${value}`);

  const results = await Season_Tracks.findAll({
    include: [
      {
        model: Tracks,
        attributes: [
          "id",
          "location",
          "track_name",
          "length",
          "country",
          "image",
        ],
      },
      {
        model: Seasons,
        attributes: [],
        where: year
          ? { year: year.toString() }
          : fromYear && toYear
            ? {
                year: {
                  [Op.between]: [fromYear.toString(), toYear.toString()],
                },
              }
            : undefined,
      },
    ],
    attributes: ["teamID", [fn("SUM", col(stat)), "totalStat"]],
    group: ["teamID", "Team.id"],
    order: [[literal("totalStat"), "DESC"]],
    having: havingClause,
  });

  return results
    .map((r: any) => ({
      track: r.Track,
      totalStat: r.getDataValue("totalStat"),
    }))
    .filter((d: any) => d);
}

export const surrenderImpostorGame = async (req: Request, res: Response) => {
  try {
    const { gameID } = req.body;

    if (!gameID || typeof gameID !== "string") {
      return res.status(400).json({ message: "Bad request on surrender" });
    }

    const today = new Date().toISOString().split("T")[0];

    const challenge = await Impostors.findOne({
      where: { id: gameID, date: today },
    });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today" });
    }

    const results = await Impostors_Results.findAll({
      where: { gameID: gameID },
    });

    const impostors = results
      .filter((r) => r.getDataValue("isImpostor") === true)
      .map((r) => r.getDataValue("resultID"));

    const innocents = results
      .filter((r) => r.getDataValue("isImpostor") !== true)
      .map((r) => r.getDataValue("resultID"));

    return res.status(200).json({
      game_won: false,
      impostors: impostors,
      innocents: innocents,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

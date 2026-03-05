import { Request, Response } from "express";
import { col, fn, literal, Op, Sequelize } from "sequelize";
import {
  Season_Teams,
  Season_Teams_Drivers,
  Season_Tracks,
  Seasons,
  Tracks,
} from "../models/mysql/associations";
import Best_tens from "../models/mysql/Best_tens";
import Best_tens_results from "../models/mysql/Best_tens_results";
import Drivers from "../models/mysql/Drivers";
import Teams from "../models/mysql/Teams";
import Manual_Best_tens_results from "../models/mysql/Manual-Best-Tens-Results";
import { Top10Creation } from "../models/enums/Top10Creation";
import { StatQueryOptions } from "../models/IStatQueryOptions";
import { v4 as uuidv4 } from "uuid";

export const getSuggestions = async (req: Request, res: Response) => {
  const { type, input } = req.params;

  if (!input || !type) {
    return res.status(400).json({ message: "Missing input or type" });
  }

  const normalized = input.trim().toLowerCase();
  let results: any[] = [];

  try {
    switch (type) {
      case "driver":
        results = await Drivers.findAll({
          where: Sequelize.where(
            Sequelize.fn(
              "lower",
              Sequelize.fn(
                "concat",
                Sequelize.col("firstname"),
                " ",
                Sequelize.col("lastname")
              )
            ),
            {
              [Op.like]: `%${normalized}%`,
            }
          ),
        });
        break;

      case "team":
        results = await Teams.findAll({
          where: Sequelize.where(Sequelize.fn("lower", Sequelize.col("name")), {
            [Op.like]: `%${normalized}%`,
          }),
        });
        break;

      case "track":
        results = await Tracks.findAll({
          where: Sequelize.where(
            Sequelize.fn("lower", Sequelize.col("track_name")),
            {
              [Op.like]: `%${normalized}%`,
            }
          ),
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    const suggestions = results.map((r) => ({
      id: r.id,
      name:
        type === "driver"
          ? `${r.firstname} ${r.lastname}`
          : type === "team"
          ? r.name
          : r.track_name,
    }));

    return res.status(200).json(suggestions);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching suggestions", error });
  }
};

export const getGameData = async (req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const challenge = await Best_tens.findOne({
    where: { date: today },
  });

  if (!challenge) {
    return res.status(404).json({ message: "No challenge found for today" });
  }

  return res.status(200).json({
    id: challenge.getDataValue("id"),
    title: challenge.getDataValue("title"),
    type: challenge.getDataValue("type"),
    table: challenge.getDataValue("table"),
  });
};

export const playBest10Game = async (req: Request, res: Response) => {
  try {
    const { input, type, gameID } = req.params; ///type means driver/team/track, input means the name the user types

    if (
      !input ||
      typeof input !== "string" ||
      !type ||
      typeof type !== "string" ||
      !gameID ||
      typeof gameID !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Bad request on typing the driver" });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const challenge = await Best_tens.findOne({
      where: { id: gameID, date: today },
    });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today" });
    }

    const resultInGame = await Best_tens_results.findOne({
      where: { gameID: gameID, resultID: input },
    });

    if (!resultInGame) {
      return res.status(404).json({ message: "Incorrect guess" });
    }

    switch (type) {
      case "driver":
        const driver = await Drivers.findByPk(input);
        const driverResult = {
          Driver: driver,
          totalStat: resultInGame.getDataValue("totalStat"),
          position: resultInGame.getDataValue("position"),
        };
        return res.status(200).json(driverResult);
      case "team":
        const team = await Teams.findByPk(input);
        const totalStat = resultInGame.getDataValue("totalStat") || 0;
        const position = resultInGame.getDataValue("position") || 0;
        const teamResult = {
          Team: team,
          totalStat: totalStat,
          position: position,
        };
        return res.status(200).json(teamResult);
      case "track":
        const track = await Tracks.findByPk(input);
        const trackResult = {
          Track: track,
          totalStat: resultInGame.getDataValue("totalStat"),
          position: resultInGame.getDataValue("position"),
        };
        return res.status(200).json(trackResult);
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const surrenderBest10Game = async (req: Request, res: Response) => {
  try {
    const { gameID, type } = req.params;

    if (
      !gameID ||
      typeof gameID !== "string" ||
      !type ||
      typeof type !== "string"
    ) {
      return res.status(400).json({ message: "Bad request on surrender" });
    }

    const today = new Date().toISOString().split("T")[0];

    const challenge = await Best_tens.findOne({
      where: { id: gameID, date: today },
    });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today" });
    }

    const results = await Best_tens_results.findAll({
      where: { gameID: gameID },
      order: [["position", "ASC"]],
    });

    let fullList = [];

    for (const result of results) {
      const resultID = result.getDataValue("resultID");
      const totalStat = result.getDataValue("totalStat") || 0;
      const position = result.getDataValue("position");

      switch (type) {
        case "driver":
          const driver = await Drivers.findByPk(resultID);
          fullList.push({
            Driver: driver,
            totalStat,
            position,
          });
          break;
        case "team":
          const team = await Teams.findByPk(resultID);
          fullList.push({
            Team: team,
            totalStat,
            position,
          });
          break;
        case "track":
          const track = await Tracks.findByPk(resultID);
          fullList.push({
            Track: track,
            totalStat,
            position,
          });
          break;
      }
    }

    return res.status(200).json(fullList);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateBest10GameResults = async (req: Request, res: Response) => {
  ///THIS IS TO UPDATE RESULTS EACH DAY
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const challenge = await Best_tens.findOne({
      where: { date: today },
    });

    if (!challenge) {
      return res.status(404).json({ error: "No challenge found" });
    }

    const creation = challenge.getDataValue("creation");

    if (!creation) {
      return res.status(200).json({
        error: "Nothing to update because the method is not selected",
      });
    }

    await Best_tens_results.truncate();
    const id = challenge.getDataValue("id");

    if (creation === Top10Creation.MANUAL) {
      const updated = await updateManualResults(id);
      if (!updated) {
        return res.status(500).json({
          message:
            "Something happened while getting results, unexpected amount of results",
        });
      }
    } else if (creation === Top10Creation.AUTOMATIC) {
      const updated = await updateAutomaticResults(id, challenge);
      if (!updated) {
        return res
          .status(404)
          .json({ message: "No info found for that search" });
      }
    }

    return res.status(200).json({ message: "Game updated successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
};

async function updateAutomaticResults(
  id: string,
  challenge: any,
  validation?: boolean
) {
  const year = challenge.getDataValue("year");
  const fromYear = challenge.getDataValue("fromYear");
  const toYear = challenge.getDataValue("toYear");
  ///const type = gamedata.type; ///Type refers to: drivers/teams
  const nationality = challenge.getDataValue("nationality");
  const table = challenge.getDataValue("table"); ///Table refers to: points/podiums/wins/laps_led/race_Starts/standings
  const team = challenge.getDataValue("team");
  const sqlTable = challenge.getDataValue("sqlTable");

  let topStats;

  if (year && !nationality && !team) {
    topStats = await getWithoutParams(year, sqlTable, table);
  } else {
    topStats = await getWithParams(
      table,
      nationality,
      fromYear,
      toYear,
      year,
      team,
      sqlTable
    );
  }
  if (!topStats) {
    return false;
  }

  topStats.forEach(async (result, index) => {
    const resultID = getID(sqlTable, result);
    const best10 = {
      id: uuidv4(),
      gameID: id,
      resultID: resultID,
      totalStat: result.getDataValue("totalStat"),
      position: index + 1,
    };

    if (!validation) {
      await Best_tens_results.create(best10);
    } else if (validation === true) {
      return topStats.length === 10;
    }
  });

  return true;
}

async function updateManualResults(id: string) {
  const results = await Manual_Best_tens_results.findAll({
    where: { gameid: id },
  });

  if (results.length !== 10) {
    return false;
  }

  for (let result of results) {
    await Best_tens_results.create(result.toJSON());
  }
  return true;
}

async function getWithoutParams(year: number, sqlTable: string, table: string) {
  let topStats;
  const seasonID = await findSeason(year);

  switch (sqlTable) {
    case "Season_Teams_Drivers":
      topStats = await findStdBySeason(seasonID, table, "DESC");
      break;
    case "Season_Teams":
      topStats = await findSeasonTeamsBySeason(seasonID, table, "DESC");
      break;
    case "Season_Tracks":
      topStats = await findSeasonTracksBySeason(seasonID, table, "DESC");
      break;
    default:
      topStats = undefined;
      break;
  }

  return topStats;
}

async function getWithParams(
  table: string,
  nationality: string,
  fromYear: number,
  toYear: number,
  year: number,
  team: string,
  sqlTable: string
) {
  const options: StatQueryOptions = {
    stat: table,
    nationality,
    fromYear,
    toYear,
    seasonYear: year,
    team,
  };

  let topStats;

  switch (sqlTable) {
    case "Season_Teams_Drivers":
      topStats = await getTopDriversByStat(options);
      break;
    case "Season_Teams":
      topStats = await getTopTeamsByStat(options);
      break;
    case "Season_Tracks":
      topStats = await getTopTracksByStat(options);
      break;
    default:
      topStats = undefined;
      break;
  }

  return topStats;
}

async function findSeason(year: number) {
  try {
    const season = await Seasons.findOne({ where: { year: year } });

    if (!season) {
      return undefined;
    }

    return season.getDataValue("id");
  } catch (error) {
    console.log("ERROR: ", error);
    return undefined;
  }
}

async function findStdBySeason(seasonID: string, table: string, type: string) {
  ///Type means DESC or ASC
  try {
    const std = await Season_Teams_Drivers.findAll({
      where: { seasonID },
      include: [
        {
          model: Drivers,
          attributes: ["firstname", "lastname", "nationality", "image"],
        },
      ],
      attributes: ["driverID", [fn("SUM", col(table)), "totalStat"]],
      group: ["Season_Teams_Drivers.driverID"], // ← agrupás por driver
      order: [[literal("totalStat"), type]], // ← ordenás por el alias
      limit: 10,
    });

    if (!std) {
      return undefined;
    }

    return std;
  } catch (error) {
    console.log("ERROR: ", error);
    return undefined;
  }
}

async function findSeasonTeamsBySeason(
  seasonID: string,
  table: string,
  type: string
) {
  ///Type means DESC or ASC
  try {
    const std = await Season_Teams.findAll({
      where: { seasonID: seasonID },
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
      ],
      order: [[table, type]], // o 'ASC' si querés orden ascendente
      limit: 10,
    });

    if (!std) {
      return undefined;
    }

    return std;
  } catch (error) {
    console.log("ERROR: ", error);
    return undefined;
  }
}

async function findSeasonTracksBySeason(
  seasonID: string,
  table: string,
  type: string
) {
  ///Type means DESC or ASC
  try {
    const std = await Season_Tracks.findAll({
      where: { seasonID: seasonID },
      include: [
        {
          model: Tracks,
          attributes: [
            "id",
            "location",
            "track_name",
            "gmt_offset",
            "length",
            "country",
            "image",
          ],
        },
      ],
      order: [[table, type]], // o 'ASC' si querés orden ascendente
      limit: 10,
    });

    if (!std) {
      return undefined;
    }

    return std;
  } catch (error) {
    console.log("ERROR: ", error);
    return undefined;
  }
}

async function getTopDriversByStat(options: StatQueryOptions) {
  const {
    stat,
    nationality,
    fromYear,
    toYear,
    seasonYear,
    limit = 10,
    order = "DESC",
  } = options;

  try {
    const whereSeason: any = {};
    if (seasonYear) {
      whereSeason.year = seasonYear.toString();
    } else if (fromYear && toYear) {
      whereSeason.year = {
        [Op.between]: [fromYear.toString(), toYear.toString()],
      };
    }

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
          ...(Object.keys(whereSeason).length && { where: whereSeason }),
        },
      ],
      attributes: ["driverID", [fn("SUM", col(stat)), "totalStat"]],
      group: ["driverID", "Driver.id"],
      order: [[literal("totalStat"), order]],
      limit,
    });

    console.log("RESULTS: ", results);

    return results;
  } catch (error) {
    console.error("Error in getTopDriversByStat:", error);
    return undefined;
  }
}

async function getTopTeamsByStat(options: StatQueryOptions) {
  const {
    stat,
    fromYear,
    toYear,
    seasonYear,
    limit = 10,
    order = "DESC",
  } = options;

  try {
    const whereSeason: any = {};
    if (seasonYear) {
      whereSeason.year = seasonYear.toString();
    } else if (fromYear && toYear) {
      whereSeason.year = {
        [Op.between]: [fromYear.toString(), toYear.toString()],
      };
    }

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
          ...(Object.keys(whereSeason).length && { where: whereSeason }),
        },
      ],
      attributes: ["teamID", [fn("SUM", col(stat)), "totalStat"]],
      group: ["teamID", "Team.id"],
      order: [[literal("totalStat"), order]],
      limit,
    });

    return results;
  } catch (error) {
    console.error("Error in getTopTeamsByStat:", error);
    return undefined;
  }
}

async function getTopTracksByStat(options: StatQueryOptions) {
  const {
    stat,
    nationality,
    fromYear,
    toYear,
    seasonYear,
    limit = 10,
    order = "DESC",
  } = options;

  try {
    const whereSeason: any = {};
    if (seasonYear) {
      whereSeason.year = seasonYear.toString();
    } else if (fromYear && toYear) {
      whereSeason.year = {
        [Op.between]: [fromYear.toString(), toYear.toString()],
      };
    }

    const results = await Season_Teams_Drivers.findAll({
      include: [
        {
          model: Drivers,
          attributes: [
            "id",
            "location",
            "track_name",
            "gmt_offset",
            "length",
            "country",
            "image",
          ],
          ...(nationality && { where: { nationality } }),
        },
        {
          model: Seasons,
          attributes: [],
          ...(Object.keys(whereSeason).length && { where: whereSeason }),
        },
      ],
      attributes: ["driverID", [fn("SUM", col(stat)), "totalStat"]],
      group: ["driverID", "Driver.id"],
      order: [[literal("totalStat"), order]],
      limit,
    });

    return results;
  } catch (error) {
    console.error("Error in getTopDriversByStat:", error);
    return undefined;
  }
}

function getID(sqlTable: string, result: any) {
  let resultID = "";
  switch (sqlTable) {
    case "Season_Teams_Drivers":
      resultID = result.getDataValue("driverID");
      break;
    case "Season_Teams":
      resultID = result.getDataValue("teamID");
      break;
    case "Season_Tracks":
      resultID = result.getDataValue("trackID");
      break;
  }

  return resultID;
}

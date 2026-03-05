import { Request, Response } from "express";
import Drivers from "../models/mysql/Drivers";
import GuessWords from "../models/mysql/GuessWords";
import QuestionsGuess from "../models/mysql/QuestionsGuess";
import Teams from "../models/mysql/Teams";
import Tracks from "../models/mysql/Tracks";

export const askQuestions = async (req: Request, res: Response) => {
  /*try {
    const { tableType, value } = req.body;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const gamedata = await GuessWords.findOne({ where: { date: today } });

    if (!gamedata) {
      return res.status(404).json({ message: "No guess game found for today" });
    }

    const resultID = gamedata.getDataValue("resultID");
    const typeResult = gamedata.getDataValue("typeResult");

    const fullName = await getFullname(resultID, typeResult);

    const question = await QuestionsGuess.findOne({
      where: { tableType: tableType, typeResult: typeResult },
    });

    if (!question) {
      return res
        .status(404)
        .json({ message: "No question found with this parameters" });
    }

    const questionResult = question.getDataValue("question");

    const prompt = `
    You are an assistant for a Formula 1 guessing game.
    ${typeResult}: ${fullName}
    Question: "${questionResult} ${value}"
    Answer only with TRUE or FALSE.
  `;

    console.log("PROMPT: ", prompt);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const responseResult = response.choices[0].message?.content?.trim();
    console.log(responseResult);

    return res.status(200).json({ message: "All OK" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error asking the question", error });
  }*/
};

async function getFullname(resultID: string, typeResult: string) {
  var fullName = "";
  if (
    !resultID ||
    typeof resultID !== "string" ||
    !typeResult ||
    typeof typeResult !== "string"
  ) {
    return fullName;
  }

  switch (typeResult) {
    case "driver":
      const driver = await Drivers.findByPk(resultID);
      if (!driver) {
        break;
      }
      fullName =
        driver.getDataValue("firstname") +
        " " +
        driver.getDataValue("lastname");
      break;
    case "team":
      const team = await Teams.findByPk(resultID);
      if (!team) {
        break;
      }
      fullName = team.getDataValue("name");
      break;
    case "track":
      const track = await Tracks.findByPk(resultID);
      if (!track) {
        break;
      }
      fullName = track.getDataValue("track_name");
      break;
  }

  return fullName;
}

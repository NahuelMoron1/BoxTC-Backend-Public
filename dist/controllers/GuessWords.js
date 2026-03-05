"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestions = void 0;
const Drivers_1 = __importDefault(require("../models/mysql/Drivers"));
const Teams_1 = __importDefault(require("../models/mysql/Teams"));
const Tracks_1 = __importDefault(require("../models/mysql/Tracks"));
const askQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.askQuestions = askQuestions;
function getFullname(resultID, typeResult) {
    return __awaiter(this, void 0, void 0, function* () {
        var fullName = "";
        if (!resultID ||
            typeof resultID !== "string" ||
            !typeResult ||
            typeof typeResult !== "string") {
            return fullName;
        }
        switch (typeResult) {
            case "driver":
                const driver = yield Drivers_1.default.findByPk(resultID);
                if (!driver) {
                    break;
                }
                fullName =
                    driver.getDataValue("firstname") +
                        " " +
                        driver.getDataValue("lastname");
                break;
            case "team":
                const team = yield Teams_1.default.findByPk(resultID);
                if (!team) {
                    break;
                }
                fullName = team.getDataValue("name");
                break;
            case "track":
                const track = yield Tracks_1.default.findByPk(resultID);
                if (!track) {
                    break;
                }
                fullName = track.getDataValue("track_name");
                break;
        }
        return fullName;
    });
}

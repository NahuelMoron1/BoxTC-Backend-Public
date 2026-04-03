import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "path";

//routes
import FEwebhookRouter from "../FEwebhook";
import best10Router from "../routes/Best_tens";
import connectionsRouter from "../routes/Connections";
import cookieRouter from "../routes/Cookie";
import emailRouter from "../routes/Email";
import guessCareersRouter from "../routes/GuessCareers";
import guessPodiumsRouter from "../routes/GuessPodiums";
import guessTeamsRouter from "../routes/GuessTeams";
import GuessWordsRouter from "../routes/GuessWords";
import h2hGamesRouter from "../routes/H2HGames";
import impostorRouter from "../routes/Impostors";
import newsRouter from "../routes/News";
import Seasons_TeamsRouter from "../routes/Season_Teams";
import Seasons_Teams_DriversRouter from "../routes/Season_Teams_Drivers";
import Seasons_TracksRouter from "../routes/Season_Tracks";
import SeasonsRouter from "../routes/Seasons";
import TeamsRouter from "../routes/Teams";
import timelineRouter from "../routes/Timeline";
import TracksRouter from "../routes/Tracks";
import userRouter from "../routes/Users";
import wordleRouter from "../routes/Wordle";
import webhookRouter from "../webhook";
//database settings
import db from "../db/connection";
import { ALLOWED_ORIGINS, DB_NAME, MAINTENANCE, PORT } from "./config";

class Server {
  private app: Application;
  private port?: string;
  constructor() {
    this.app = express();
    this.port = PORT;
    this.listen();
    this.middlewares();
    this.routes();
    this.dbConnect();
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("server listening on port ", this.port);
    });
  }
  routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ msg: "api working" });
    });
    this.app.use("/api/seasons", SeasonsRouter);
    this.app.use("/api/tracks", TracksRouter);
    this.app.use("/api/teams", TeamsRouter);
    this.app.use("/api/seasons_tracks", Seasons_TracksRouter);
    this.app.use("/api/seasons_teams", Seasons_TeamsRouter);
    this.app.use("/api/seasons_teams_drivers", Seasons_Teams_DriversRouter);
    this.app.use("/api/wordle", wordleRouter);
    this.app.use("/api/best10", best10Router);
    this.app.use("/api/guess", GuessWordsRouter);
    this.app.use("/api/impostor", impostorRouter);
    this.app.use("/api/connections", connectionsRouter);
    this.app.use("/api/news", newsRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/cookie", cookieRouter);
    this.app.use("/api/guess-teams", guessTeamsRouter);
    this.app.use("/api/guess-podiums", guessPodiumsRouter);
    this.app.use("/api/h2h-games", h2hGamesRouter);
    this.app.use("/api/email", emailRouter);
    this.app.use("/api/guess-careers", guessCareersRouter);
    this.app.use("/api/timeline", timelineRouter);
  }
  middlewares() {
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../../uploads")),
    );
    this.app.use(
      "/backups",
      express.static(path.join(__dirname, "../../backups")),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/webhook", webhookRouter);
    this.app.use("/fewebhook", FEwebhookRouter);
    this.app.use(cookieParser());
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      }),
    );
  }
  async dbConnect() {
    if (!MAINTENANCE) {
      try {
        await db.authenticate();
        console.log("DATABASE CONNECTED: " + DB_NAME);
      } catch (err) {
        console.log("You have an error");
        console.log(err);
      }
    }
  }
}
export default Server;

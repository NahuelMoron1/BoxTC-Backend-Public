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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
//routes
const FEwebhook_1 = __importDefault(require("../FEwebhook"));
const Best_tens_1 = __importDefault(require("../routes/Best_tens"));
const Connections_1 = __importDefault(require("../routes/Connections"));
const Cookie_1 = __importDefault(require("../routes/Cookie"));
const GuessTeams_1 = __importDefault(require("../routes/GuessTeams"));
const GuessWords_1 = __importDefault(require("../routes/GuessWords"));
const Impostors_1 = __importDefault(require("../routes/Impostors"));
const News_1 = __importDefault(require("../routes/News"));
const Season_Teams_1 = __importDefault(require("../routes/Season_Teams"));
const Season_Teams_Drivers_1 = __importDefault(require("../routes/Season_Teams_Drivers"));
const Season_Tracks_1 = __importDefault(require("../routes/Season_Tracks"));
const Seasons_1 = __importDefault(require("../routes/Seasons"));
const Teams_1 = __importDefault(require("../routes/Teams"));
const Tracks_1 = __importDefault(require("../routes/Tracks"));
const Users_1 = __importDefault(require("../routes/Users"));
const Wordle_1 = __importDefault(require("../routes/Wordle"));
const H2HGames_1 = __importDefault(require("../routes/H2HGames"));
const webhook_1 = __importDefault(require("../webhook"));
const Email_1 = __importDefault(require("../routes/Email"));
const GuessCareers_1 = __importDefault(require("../routes/GuessCareers"));
const Timeline_1 = __importDefault(require("../routes/Timeline"));
//database settings
const connection_1 = __importDefault(require("../db/connection"));
const config_1 = require("./config");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.PORT;
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
        this.app.get("/", (req, res) => {
            res.json({ msg: "api working" });
        });
        this.app.use("/api/seasons", Seasons_1.default);
        this.app.use("/api/tracks", Tracks_1.default);
        this.app.use("/api/teams", Teams_1.default);
        this.app.use("/api/seasons_tracks", Season_Tracks_1.default);
        this.app.use("/api/seasons_teams", Season_Teams_1.default);
        this.app.use("/api/seasons_teams_drivers", Season_Teams_Drivers_1.default);
        this.app.use("/api/wordle", Wordle_1.default);
        this.app.use("/api/best10", Best_tens_1.default);
        this.app.use("/api/guess", GuessWords_1.default);
        this.app.use("/api/impostor", Impostors_1.default);
        this.app.use("/api/connections", Connections_1.default);
        this.app.use("/api/news", News_1.default);
        this.app.use("/api/users", Users_1.default);
        this.app.use("/api/cookie", Cookie_1.default);
        this.app.use("/api/guess-teams", GuessTeams_1.default);
        this.app.use("/api/h2h-games", H2HGames_1.default);
        this.app.use("/api/email", Email_1.default);
        this.app.use("/api/guess-careers", GuessCareers_1.default);
        this.app.use("/api/timeline", Timeline_1.default);
    }
    middlewares() {
        this.app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../../uploads")));
        this.app.use("/backups", express_1.default.static(path_1.default.join(__dirname, "../../backups")));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use("/webhook", webhook_1.default);
        this.app.use("/fewebhook", FEwebhook_1.default);
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)({
            origin: config_1.ALLOWED_ORIGINS,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
        }));
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_1.MAINTENANCE) {
                try {
                    yield connection_1.default.authenticate();
                    console.log("DATABASE CONNECTED: " + config_1.DB_NAME);
                }
                catch (err) {
                    console.log("You have an error");
                    console.log(err);
                }
            }
        });
    }
}
exports.default = Server;

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
exports.getAllSeason_tracks = void 0;
const Seasons_Tracks_1 = __importDefault(require("../models/mysql/Seasons_Tracks"));
const getAllSeason_tracks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const season_tracks = yield Seasons_Tracks_1.default.findAll();
        if (!season_tracks) {
            return res.status(404).json({ message: "No season_tracks found" });
        }
        return res.json(season_tracks);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getAllSeason_tracks = getAllSeason_tracks;

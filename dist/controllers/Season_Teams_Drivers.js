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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBySeason_Teams_Drivers = exports.getAllSeason_Teams_Drivers = void 0;
const associations_1 = require("../models/mysql/associations");
const getAllSeason_Teams_Drivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const season_tracks = yield associations_1.Season_Teams_Drivers.findAll({
            include: [
                {
                    model: associations_1.Seasons, // Incluye el equipo también si lo necesitas
                    attributes: ["year"],
                },
                {
                    model: associations_1.Drivers, // Especifica el modelo que quieres incluir
                    attributes: ["firstname", "lastname"],
                }, // Trae solo el campo 'driverName' de la tabla Drivers
                {
                    model: associations_1.Teams, // Incluye el equipo también si lo necesitas
                    attributes: ["name"],
                },
            ],
        });
        if (!season_tracks) {
            return res.status(404).json({ message: "No season_tracks found" });
        }
        return res.json(season_tracks);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getAllSeason_Teams_Drivers = getAllSeason_Teams_Drivers;
const getBySeason_Teams_Drivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    const yearNumber = parseInt(year, 10);
    if (isNaN(yearNumber)) {
        return res
            .status(400)
            .json({ message: "Bad request: 'year' must be a number." });
    }
    try {
        const season = yield associations_1.Seasons.findOne({
            where: {
                year: yearNumber,
            },
            attributes: ["id"], // Solo necesitamos el ID para la siguiente consulta
        });
        if (!season) {
            return res
                .status(404)
                .json({ message: `No season found for year: ${yearNumber}` });
        }
        const season_drivers_data = yield associations_1.Season_Teams_Drivers.findAll({
            where: {
                seasonID: season.getDataValue("id"), // Filtra por el ID de la temporada encontrada
            },
            include: [
                {
                    model: associations_1.Drivers,
                    attributes: ["firstname", "lastname"],
                },
                {
                    model: associations_1.Teams, // Incluye el equipo también si lo necesitas
                    attributes: ["name"],
                },
            ],
        });
        if (!season_drivers_data) {
            return res.status(404).json({ message: "No season_tracks found" });
        }
        /*for (let i = 0; i < season_drivers_data.length; i++) {
          season_drivers_data[i].destroy();
        }*/
        return res.json(season_drivers_data);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getBySeason_Teams_Drivers = getBySeason_Teams_Drivers;

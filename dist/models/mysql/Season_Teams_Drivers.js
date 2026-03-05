"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Season_Teams_Drivers = connection_1.default.define("Season_Teams_Drivers", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    seasonID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    teamID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    driverID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    car_number: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    race_starts: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    laps_led: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    fastest_laps: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    poles: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    points: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    podiums: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    wins: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    standings: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    timestamps: false,
});
exports.default = Season_Teams_Drivers;

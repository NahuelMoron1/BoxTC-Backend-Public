"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Season_Teams = connection_1.default.define("Season_Teams", {
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
    chassis: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    engine: {
        type: sequelize_1.DataTypes.STRING,
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
exports.default = Season_Teams;

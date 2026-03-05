"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const GuessTeams = connection_1.default.define("GuessTeams", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    team_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    team_principal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tp_flag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    driver1_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    driver2_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    season_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = GuessTeams;

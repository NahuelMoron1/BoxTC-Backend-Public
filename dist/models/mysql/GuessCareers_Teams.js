"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const GuessCareers_Teams = connection_1.default.define("GuessCareers_Teams", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    game_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    team_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ordered: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    start_year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    end_year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: false,
});
exports.default = GuessCareers_Teams;

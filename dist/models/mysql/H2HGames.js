"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const H2HGames = connection_1.default.define("H2HGames", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    year: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    team_id: {
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
    total_races: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    qualifying_driver1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    qualifying_driver2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    race_driver1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    race_driver2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    points_driver1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    points_driver2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    dnf_driver1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    dnf_driver2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    points_finishes_driver1: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    points_finishes_driver2: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = H2HGames;

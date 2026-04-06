"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const GuessDriver = connection_1.default.define("GuessDriver", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "Fecha del juego (YYYY-MM-DD)",
    },
    driverID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: "FK: ID del piloto a adivinar",
    },
    brandID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: "FK: ID de la marca/equipo",
    },
    seasonID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: "FK: ID de la temporada",
    },
    podiums: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: "Número de podios en esa temporada",
    },
    wins: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: "Número de victorias en esa temporada",
    },
    champ_pos: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: "Posición final en el campeonato",
    },
    team: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: "Nombre del equipo",
    },
}, {
    timestamps: true,
});
exports.default = GuessDriver;

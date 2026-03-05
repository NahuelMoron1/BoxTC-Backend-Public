"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Season_Tracks = connection_1.default.define("Season_Tracks", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    seasonID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    trackID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    round_number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    laps: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    sprint: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    timestamps: false,
});
exports.default = Season_Tracks;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Manual_Best_tens_results = connection_1.default.define("manual_Best_tens_results", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    gameID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resultID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    totalStat: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    position: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = Manual_Best_tens_results;

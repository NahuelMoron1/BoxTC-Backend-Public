"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Impostors_results = connection_1.default.define("Impostors_results", {
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
        ///ResultID means driverID/teamID/trackID
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isImpostor: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = Impostors_results;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Teams = connection_1.default.define("Teams", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    common_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    championships: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    base: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    popularity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    flag: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: false,
});
exports.default = Teams;

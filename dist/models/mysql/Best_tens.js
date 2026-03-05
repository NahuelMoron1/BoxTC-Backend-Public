"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Top10Creation_1 = require("../enums/Top10Creation");
const Best_tens = connection_1.default.define("best_tens", {
    id: {
        type: sequelize_1.DataTypes.CHAR,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    fromYear: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    toYear: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    nationality: {
        type: sequelize_1.DataTypes.STRING,
    },
    table: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    team: {
        type: sequelize_1.DataTypes.STRING,
    },
    sqlTable: {
        type: sequelize_1.DataTypes.STRING,
    },
    type: {
        //this refers to if it's driver/team/track
        type: sequelize_1.DataTypes.STRING,
    },
    creation: {
        //this refers to if it's manual/automatic
        type: sequelize_1.DataTypes.ENUM(Top10Creation_1.Top10Creation.MANUAL, Top10Creation_1.Top10Creation.AUTOMATIC),
    },
}, {
    timestamps: false,
});
exports.default = Best_tens;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Timeline = connection_1.default.define("Timelines", {
    id: {
        type: sequelize_1.DataTypes.CHAR,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = Timeline;

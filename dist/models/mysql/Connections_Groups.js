"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Connections_Groups = connection_1.default.define("Connections_Groups", {
    id: {
        type: sequelize_1.DataTypes.CHAR,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gameID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    results: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = Connections_Groups;

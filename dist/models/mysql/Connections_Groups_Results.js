"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Connections_Groups_Results = connection_1.default.define("Connections_Groups_Results", {
    id: {
        type: sequelize_1.DataTypes.CHAR,
        primaryKey: true,
    },
    gameID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    groupID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resultID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ["groupID"] }, // Excluir 'password' por defecto
    },
    scopes: {
        withAll: {
            attributes: { include: ["groupID"] }, // Incluir 'password' solo cuando se use este scope
        },
    },
});
exports.default = Connections_Groups_Results;

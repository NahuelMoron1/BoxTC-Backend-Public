"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Connections = connection_1.default.define("Connections", {
    id: {
        type: sequelize_1.DataTypes.CHAR,
        primaryKey: true,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("driver", "team", "track"),
        allowNull: false,
    },
    amount_groups: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = Connections;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const GuessPodiums = connection_1.default.define("GuessPodiums", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    first_place_driver_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    second_place_driver_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    third_place_driver_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    first_place_car_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    second_place_car_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    third_place_car_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = GuessPodiums;

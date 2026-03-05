"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const Tracks = connection_1.default.define("Tracks", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    track_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gmt_offset: {
        type: sequelize_1.DataTypes.STRING,
    },
    length: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    popularity: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    flag: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: false,
});
exports.default = Tracks;

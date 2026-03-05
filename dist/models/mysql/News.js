"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const News = connection_1.default.define("News", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    summary: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    approved: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ["text", "approved"] },
    },
    scopes: {
        withAll: {
            attributes: { include: ["text"] },
        },
    },
});
exports.default = News;

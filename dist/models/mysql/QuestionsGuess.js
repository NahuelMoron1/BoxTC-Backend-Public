"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../db/connection"));
const QuestionsGuess = connection_1.default.define("QuestionsGuesses", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    question: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    typeResult: {
        type: sequelize_1.DataTypes.ENUM("driver", "team", "track"),
        allowNull: false,
    },
    tableType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});
exports.default = QuestionsGuess;

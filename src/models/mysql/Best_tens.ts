import { DataTypes } from "sequelize";
import db from "../../db/connection";
import { Top10Creation } from "../enums/Top10Creation";

const Best_tens = db.define(
  "best_tens",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.NUMBER,
    },
    fromYear: {
      type: DataTypes.NUMBER,
    },
    toYear: {
      type: DataTypes.NUMBER,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    table: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    team: {
      type: DataTypes.STRING,
    },
    sqlTable: {
      type: DataTypes.STRING,
    },
    type: {
      //this refers to if it's driver/team/track
      type: DataTypes.STRING,
    },
    creation: {
      //this refers to if it's manual/automatic
      type: DataTypes.ENUM(Top10Creation.MANUAL, Top10Creation.AUTOMATIC),
    },
  },
  {
    timestamps: false,
  }
);

export default Best_tens;

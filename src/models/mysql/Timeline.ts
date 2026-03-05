import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Timeline = db.define(
  "Timelines",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default Timeline;

import { DataTypes } from "sequelize";
import db from "../../db/connection";

const TimelineEvent = db.define(
  "TimelineEvents",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameID: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default TimelineEvent;

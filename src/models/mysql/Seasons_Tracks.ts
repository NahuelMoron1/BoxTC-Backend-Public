import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Season_Tracks = db.define(
  "Season_Tracks",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    seasonID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    round_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    laps: {
      type: DataTypes.INTEGER,
    },
    sprint: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

export default Season_Tracks;

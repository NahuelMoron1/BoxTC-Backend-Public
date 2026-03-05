import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Season_Teams = db.define(
  "Season_Teams",
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
    teamID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chassis: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    engine: {
      type: DataTypes.STRING,
    },
    poles: {
      type: DataTypes.INTEGER,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    podiums: {
      type: DataTypes.INTEGER,
    },
    wins: {
      type: DataTypes.INTEGER,
    },
    standings: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

export default Season_Teams;

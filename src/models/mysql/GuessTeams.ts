import { DataTypes } from "sequelize";
import db from "../../db/connection";

const GuessTeams = db.define(
  "GuessTeams",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_principal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tp_flag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver1_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver2_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default GuessTeams;

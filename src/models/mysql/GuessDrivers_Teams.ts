import { DataTypes } from "sequelize";
import db from "../../db/connection";

const GuessDrivers_Teams = db.define(
  "GuessDrivers_Teams",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    game_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ordered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    end_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default GuessDrivers_Teams;
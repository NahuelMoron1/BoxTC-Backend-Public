import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Best_tens_results = db.define(
  "Best_tens_results",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    gameID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resultID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalStat: {
      type: DataTypes.INTEGER,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Best_tens_results;

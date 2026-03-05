import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Seasons = db.define(
  "Seasons",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    edition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rounds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Seasons;

import { DataTypes } from "sequelize";
import db from "../../db/connection";

const GuessWords = db.define(
  "GuessWords",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    resultID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeResult: {
      type: DataTypes.ENUM("driver", "team", "track"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default GuessWords;

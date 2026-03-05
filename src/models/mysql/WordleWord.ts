import { DataTypes } from "sequelize";
import db from "../../db/connection";

const WordleWord = db.define(
  "WordleWords",
  {
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default WordleWord;

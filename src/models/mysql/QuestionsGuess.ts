import { DataTypes } from "sequelize";
import db from "../../db/connection";

const QuestionsGuess = db.define(
  "QuestionsGuesses",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeResult: {
      type: DataTypes.ENUM("driver", "team", "track"),
      allowNull: false,
    },
    tableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default QuestionsGuess;

import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Impostors = db.define(
  "Impostors",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_impostors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_innocents: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Impostors;

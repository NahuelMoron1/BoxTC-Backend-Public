import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Drivers = db.define(
  "Drivers",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tv_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default Drivers;

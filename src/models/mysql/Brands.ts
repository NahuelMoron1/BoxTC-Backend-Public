import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Brands = db.define(
  "Brands",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default Brands;

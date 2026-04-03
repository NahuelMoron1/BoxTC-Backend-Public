import { DataTypes } from "sequelize";
import db from "../../db/connection";

const GuessPodiums = db.define(
  "GuessPodiums",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_place_driver_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    second_place_driver_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    third_place_driver_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_place_car_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    second_place_car_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    third_place_car_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default GuessPodiums;

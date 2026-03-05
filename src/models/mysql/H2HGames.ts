import { DataTypes } from "sequelize";
import db from "../../db/connection";

const H2HGames = db.define(
  "H2HGames",
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
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver1_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver2_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_races: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualifying_driver1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualifying_driver2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    race_driver1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    race_driver2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points_driver1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points_driver2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dnf_driver1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dnf_driver2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points_finishes_driver1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    points_finishes_driver2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default H2HGames;

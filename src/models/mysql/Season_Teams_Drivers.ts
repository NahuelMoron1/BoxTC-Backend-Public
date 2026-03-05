import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Season_Teams_Drivers = db.define(
  "Season_Teams_Drivers",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    seasonID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driverID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    car_number: {
      type: DataTypes.INTEGER,
    },
    race_starts: {
      type: DataTypes.INTEGER,
    },
    laps_led: {
      type: DataTypes.INTEGER,
    },
    fastest_laps: {
      type: DataTypes.INTEGER,
    },
    poles: {
      type: DataTypes.INTEGER,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    podiums: {
      type: DataTypes.INTEGER,
    },
    wins: {
      type: DataTypes.INTEGER,
    },
    standings: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

export default Season_Teams_Drivers;

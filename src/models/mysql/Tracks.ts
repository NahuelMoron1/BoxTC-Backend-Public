import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Tracks = db.define(
  "Tracks",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    track_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gmt_offset: {
      type: DataTypes.STRING,
    },
    length: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    popularity: {
      type: DataTypes.INTEGER,
    },
    flag: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default Tracks;

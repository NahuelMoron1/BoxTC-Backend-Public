import { DataTypes } from "sequelize";
import db from "../../db/connection";

const GuessDriver = db.define(
  "GuessDriver",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "Fecha del juego (YYYY-MM-DD)",
    },
    driverID: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "FK: ID del piloto a adivinar",
    },
    brandID: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "FK: ID de la marca/equipo",
    },
    seasonID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "FK: ID de la temporada",
    },
    podiums: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Número de podios en esa temporada",
    },
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Número de victorias en esa temporada",
    },
    champ_pos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Posición final en el campeonato",
    },
    team: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nombre del equipo",
    },
  },
  {
    timestamps: true,
  },
);

export default GuessDriver;

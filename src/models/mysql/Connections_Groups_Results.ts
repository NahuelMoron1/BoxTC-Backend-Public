import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Connections_Groups_Results = db.define(
  "Connections_Groups_Results",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    gameID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resultID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["groupID"] }, // Excluir 'password' por defecto
    },
    scopes: {
      withAll: {
        attributes: { include: ["groupID"] }, // Incluir 'password' solo cuando se use este scope
      },
    },
  }
);

export default Connections_Groups_Results;

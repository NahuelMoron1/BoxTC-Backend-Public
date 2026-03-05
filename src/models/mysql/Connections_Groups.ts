import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Connections_Groups = db.define(
  "Connections_Groups",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gameID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Connections_Groups;

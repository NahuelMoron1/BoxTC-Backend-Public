import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Connections = db.define(
  "Connections",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("driver", "team", "track"),
      allowNull: false,
    },
    amount_groups: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Connections;

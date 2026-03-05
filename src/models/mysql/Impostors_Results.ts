import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Impostors_results = db.define(
  "Impostors_results",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Genera UUID automáticamente
    },
    gameID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resultID: {
      ///ResultID means driverID/teamID/trackID
      type: DataTypes.STRING,
      allowNull: false,
    },
    isImpostor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Impostors_results;

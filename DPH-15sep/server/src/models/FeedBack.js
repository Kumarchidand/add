import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Feedback = sequelize.define("Feedback", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},{tableName: "feedback", timestamps: true, underscored: true,});

export default Feedback;

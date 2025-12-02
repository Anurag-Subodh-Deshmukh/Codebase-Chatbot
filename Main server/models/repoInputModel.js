import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

// Define the model using the shared sequelize instance
const RepoInput = sequelize.define(
  "repoInput",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    repos: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    tableName: "REPO_INPUT",
    timestamps: false,
  }
);

export default RepoInput;

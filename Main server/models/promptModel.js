import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";
import { response } from "express";

// Define the model using the shared sequelize instance
const Prompt = sequelize.define(
  "prompt",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AUTH",
        key: "id",
      },
    },
    chat_id:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    repo_url:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    prompt_title: {  
      type: DataTypes.STRING,
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PROMPT",
    timestamps: false,
  }
);

export default Prompt;


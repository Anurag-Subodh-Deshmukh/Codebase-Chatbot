import { Sequelize, DataTypes } from "sequelize";

export default async function promptModel() {
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB_NAME,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
    }
  );

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
      prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
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

  await sequelize.sync();
  return Prompt;
}


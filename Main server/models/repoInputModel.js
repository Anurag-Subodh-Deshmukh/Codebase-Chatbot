import { Sequelize, DataTypes } from "sequelize";

export default async function repoInputModel() {
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB_NAME,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
    }
  );

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

  await sequelize.sync();
  return RepoInput;
}

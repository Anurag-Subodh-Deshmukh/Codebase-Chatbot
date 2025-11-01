import pkg from "pg";
const { Pool } = pkg;

export default function connectDB() {
  const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: "localhost",
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });

  pool
    .connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err));
}

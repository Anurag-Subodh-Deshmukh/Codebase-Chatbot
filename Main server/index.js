import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => res.send("Server running"));
connectDB();

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

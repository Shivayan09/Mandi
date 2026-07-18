import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

connectDB();

app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
    res.send("User Service Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});

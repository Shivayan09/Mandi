import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Auth Service Running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});

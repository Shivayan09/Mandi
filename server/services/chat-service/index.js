import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";
import chatRouter from "./routes/chat.routes.js";
import cors from "cors";

const app = express();

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use("/", chatRouter);


const server = http.createServer(app);

initializeSocket(server);

server.on("upgrade", (req, socket, head) => {
    console.log("Chat service upgrade:", req.url);
});

server.listen(process.env.PORT, () => {
    console.log(`Chat Service running on port ${process.env.PORT}`);
});

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { initializeSocket } from "./socket/socket.js";

const app = express();

const server = http.createServer(app);

initializeSocket(server);

server.listen(process.env.PORT, () => {
    console.log(`Chat Service running on port ${process.env.PORT}`);
});
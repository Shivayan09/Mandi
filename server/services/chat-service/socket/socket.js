import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

let io;

function readTokenFromCookie(cookieHeader = "") {
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export const initializeSocket = (server) => {
    io = new Server(server, {
        path: "/socket.io",
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.headers["x-user-token"] || readTokenFromCookie(socket.handshake.headers.cookie);

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;

            next();
        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        console.log(socket.user);
        socket.join(`user:${socket.user.userId}`);

        socket.on("joinConversation", async (conversationId) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user.userId,
                });

                if (!conversation) {
                    return;
                }

                socket.join(conversationId);
            } catch {
                return;
            }
        });

        socket.on("sendMessage", async (payload, ack) => {
            try {
                const { conversationId, text } = payload ?? {};
                const cleanText = typeof text === "string" ? text.trim() : "";

                if (!conversationId || !cleanText) {
                    return ack?.({
                        success: false,
                        message: "Conversation and message text are required",
                    });
                }

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.user.userId,
                });

                if (!conversation) {
                    return ack?.({
                        success: false,
                        message: "Conversation not found",
                    });
                }

                const message = await Message.create({
                    conversation: conversationId,
                    sender: socket.user.userId,
                    text: cleanText,
                });

                conversation.lastMessage = message._id;
                await conversation.save();

                io.to(conversationId).emit("message:new", message);

                const otherParticipant = conversation.participants.find(
                    (participant) => String(participant) !== String(socket.user.userId),
                );
                if (otherParticipant) {
                    io.to(`user:${otherParticipant}`).emit("message:new", message);
                    io.to(`user:${otherParticipant}`).emit("conversation:updated", {
                        conversationId,
                        lastMessage: message,
                    });
                }

                ack?.({
                    success: true,
                    message,
                });
            } catch (error) {
                ack?.({
                    success: false,
                    message: "Could not send message",
                });
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${socket.id}`, reason);
        });
    });
};

export const getIO = () => io;
